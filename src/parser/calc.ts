import * as lx from "@sharadt/lexicons";
import * as lxp from "@sharadt/lexicons/parsers";
import { ParserResult, TokenKind } from "./parse-result";
import { CellRange, CellRef } from "./cell-range";
import { Str } from "./util/str.parser";
import { nestedEq } from "./util/nested-eq.parser";
import { ManySept } from "./util/many-sept.parser";
import { strValue } from "./util/str-value.parser";

// letters
const letters = lxp.StringParsers.alphabets;

// digits
const digits = lxp.StringParsers.Regex("\\d+");

// space
const space = lxp.StringParsers.Regex("\\s+");

// optional space
const oSpace = lxp.StringParsers.Regex("\\s*");

// boolean
const bool = lxp.StringParsers.Regex("(true|false)", "i")
  .map(res => new ParserResult(
    TokenKind.Boolean,
    res.toLowerCase() === "true"
  ));

// string values
const strDataType = strValue
  .map(res => new ParserResult(
    TokenKind.String,
    res
  ));

// number
const num = lxp.NumberParsers.integer
  .map(res => new ParserResult(
    TokenKind.Integer,
    parseInt(res)
  ));

// float
const float = lxp.NumberParsers.float
  .map(res => new ParserResult(
    TokenKind.Float,
    parseFloat(res)
  ));

// varname, start with letter and may contain only letters and digits
const varname = lxp.StringParsers.Regex("[a-zA-Z]+[\\w\\d]*")
  .map(res => new ParserResult(
    TokenKind.VarName,
    res
  ));

// cell ref
const cellRef = lx.Sequence([letters, digits])
  .map(res => new ParserResult(
    TokenKind.CellRef,
    CellRef.fromCellName(res[0] + res[1])
  ));

// cell range ref
const cellRange = lx.Sequence([
  cellRef,
  Str(':'),
  cellRef
]).map(res => new ParserResult(
  TokenKind.CellRange,
  CellRange.fromCellRef(res[0].value, res[2].value)
));

// operators
const operator = lx.Choice(
  [Str('+'), Str('-'), Str('*'), Str('/') , Str('&'), Str('>='), Str('<='), Str('>'), Str('<'), Str('=')]
).map(res => {
  switch(res){
    case '>=':
    case '<=':
    case '>':
    case '=':
    case '<': {
      return new ParserResult(
        TokenKind.LogicalOperator,
        res
      )
    }
    default: {
      return new ParserResult(
        TokenKind.Operator,
        res
      )
    }
  }
});

// open paran
const openParan = Str('(').map(res => new ParserResult(
  TokenKind.OpenParan,
  res
));

// close paran
const closeParan = Str(')').map(res => new ParserResult(
  TokenKind.CloseParan,
  res
));

// formula arguments
const formulaOperandParser = nestedEq.chain((res) => {
  return new lx.Parser((state) => {
    if (res == '') {
      return lx.StateUtils.withResult(state, new ParserResult(TokenKind.None, ''));
    }
    const innerEqRes = CalcParser.instance.run(res);
    if (innerEqRes.isError) {
      return lx.StateUtils.withError(state, innerEqRes.err);
    }
    return lx.StateUtils.withResult(state, innerEqRes.result);
  })
});

// formula parser
const formulaParser = lx.Sequence([
  varname,
  openParan,
  ManySept(formulaOperandParser, lxp.StringParsers.Regex('^\\s*,\\s*')),
  closeParan
]).map(res => new ParserResult(
  TokenKind.Formula,
  res[0].value,
  res[2]
));

const operand = lx.Choice([
  strDataType,
  formulaParser,
  bool,
  cellRange,
  cellRef,
  varname,
  float,
  num
]);

const eq = lx.SeptBy(lx.Choice([
  operator,
  operand,
  openParan,
  closeParan
]), oSpace).chain(res => {
  return new lx.Parser((state) => {
    if(state.index >= state.inputString.length){
      return state;
    }else {
      return lx.StateUtils.withError(state, `Failed to parse complete input string`);
    }
  })
});


export class CalcParser {

  private constructor() { }

  private _opPriority = {
    '>': 1,
    '>=': 1,
    '<': 1,
    '<=': 1,
    '=': 1,
    '+': 2,
    '-': 2,
    '*': 3,
    '/': 3,
    'u+': 4,
    'u-': 4
  };

