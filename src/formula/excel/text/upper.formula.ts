import { IEvalContext } from "../../../evaluator/evaluator";
import { IFormula } from "../../../evaluator/formula-manager.interface";
import { isArray, isBoolean, isNumber } from "../../../utils/data-type.util";

// excel upper formula
export const Upper: IFormula  = {
  name: "upper",
  minArgs: 1,
  maxArgs: 1,
  acceptsRef: false,
  acceptsError: false,

  evaluate: (args: any[], ctx: IEvalContext) => {
    if(isArray(args[0])){
      return args[0].map(row => row.map(col => (''+col).toUpperCase()));
    }    
    return ('' + args[0]).toUpperCase();
  },
}
