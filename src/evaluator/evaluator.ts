import { IDataStore } from "./data-store.interface";
import { isBoolean, isNumber, isString } from "../utils/data-type.util";
import { CalcError, ErrorKind } from "./calc-error";
import { IFormulaManager } from "./formula-manager.interface";
import { AsyncResult } from "./async-result";
import { ParserResult, TokenKind } from "../parser/parse-result";
import { CellRange, CellRef } from "../parser/cell-range";

export interface IEvalContext {
  evaluator: ExpEvaluator;
  dataStore: IDataStore;
  scope?: string;
  row: number;
  col: number;
}

export class ExpEvaluator {

  formulaManager: IFormulaManager;

  constructor(fm: IFormulaManager) {
    this.formulaManager = fm;
  }

  evaluate(chain: ParserResult, ctx: IEvalContext) {
    const ret = this._evaluateNode(chain, ctx);
    if(ret instanceof AsyncResult){
      return new AsyncResult(
        ret.tempValue,
        new Promise(async (resolve, reject) => {
          try{
            const val = await ret.awaiter;
            resolve(val);
          }catch(err){
            resolve(new CalcError(ErrorKind.Custom))
          }
        })
      );
    }else {
      return ret;
    }
  }

  private _evaluateNode(node: ParserResult, ctx: IEvalContext) {
    switch (node.kind) {
      // empty formula argument
      case TokenKind.None: {
        return undefined;
      }
      // boolean
      case TokenKind.Boolean: {
        return node.value;
      }
      // string
      case TokenKind.String: {
        return node.value;
      }
      // number
      case TokenKind.Integer:
      case TokenKind.Float: {
        return node.value;
      }
      // uniary operator
      case TokenKind.UniaryOperator: {
        return this._evaluateUniaryOperator(node, ctx);
      }
      // logical operator
      case TokenKind.LogicalOperator: {
        return this._evaluateLogicalOperator(node, ctx);
      }
      // binary operator
      case TokenKind.Operator: {
        return this._evaluateBinaryOperator(node, ctx);
      }
      // cell ref
      case TokenKind.CellRef: {
        return this._evaluateCellRef(node, ctx);
      }
      // cell range ref
      case TokenKind.CellRange: {
        return this._evaluateCellRange(node, ctx);
      }
      // varname
      case TokenKind.VarName: {
        return this._evaluateVarName(node, ctx);
      }
      // formula
      case TokenKind.Formula: {
        return this._evaluateFormula(node, ctx);
      }
    }
  }

  // evaluate formula
  private _evaluateFormula(node: ParserResult, ctx: IEvalContext) {
    if (!this.formulaManager.hasFormula(node.value)) {
      return new CalcError(ErrorKind.Name);
    }

    const formula = this.formulaManager.getFormula(node.value);
    // mismatch argument count
    if(node.childs.length < formula.minArgs || node.childs.length > formula.maxArgs){
      return new CalcError(ErrorKind.Value);
    }
    if (formula.acceptsRef) {
      return formula.evaluate(node.childs, ctx);
    } else {
      const computedArgs = [];
      let isAsync = false;
      let asyncRes = null;
      for (let i = 0; i < node.childs.length; i++) {
        const res = this._evaluateNode(node.childs[i], ctx);
        if (res instanceof CalcError && !formula.acceptsError) {
          return res;
        } else if (res instanceof AsyncResult) {
          isAsync = true;
          if (!asyncRes) {
            asyncRes = res;
          }
          computedArgs.push(res.awaiter);
        } else {
          computedArgs.push(res);
        }
      }

      if (isAsync) {
        return new AsyncResult(
          asyncRes.tempValue,
          new Promise(async (resolve, reject) => {
            try {
              const evaluatedArgs = await Promise.all(computedArgs);
              resolve(formula.evaluate(evaluatedArgs, ctx));
            } catch (err) {
              resolve(new CalcError(ErrorKind.Custom));
            }
          }));
      } else {
        return formula.evaluate(computedArgs, ctx);
      }

    }
  }

  // evaluate varname
  private _evaluateVarName(node: ParserResult, ctx: IEvalContext) {
    return ctx.dataStore.getVariableValue(node.value, ctx.scope);
  }

  // evaluate cell ref
  private _evaluateCellRef(node: ParserResult, ctx: IEvalContext) {
    const cellRef = node.value as CellRef;
    if (!cellRef.isValid) {
      return new CalcError(ErrorKind.Value);
    }

    // get value from data strore
    const val = ctx.dataStore.getComputedValue(cellRef.row, cellRef.column, ctx.scope);
    return val;
  }

  // evaluate cell range
  private _evaluateCellRange(node: ParserResult, ctx: IEvalContext) {
    const rng = node.value as CellRange;

    // get value from data store
    const val = ctx.dataStore.getRangeComputedValue(rng.topRow, rng.leftCol, rng.rowCount, rng.columnCount, ctx.scope);
    return val;
  }

