import { describe, test, expect } from "bun:test";
import { CalcEngine } from "../../src/calc";
import { AsyncResult } from "../../src/evaluator/async-result";
import { CalcError, ErrorKind } from "../../src/evaluator/calc-error";
import { IEvalContext } from "../../src/evaluator/evaluator";

const calc = new CalcEngine();
calc.dataStore.setVariableValue("a", 5);
calc.dataStore.setVariableValue("b", 8);
calc.dataStore.setCellValueByName("a1", 3);
calc.dataStore.setCellValueByName("a5", 7);

// register async formula
calc.formulaManager.registerFormula({
  name: "asynctest",
  minArgs: 1,
  maxArgs: 1,

  evaluate: (args: any[], ctx: IEvalContext) => {
    return new AsyncResult(
      "testing async",
      new Promise((resolve, reject) => {
        if(args[0] == 0){
          reject(0);
        }
        setTimeout(() => resolve(args[0]), 300);
      })
    )
  },
});

describe("Test async formulas functionality", () => {
  test("async formulas return correctly", async () => {
    const res = calc.eval("asynctest(5)");
    expect(res instanceof AsyncResult).toBe(true);
    expect(res.tempValue).toBe("testing async");
    const actualRes = await res.awaiter;
    expect(actualRes).toBe(5);
  });

  test("async formulas work correctly in equations", async () => {
    const res = calc.eval("10 + asynctest(5)");
    expect(res instanceof AsyncResult).toBe(true);
    expect(res.tempValue).toBe("testing async");
    const actualRes = await res.awaiter;
    expect(actualRes).toBe(15);
  });

  test("async formulas can be nested", async () => {
    const res = calc.eval("10 + sum(asynctest(5), asynctest(5))");
    expect(res instanceof AsyncResult).toBe(true);
    expect(res.tempValue).toBe("testing async");
    const actualRes = await res.awaiter;
    expect(actualRes).toBe(20);
  });

  test("failed async formulas return calcerror", async () => {
    const res = calc.eval("10 + asynctest(0)");
    expect(res instanceof AsyncResult).toBe(true);
    expect(res.tempValue).toBe("testing async");
    const actualRes = await res.awaiter;
    expect(actualRes instanceof CalcError).toBe(true);
    expect(actualRes.kind).toBe(ErrorKind.Custom);
  });
});