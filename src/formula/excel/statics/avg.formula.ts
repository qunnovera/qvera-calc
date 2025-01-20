import { CalcError, ErrorKind } from "../../../evaluator/calc-error";
import { IEvalContext } from "../../../evaluator/evaluator";
import { IFormula } from "../../../evaluator/formula-manager.interface";
import { isArray, isBoolean, isNumber } from "../../../utils/data-type.util";

// excel avg formula
export const AVG: IFormula  = {
  name: "average",
  minArgs: 1,
  maxArgs: Infinity,
  acceptsRef: false,
  acceptsError: false,

  evaluate: (args: any[], ctx: IEvalContext) => {
    let sum = 0, count = 0;

    for(let i = 0; i < args.length; i++){
      const arg = args[i];
      count++;
      if(isArray(arg)){
        for(let r of arg){
          for(let c of r){
            count++;
            if(isBoolean(c)){
              sum += +c;
            }else if(isNumber(c)){
              sum += c;
            }else {
              return new CalcError(ErrorKind.Value);
            }
          }
        }
        count--;
      }else if(isBoolean(arg)){
        sum += +arg;
      }else if(isNumber(arg)){
        sum += arg;
      }else {
        return new CalcError(ErrorKind.Value);
      }

    }
    
    return sum/count;
  },
}