  // evaluate logical operators
  private _evaluateLogicalOperator(node: ParserResult, ctx: IEvalContext) {
    // collect async results
    const asynResults = [];

    // eval left node
    let _res1 = this._evaluateNode(node.childs[0], ctx);
    let isAsync = false;
    if (_res1 instanceof CalcError) {
      return _res1;
    } else if (_res1 instanceof AsyncResult) {
      asynResults[0] = _res1.awaiter;
      isAsync = true;
    } else {
      asynResults[0] = _res1;
    }

    // eval right node
    let _res2 = this._evaluateNode(node.childs[1], ctx);
    if (_res2 instanceof CalcError) {
      return _res2;
    } else if (_res2 instanceof AsyncResult) {
      asynResults[1] = _res2.awaiter;
      isAsync = true;
    } else {
      asynResults[1] = _res2;
    }

    const evalLogical = (res1: any, res2: any) => {
      // error handling
      if (res1 instanceof CalcError) {
        return res1;
      } else if (res2 instanceof CalcError) {
        return res2;
      }

      // assign data type val
      if (typeof res1 != typeof res2) {
        if (isString(res1)) {
          res1 = 2;
        } else if (isNumber(res1)) {
          res1 = 1;
        } else if (isBoolean(res1)) {
          res1 = res1 == true ? 4 : 3;
        }

        if (isString(res2)) {
          res2 = 2;
        } else if (isNumber(res2)) {
          res2 = 1;
        } else if (isBoolean(res2)) {
          res2 = res2 == true ? 4 : 3;
        }
      }

      switch (node.value) {
        case '<': {
          return res1 < res2;
        }
        case '<=': {
          return res1 < res2;
        }
        case '=': {
          return res1 === res2;
        }
        case '>': {
          return res1 > res2;
        }
        case '>=': {
          return res1 >= res2;
        }
      }

      return new CalcError(ErrorKind.Value);
    }

    if (isAsync) {
      return new AsyncResult(
        (_res1.tempValue || _res2.tempValue),
        new Promise(async (resolve, reject) => {
          try {
            const resolvedValues = await Promise.all(asynResults);
            const evaluaedValue = evalLogical(resolvedValues[0], resolvedValues[1]);
            resolve(evaluaedValue);
          } catch (err) {
            resolve(new CalcError(ErrorKind.Custom));
          }
        }));
    } else {
      return evalLogical(_res1, _res2);
    }

  }

  // evalue binary operator node
  private _evaluateBinaryOperator(node: ParserResult, ctx: IEvalContext) {
    // collect async results
    const asynResults = [];

    // eval left node
    let _res1 = this._evaluateNode(node.childs[0], ctx);
    let isAsync = false;
    if (_res1 instanceof CalcError) {
      return _res1;
    } else if (_res1 instanceof AsyncResult) {
      asynResults[0] = _res1.awaiter;
      isAsync = true;
    } else {
      asynResults[0] = _res1;
    }

    // eval right node
    let _res2 = this._evaluateNode(node.childs[1], ctx);
    if (_res2 instanceof CalcError) {
      return _res2;
    } else if (_res2 instanceof AsyncResult) {
      asynResults[1] = _res2.awaiter;
      isAsync = true;
    } else {
      asynResults[1] = _res2;
    }

    // actual binary evaluation
    const evalBinary = (res1: any, res2: any) => {
      // error handling
      if (res1 instanceof CalcError) {
        return res1;
      } else if (res2 instanceof CalcError) {
        return res2;
      }

      // for & operator
      if (node.value === "&") {
        if (!isString(res1) || !isString(res2)) {
          return new CalcError(ErrorKind.Value);
        }

        return res1 + res2;
      }

      // convert bool/string to int
      if (isBoolean(res1)) {
        res1 = +res1;
      } else if (isString(res1)) {
        res1 = Number(res1);
        if (isNaN(res1)) {
          return new CalcError(ErrorKind.Value);
        }
      }
      if (isBoolean(res2)) {
        res2 = +res2;
      } else if (isString(res2)) {
        res2 = Number(res2);
        if (isNaN(res2)) {
          return new CalcError(ErrorKind.Value);
        }
      }

      // check data types
      if (!isNumber(res1) || !isNumber(res2)) {
        return new CalcError(ErrorKind.Value);
      }

      // apply operator
      switch (node.value) {
        case '+': {
          return res1 + res2;
        }
        case '-': {
          return res1 - res2;
        }
        case '*': {
          return res1 * res2;
        }
        case '/': {
          if (res1 === 0 && res2 === 0) {
            return 1;
          } else if (res2 === 0) {
            return new CalcError(ErrorKind.DivideByZero);
          }
          return res1 / res2;
        }
      }
    }

    if (isAsync) {
      return new AsyncResult(
        (_res1.tempValue || _res2.tempValue),
        new Promise(async (resolve, reject) => {
          try {
            const resolvedValues = await Promise.all(asynResults);
            const evaluaedValue = evalBinary(resolvedValues[0], resolvedValues[1]);
            resolve(evaluaedValue);
          } catch (err) {
            resolve(new CalcError(ErrorKind.Custom));
          }
        }));
    } else {
      return evalBinary(_res1, _res2);
    }

  }

  // evaluate value for uniary operator
  private _evaluateUniaryOperator(node: ParserResult, ctx: IEvalContext) {
    let _res = this._evaluateNode(node.childs[0], ctx);

    // actual evaluat function
    const evalUniary = (res) => {
      if (res instanceof CalcError) {
        return res;
      }

      if (isBoolean(res)) {
        res = +res;
      } else if (isString(res) && node.value == "+") {
        return res;
      } else if (isString(res)) {
        res = Number(res);
        if (isNaN(res)) {
          return new CalcError(ErrorKind.Value);
        }
      }

      if (!isNumber(res)) {
        return new CalcError(ErrorKind.Value)
      }

      switch (node.value) {
        case '+': {
          return res;
        }
        case '-': {
          return 0 - res;
        }
      }
    }

    if (_res instanceof AsyncResult) {
      return new AsyncResult(_res.tempValue, new Promise(async (resolve, reject) => {
        try {
          const paramVal = await _res;
          const evaluaedValue = evalUniary(paramVal);
          resolve(evaluaedValue);
        } catch (err) {
          resolve(new CalcError(ErrorKind.Custom));
        }
      }));
    } else {
      return evalUniary(_res);
    }

  }

}