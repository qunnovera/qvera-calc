import { IEvalContext } from "./evaluator";

export interface IFormulaManager {

  hasFormula(formulaName: string): boolean;
  getFormula(formulaName: string): IFormula;

}

export interface IFormula {
  name: string;
  minArgs: number;
  maxArgs: number;
  acceptsRef: boolean;
  acceptsError: boolean;

  evaluate(args: any[], ctx: IEvalContext): any;
}