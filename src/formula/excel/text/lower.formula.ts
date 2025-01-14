import { IEvalContext, IFormula, CalcError, ErrorKind } from "../../../evaluator";
import { isArray, isBoolean, isNumber, isString } from "../../../utils";

// excel lower formula
export const lower: IFormula  = {
  name: "lower",
  minArgs: 1,
  maxArgs: 1,
  acceptsRef: false,
  acceptsError: false,

  evaluate: (args: any[], ctx: IEvalContext) => {
    if(isArray(args[0])){
      return args[0].map(row => row.map(col => (''+col).toLowerCase()));
    }    
    return ('' + args[0]).toLowerCase();
  },
}
