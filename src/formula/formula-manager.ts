import { IFormula, IFormulaManager } from '../evaluator';
import * as excelFormulas from './excel';

export class FormulaManager implements IFormulaManager {

  private _formulas = {};

  constructor(){
    this._init();
  }

  _init(){
    this._registerInbuiltFormula();
  }

  // register inbuilt formulas
  _registerInbuiltFormula(){
    for(let k in excelFormulas){
      this.registerFormula(excelFormulas[k]);
    }
  }

  // register new formula
  registerFormula(formula: IFormula, overrideExisting: boolean = false): boolean {
    const name = formula.name.toLowerCase();
    if(!overrideExisting && this._formulas[name]){
      return false;
    }

    this._formulas[name] = formula;

    return true;
  }

  // check if formula exists in formula manager
  hasFormula(formulaName: string): boolean {
    const name = formulaName.toLowerCase();
    return !!this._formulas[name];
  }

  // the the registered formula
  getFormula(formulaName: string): IFormula {
    const name = formulaName.toLowerCase();
    return this._formulas[name];
  }
  
}