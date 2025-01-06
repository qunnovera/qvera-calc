import { indexToLetter, letterToIndex } from "../utils";

export class CellRef {
  _r: number = -1;
  _c: number = -1;
  _rRelative: boolean = true;
  _cRelative: boolean = true;

  private _name: string;

  get row(){
    return this._r;
  }

  get column(){
    return this._c;
  }

  get rowRelative(){
    return this._rRelative;
  }

  get colRelative(){
    return this._cRelative;
  }

  get isValid(){
    return this._r >= 0 && this._c >= 0;
  }

  get name(){
    this._ensureName();
    return this._name;
  }

  constructor(r: number, c: number, rowRelative: boolean = true, colRelative: boolean = true){
    this._r = r;
    this._c = c;
    this._rRelative = rowRelative;
    this._cRelative = colRelative;
  }

  private _ensureName(){
    if(!this._name){
      let name = "";
      if(!this.colRelative){
        name += "$"
      }
      if(this.column > -1){
        name += indexToLetter(this.column);
      }
      if(!this.rowRelative){
        name += "$"
      }
      if(this.row > -1){
        name += (this.row + 1);
      }
      this._name = name;
    }
  }

  static fromCellName(name: string){
    const rgx = /^(\$?)([a-zA-Z]+)(\$?)([0-9]*)$/;
    const res = rgx.exec(name);

    if(!res){
      return new CellRef(-1, -1);
    }

    return new CellRef(parseInt(res[4]) - 1, letterToIndex(res[2]), res[3] != "$", res[1] != "$");
  }
}

export class CellRange {
  _r: number = -1;
  _c: number = -1;
  _r2: number = -1;
  _c2: number = -1;
  _rRelative: boolean = true;
  _cRelative: boolean = true;
  
  private _name: string;

  get row(){
    return this._r;
  }

  get col() {
    return this._c;
  }

  get row2(){
    return this._r2;
  }

  get col2(){
    return this._c2;
  }

  get rowCount(){
    if(this._r < 0 || this._r2 < 0){
      return -1;
    }
    return Math.abs(this._r - this._r2) + 1;
  }

  get columnCount(){
    if(this._c < 0 || this._c2 < 0){
      return -1;
    }
    return Math.abs(this._c - this._c2);
  }

  get topRow(){
    return Math.min(this._r, this._r2);
  }

  get bottomRow(){
    return Math.max(this._r + this._r2);
  }

  get leftCol(){
    return Math.min(this._c, this._c2);
  }

  get rightCol(){
    return Math.max(this._c, this._c2);
  }

  get rowRelative(){
    return this._rRelative;
  }

  get colRelative(){
    return this._cRelative;
  }

  get isValid(){
    // if any of the row/col is negative but not the other one
    // then range is invalid
    let rc = 0, cc = 0;
    if(this._r < 0){
      rc++
    }
    if(this._r2 < 0){
      rc++;
    }
    if(this._c < 0){
      cc++;
    }
    if(this._c2 < 0){
      cc++;
    }
    return rc != 1 && cc != 1;
  }

  constructor(r: number, c: number, r2?: number, c2?: number, rowRelative: boolean = true, colRelative: boolean = true){
    if(r2 == null){
      r2 = r;
    }
    if(c2 == null){
      c2 = c;
    }

    this._r = r;
    this._r2 = r2;
    this._c = c;
    this._c2 = c2;
    this._rRelative = rowRelative;
    this._cRelative = colRelative;
  }

  static fromCellRef(cellRef1: CellRef, cellRef2: CellRef){
    return new CellRange(cellRef1.row, cellRef1.column, cellRef2.row, cellRef2.column, cellRef1.rowRelative || cellRef2.rowRelative, cellRef1.colRelative || cellRef2.colRelative);
  }

}
