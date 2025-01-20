import { IDataStore } from "../evaluator/data-store.interface";
import { CellRef } from "../parser/cell-range";
import { getScopedValue, setScopedValue } from "../utils/util";

export class SimpleDataStore implements IDataStore {

  private _varStore = {
    scoped: {},
    default: {}
  };

  private _data = {
    scoped: {},
    default: []
  };

  constructor(){
    this._init();
  }

  _init(){
  }

  getVariableValue(varName: string, scope?: string): any {
    return getScopedValue(varName, scope, this._varStore);
  }

  setVariableValue(varName: string, value: any, scope?: string): any {
    setScopedValue(varName, value, scope, this._varStore);
  }

  setCellValueByName(cellName: string, value: any, scope?: string) {
    
    const cellRef = CellRef.fromCellName(cellName);
    if(!cellRef.isValid){
      throw 'invalid cell name';
    }

    this._setValue(cellRef.row, cellRef.column, value, scope);
  }

  setCellValue(r: number, c: number, value: any, scope?: string){
    if(r < 0 || c < 0) {
      throw 'invalid cell index';
    }

    this._setValue(r, c, value, scope);
  }

  _setValue(r: number, c: number, value: any, scope?: string) {
    let d = scope? this._data.scoped[scope]: this._data.default;
    if(!d){
      d = this._data.scoped[scope] = [];
    }
        
    if(!d[r]){
      d[r] = []
    }

    if(!d[r][c]){
      d[r][c] = []
    }

    d[r][c] = value;

  }

  getComputedValue(r: number, c: number, scope?: string): any {
    let d = scope? this._data.scoped[scope]: this._data.default;
    if(!d){
      return 0;
    }

    if(!d[r] || d[r][c] === undefined){
      return 0;
    }
    return d[r][c];
  }

  getRangeComputedValue(r: number, c: number, rc: number, cc: number, scope?: string): any[][] {
    let d = scope? this._data.scoped[scope]: this._data.default;
    if(!d){
      return [];
    }

    return (d as any[]).slice(r, r+rc).map(row => (row || []).slice(c, c + cc));
  }

}
