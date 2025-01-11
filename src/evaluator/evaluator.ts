import { IDataStore } from "./data-store.interface";
import { CellRange, CellRef, ParserResult, TokenKind } from "../parser"
import { isBoolean, isNumber } from "../utils/data-type.util";
import { CalcError, ErrorKind } from "./calc-error";
import { IFormulaManager } from "./formula-manager.interface";

export interface IEvalContext {
  evaluator: ExpEvaluator;
  dataStore: IDataStore;
  scope?: string;
  row: number;
  col: number;
}

export class ExpEvaluator {

  formulaManager: IFormulaManager;

  constructor(fm: IFormulaManager){
    this.formulaManager = fm;
  }

  evaluate(chain: ParserResult, ctx: IEvalContext){
    return this._evaluateNode(chain, ctx);
  }

  private _evaluateNode(node: ParserResult, ctx: IEvalContext){
    switch(node.kind) {
      // empty formula argument
      case TokenKind.None: {
        return undefined;
      }
      // boolean
      case TokenKind.Boolean: {
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
    if(!this.formulaManager.hasFormula(node.value)){
      return new CalcError(ErrorKind.Name);
    }

    const formula = this.formulaManager.getFormula(node.value);
    if(formula.acceptsRef){
      return formula.evaluate(node.childs, ctx);
    }else {
      const computedArgs = [];
      for(let i = 0; i < node.childs.length; i++){
        const res = this._evaluateNode(node.childs[i], ctx);
        if(res instanceof CalcError && !formula.acceptsError){
          return res;
        }else {
          computedArgs.push(res);
        }
      }
      return formula.evaluate(computedArgs, ctx);
    }
  }

  // evaluate varname
  private _evaluateVarName(node: ParserResult, ctx: IEvalContext) {
    return ctx.dataStore.getVariableValue(node.value, ctx.scope);
  }

  // evaluate cell ref
  private _evaluateCellRef(node: ParserResult, ctx: IEvalContext) {
    const cellRef = node.value as CellRef;
    if(!cellRef.isValid){
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

  // evalue binary operator node
  private _evaluateBinaryOperator(node: ParserResult, ctx: IEvalContext) {
    // eval left node
    let res1 = this._evaluateNode(node.childs[0], ctx);
    if(res1 instanceof CalcError){
      return res1;
    }

    // eval right node
    let res2 = this._evaluateNode(node.childs[1], ctx);
    if(res2 instanceof CalcError){
      return res2;
    }

    // convert bool to int
    if(isBoolean(res1)){
      res1 = +res1;
    }
    if(isBoolean(res2)){
      res2 = +res2;
    }

    // check data types
    if(!isNumber(res1) || !isNumber(res2)){
      return new CalcError(ErrorKind.Value);
    }

    // apply operator
    switch(node.value) {
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
        if(res1 === 0 && res2 === 0){
          return 1;
        } else if(res2 === 0){
          return new CalcError(ErrorKind.DivideByZero);
        }
        return res1 / res2;
      }
    }
  }

  // evaluate value for uniary operator
  private _evaluateUniaryOperator(node: ParserResult, ctx: IEvalContext) {
    let res = this._evaluateNode(node.childs[0], ctx);
    if(res instanceof CalcError){
      return res;
    }

    if(isBoolean(res)){
      res = +res;
    }

    if(!isNumber(res)){
      return new CalcError(ErrorKind.Value)
    }

    switch(node.value) {
      case '+': {
        return res;
      }
      case '-': {
        return 0 - res;
      }
    }
  }

}