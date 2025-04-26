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

  toString() {
    switch(this.kind){
      case ErrorKind.Value: {
        return '#Value';
      }
      case ErrorKind.DivideByZero: {
        return '#Div/0';
      }
      case ErrorKind.Name: {
        return '#Name';
      }
      case ErrorKind.NotImplemented: {
        return '#Implementation';
      }
      case ErrorKind.Parse: {
        return '#ParseError';
      }
      case ErrorKind.Custom: {
        return '#CustomError';
      }
    }
  }
}