export enum ErrorKind {
  Value,
  DivideByZero,
  Name,
  NotImplemented,
  Parse,
  Custom
}

export class CalcError {
  kind: ErrorKind;

  constructor(kind: ErrorKind){
    this.kind = kind;
  }
}