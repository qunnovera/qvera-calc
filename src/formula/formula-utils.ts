import { isArray } from "../utils/data-type.util";

/**
 * flattens list of argument to 1D array
 * @param args formula arguments
 * @returns 1D  array of formula argument
 */
export function flattenArgs(args: any[]): any[] {
  const out = [];

  args.forEach(arg => {
    if (isArray(arg)) {
      for (let r of arg) {
        for (let c of r) {
          out.push(c);
        }
      }
    } else {
      out.push(arg);
    }
  })

  return out;
}

/**
 * Iterate over each value of formula argument, recursively including 
 * elements of range arguments
 * @param args formula arguments
 * @param fn callback function, return true to stop iterating furter values
 */
export function iterateArgs(args: any[], fn: (arg: any) => boolean) {
  for(let arg of args){
    if (isArray(arg)) {
      for (let r of arg) {
        for (let c of r) {
          if(fn(c)){
            return;
          }
        }
      }
    } else {
      if(fn(arg)){
        return;
      }
    }
  }
}
