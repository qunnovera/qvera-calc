import { IEvalContext } from "../../../evaluator/evaluator";
import { IFormula } from "../../../evaluator/formula-manager.interface";
import { isArray, isBoolean, isNumber } from "../../../utils/data-type.util";

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
