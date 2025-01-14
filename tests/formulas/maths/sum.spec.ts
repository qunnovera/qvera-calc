import { CalcEngine } from "../../../src/calc";
import { CalcError, ErrorKind } from "../../../src/evaluator";

const calc = new CalcEngine();
calc.dataStore.setVariableValue("a", 5);
calc.dataStore.setVariableValue("b", 8);
calc.dataStore.setCellValueByName("a1", 3);
calc.dataStore.setCellValueByName("a2", 3);
calc.dataStore.setCellValueByName("a3", 3);
calc.dataStore.setCellValueByName("a4", 3);
calc.dataStore.setCellValueByName("a5", 3);

describe("Test Sum formula", () => {
  test("can evaluate simple int values", () => {
    const res = calc.eval("SUM(2, 3, 4)");
    expect(res).toBe(9);
  });

  test("can evaluate simple negative int values", () => {
    const res = calc.eval("SUM(2, 3,-10)");
    expect(res).toBe(-5);
  });

  test("can evaluate float values values", () => {
    const res = calc.eval("SUM(2.5, 3.5, 4.5)");
    expect(res).toBe(10.5);
  });

  test("can evaluate cell ref values", () => {
    const res = calc.eval("SUM(a1, a2, a3, 5)");
    expect(res).toBe(14);
  });

  test("can evaluate cell range values", () => {
    const res = calc.eval("SUM(a1:a3, a3:a5, 4)");
    expect(res).toBe(22);
  });

  test("no argument throws error", () => {
    const res = calc.eval("SUM()");
    expect(res instanceof CalcError).toBe(true);
  });

  test("string arguments throws error", () => {
    const res = calc.eval('SUM("test")');
    expect(res instanceof CalcError).toBe(true);
  });

  test("works correctly with boolean true value", () => {
    const res = calc.eval("SUM(3, true)");
    expect(res).toBe(4);
  });

  test("works correctly with boolean false value", () => {
    const res = calc.eval("SUM(3, false)");
    expect(res).toBe(3);
  });

  test("propogates error correctly", () => {
    const res = calc.eval("SUM(3, 2/0)");
    expect(res instanceof CalcError).toBe(true);
  });

});