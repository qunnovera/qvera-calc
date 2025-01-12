export enum TokenKind {
  None,
  Integer,
  Boolean,
  Float,
  String,
  VarName,
  CellRef,
  CellRange,
  Operator,
  UniaryOperator,
  LogicalOperator,
  OpenParan,
  CloseParan,
  InnerExpression,
  Formula,
}

export class ParserResult {

  /** private storage */
  private _kind: TokenKind;
  private _value: any;
  private _childs: ParserResult[];

  get kind(): TokenKind{
    return this._kind;
  };

  get value(): any {
    return this._value;
  };

  get childs(): ParserResult[] {
    return this._childs
  }

  constructor(kind, value, childs: any[] = []){
    this._kind = kind;
    this._value = value;
    this._childs = childs;
  }
}
