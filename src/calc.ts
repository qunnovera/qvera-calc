import { IParserState } from "@sharadt/lexicons";
import { SimpleDataStore } from "./datastore/simple-data-store";
import { FormulaManager } from "./formula/formula";
import { ExpEvaluator, IEvalContext } from "./evaluator/evaluator";
import { CalcParser } from "./parser/calc";
import { CalcError, ErrorKind } from "./evaluator/calc-error";
import { IDataStore } from "./evaluator/data-store.interface";

// calculation engine
export class CalcEngine {

  dataStore: IDataStore = new SimpleDataStore();
  formulaManager = new FormulaManager();
  evaluator = new ExpEvaluator(this.formulaManager);
  parser = CalcParser.instance;

  constructor(){

  }

  // evaluate an equation string
  eval(eq: string, scope: string = '', r = 0, c = 0): any{
    const ctx: IEvalContext = {
      col: r,
      row: c,
      scope: scope,
      dataStore: this.dataStore,
      evaluator: this.evaluator
    };
    
    // store some data
    const parseState = this.parser.run(eq);
    if(parseState.isError){
      return new CalcError(ErrorKind.Parse);
    }

    return this.evaluator.evaluate(parseState.result, ctx);
  }

  // parse the given equaion string
  parse(eq: string): IParserState{
    return this.parser.run(eq);
  }

  

}