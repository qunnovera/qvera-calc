import { IEvalContext, IFormula, CalcError, ErrorKind } from "../../evaluator";
import { isArray, isBoolean, isNumber } from "../../utils";

// excel sum formula
export const SUM: IFormula  = {
  name: "sum",
  minArgs: 1,
  maxArgs: Infinity,
  acceptsRef: false,
  acceptsError: false,

  evaluate: (args: any[], ctx: IEvalContext) => {
    let sum = 0;

    for(let i = 0; i < args.length; i++){
      const arg = args[i];
      if(isArray(arg)){
        for(let r of arg){
          for(let c of r){
            if(isBoolean(c)){
              sum += +c;
            }else if(isNumber(c)){
              sum += c;
            }else {
              return new CalcError(ErrorKind.Value);
            }
          }
        }
      }else if(isBoolean(arg)){
        sum += +arg;
      }else if(isNumber(arg)){
        sum += arg;
      }else {
        return new CalcError(ErrorKind.Value);
      }

    }

    return sum;
  },
}