  run(eqStr: string) {
    const pState = eq.run(eqStr);
    if (pState.isError) {
      return pState;
    }

    // get tokens arr
    const tokensArr: ParserResult[] = pState.result;
    // detect uniary operators
    this._detectAndUpdateUniaryOperators(tokensArr);
    // convert to postfix
    const postfix = this._infixToPostfix(tokensArr);

    try {
      const calcChain = this._postfixToCalcChain(postfix);
      return lx.StateUtils.withResult(pState, calcChain);
    } catch (err) {
      return lx.StateUtils.withError(pState, err);
    }

  }

  // convert postfix equation to calc chain tree
  private _postfixToCalcChain(tokensArr: ParserResult[]) {
    let stack = [];

    for (let i = 0; i < tokensArr.length; i++) {
      const cur = tokensArr[i];
      if (cur.kind === TokenKind.UniaryOperator) {
        if (!stack.length) {
          throw `Cannot get enough arguments for ${cur.value}`;
        }
        cur.childs.push(stack.pop());
        stack.push(cur);
      } else if (cur.kind === TokenKind.Operator || cur.kind === TokenKind.LogicalOperator) {
        if (stack.length < 2) {
          throw `Cannot get enough arguments for ${cur.value}`;
        }
        cur.childs.unshift(stack.pop());
        cur.childs.unshift(stack.pop());
        stack.push(cur);
      } else {
        stack.push(cur);
      }
    }

    if (stack.length != 1) {
      throw `Incorrect number of operands and operators`;
    }

    return stack.pop();
  }

  // find and update uniary token in tokens array
  private _detectAndUpdateUniaryOperators(tokensArr: ParserResult[]) {
    for (let i = tokensArr.length - 1; i > 0; i--) {
      const curToken = tokensArr[i],
        prevToken = tokensArr[i - 1];
      if (
        curToken.kind === TokenKind.Operator &&
        (prevToken.kind === TokenKind.Operator || prevToken.kind === TokenKind.OpenParan) &&
        (curToken.value === "+" || curToken.value === "-")
      ) {
        tokensArr[i] = new ParserResult(TokenKind.UniaryOperator, curToken.value, curToken.childs);
      }
    }
    // check or first token
    const firstToken = tokensArr[0];
    if (
      firstToken.kind === TokenKind.Operator &&
      (firstToken.value === "+" || firstToken.value === "-")
    ) {
      tokensArr[0] = new ParserResult(TokenKind.UniaryOperator, firstToken.value, firstToken.childs);
    }
  }

  // convert infix tokens array to postfix
  private _infixToPostfix(tokensArr: ParserResult[]) {
    const postfix: ParserResult[] = [];
    const opStack: ParserResult[] = [];

    for (let i = 0; i < tokensArr.length; i++) {
      const token = tokensArr[i];
      switch (token.kind) {

        case TokenKind.OpenParan: {
          opStack.push(token);
          break;
        }

        case TokenKind.CloseParan: {
          for (let i = opStack.length - 1; i >= 0; i--) {
            const op = opStack.pop();
            if (op.kind === TokenKind.OpenParan) {
              break;
            }
            postfix.push(op);
          }
          break;
        }

        case TokenKind.Operator:
        case TokenKind.LogicalOperator:
        case TokenKind.UniaryOperator: {
          // push conditions, stack is empty, current scanned is high priority, or stack top is open paren
          if (!opStack.length) {
            opStack.push(token); // empty operator stack
          } else {
            const stackOp = opStack[opStack.length - 1];
            if (stackOp.kind === TokenKind.OpenParan) {
              opStack.push(token); // operator stack top is openparen
            } else if (this._getPriority(token) > this._getPriority(stackOp)) {
              opStack.push(token); // current operator is highr priority than stack top operator
            } else {
              // remove all higher or same priority operator from stack top until empty or open paren is reached
              for (let i = opStack.length - 1; i >= 0; i--) {
                const stackOp = opStack[i];
                if (stackOp.kind === TokenKind.OpenParan) {
                  break;
                }
                if (this._getPriority(stackOp) >= this._getPriority(token)) {
                  postfix.push(stackOp);
                  opStack.pop();
                }
              }
              opStack.push(token);
            }
          }
          break;
        }

        default: {
          postfix.push(token);
        }
      }
    }

    while (opStack.length) {
      postfix.push(opStack.pop())
    }

    return postfix;
  }

  // get priority of a operator token
  private _getPriority(op: ParserResult) {
    if (op.kind === TokenKind.UniaryOperator) {
      return this._opPriority['u' + op.value];
    }

    return this._opPriority[op.value];
  }

  private static _instance: CalcParser;
  static get instance() {
    if (!CalcParser._instance) {
      CalcParser._instance = new CalcParser();
    }
    return CalcParser._instance;
  }

}

