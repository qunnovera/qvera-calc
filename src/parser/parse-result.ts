export enum TokenKind {
  Integer,
  Float,
  VarName,
  CellRef,
  CellRange,
  Operator,
  UniaryOperator,
  OpenParan,
  CloseParan
}

export class ParserResult {
  kind: TokenKind;
  value: any;
  childs: ParserResult[]  = [];

  constructor(kind, value){
    this.kind = kind;
    this.value = value;
  }
}
