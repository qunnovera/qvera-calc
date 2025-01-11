/**
 * convert index value to equivalent letter
 * @param num index to convert
 * @returns equivalent letter
 */
export function indexToLetter(num: number): string{
  let ltr = "";

  if(num == 0){
    ltr = "A";
  }

  while(num > 0){
    const last = num % 26;
    ltr = String.fromCharCode(65 + last - (ltr.length > 0? 1: 0)) + ltr;
    num = Math.floor(num / 26);
  }

  return ltr;
}

/**
 * convert letter to equivalent index
 * @param ltr letter to convert
 * @returns equivalent index
 */
export function letterToIndex(ltr: string): number{
  ltr = ltr.toUpperCase();

  let num = 0;
  for(let i = 0; i < ltr.length; i++){
    const pos = ltr.charCodeAt(ltr.length - 1 - i) - 65 + 1;
    num += pos * Math.pow(26, i);
  }

  return num - 1;
}

/**
 * get value from storage and fallback storage based on provided key
 * and scope
 */
export function getScopedValue(key: string, scope: string, data: any): any {
  let ds = data.default;
  if(scope && data.scoped[scope]){
    ds = data.scoped[scope];
  }

  return ds[key] || data.default[key];
}

/**
 * set scoped value 
 */
export function setScopedValue(key: string, value: any, scope: string, data: any) {
  if(scope){
    if(!data.scoped[scope]) {
      data.scoped[scope] = {};
    }

    data.scoped[scope][key] = value;
  }else {
    data.default[key] = value;
  }
}
