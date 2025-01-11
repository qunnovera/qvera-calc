export interface IDataStore {

  getVariableValue(varName: string, ctx?: string): any; 
  getComputedValue(r: number, c: number, ctx?: string): any;
  getRangeComputedValue(r: number, c: number, rc: number, cc: number, ctx?: string): any[][];

}
