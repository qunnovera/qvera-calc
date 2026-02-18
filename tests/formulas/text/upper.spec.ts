import { describe, test, expect } from "bun:test";
import { CalcEngine } from "../../../src/calc";
import { CalcError } from "../../../src/evaluator/calc-error";
import { isArray } from "../../../src/utils/data-type.util";
import { SimpleDataStore } from "../../../src/datastore/simple-data-store";

const calc = new CalcEngine();
const dataStore = calc.dataStore as SimpleDataStore;
dataStore.setVariableValue("a", 5);
dataStore.setVariableValue("b", 8);
dataStore.setCellValueByName("a1", 3);
dataStore.setCellValueByName("a2", 3);
dataStore.setCellValueByName("a3", 3);
dataStore.setCellValueByName("a4", 3);
dataStore.setCellValueByName("a5", 3);

describe("Test upper formula", () => {
  test("can work with int values", () => {
    const res = calc.eval("UPPER(2)");
    expect(res).toBe("2");
  });

  test("can work with negative int values", () => {
    const res = calc.eval("UPPER(-3)");
    expect(res).toBe("-3");
  });

  test("can work with float values", () => {
    const res = calc.eval("UPPER(2.5)");
    expect(res).toBe("2.5");
  });

  test("can evaluate cell ref values", () => {
    const res = calc.eval("UPPER(a1)");
    expect(res).toBe("3");
  });

  test("can evaluate cell range values", () => {
    const res = calc.eval("UPPER(a1:a3)");
    expect(isArray(res)).toBe(true);
    res.forEach(
      row => row.forEach(
        value => expect(value).toBe("3")
      ));
  });

  test("no argument throws error", () => {
    const res = calc.eval("UPPER()");
    expect(res instanceof CalcError).toBe(true);
  });

  test("multiple arguments throws error", () => {
    const res = calc.eval("UPPER(1, 2)");
    expect(res instanceof CalcError).toBe(true);
  });

  test("can work with string arguments", () => {
    const res = calc.eval('UPPER("tESt")');
    expect(res).toBe("TEST");
  });

  test("works correctly with boolean true value", () => {
    const res = calc.eval("UPPER(True)");
    expect(res).toBe("TRUE");
  });

  test("works correctly with boolean false value", () => {
    const res = calc.eval("UPPER(false)");
    expect(res).toBe("FALSE");
  });

  test("propogates error correctly", () => {
    const res = calc.eval("UPPER(2/0)");
    expect(res instanceof CalcError).toBe(true);
  });

});