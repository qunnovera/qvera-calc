import { IEvalContext } from "../evaluator/evaluator";

export interface ICustomFormula {
  name: string;
  minArgs?: number;
  maxArgs?: number;
  acceptsRef?: boolean;
  acceptsError?: boolean;

  evaluate(args: any[], ctx: IEvalContext): any;
}

export const ____testval = "";