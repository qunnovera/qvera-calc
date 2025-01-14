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

describe("Test avg formula", () => {
  test("can evaluate simple int values", () => {
    const res = calc.eval("AVERAGE(2, 3)");
    expect(res).toBe(2.5);
  });

  test("can evaluate simple negative int values", () => {
    const res = calc.eval("AVERAGE(2, -3)");
    expect(res).toBe(-0.5);
  });

  test("can evaluate float values values", () => {
    const res = calc.eval("AVERAGE(2.5, 3.5, 4.5)");
    expect(res).toBe(3.5);
  });

  test("can evaluate cell ref values", () => {
    const res = calc.eval("AVERAGE(a1, a2, a3, 5)");
    expect(res).toBe(3.5);
  });

  test("can evaluate cell range values", () => {
    const res = calc.eval("AVERAGE(a1:a3, a3:a5, 4)");
    expect(res).toBe(22/7);
  });

  test("no argument throws error", () => {
    const res = calc.eval("AVERAGE()");
    expect(res instanceof CalcError).toBe(true);
  });

  test("string arguments throws error", () => {
    const res = calc.eval('AVERAGE("test")');
    expect(res instanceof CalcError).toBe(true);
  });

  test("works correctly with boolean true value", () => {
    const res = calc.eval("AVERAGE(3, true)");
    expect(res).toBe(2);
  });

  test("works correctly with boolean false value", () => {
    const res = calc.eval("AVERAGE(3, false)");
    expect(res).toBe(1.5);
  });

  test("propogates error correctly", () => {
    const res = calc.eval("AVERAGE(3, 2/0)");
    expect(res instanceof CalcError).toBe(true);
  });

});