import { IFormula, IFormulaManager } from '../evaluator/formula-manager.interface';
import { ICustomFormula } from './custom-formula.interface';
import { excelFormulas } from './formula';

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
  registerFormula(formula: ICustomFormula, overrideExisting: boolean = false): boolean {
    const name = formula.name.toLowerCase();
    if(!overrideExisting && this._formulas[name]){
      return false;
    }

    this._formulas[name] = this._getFormulaObj(formula);

    return true;
  }

  _getFormulaObj(formulaInfo: ICustomFormula): IFormula {
    let res: IFormula = {
      name: '',
      minArgs: 0,
      maxArgs: Infinity,
      acceptsError: false,
      acceptsRef: false,
      ...formulaInfo
    };

    return res;
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