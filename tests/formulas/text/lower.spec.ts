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

describe("Test lower formula", () => {
  test("can work with int values", () => {
    const res = calc.eval("LOWER(2)");
    expect(res).toBe("2");
  });

  test("can work with negative int values", () => {
    const res = calc.eval("LOWER(-3)");
    expect(res).toBe("-3");
  });

  test("can work with float values", () => {
    const res = calc.eval("LOWER(2.5)");
    expect(res).toBe("2.5");
  });

  test("can evaluate cell ref values", () => {
    const res = calc.eval("LOWER(a1)");
    expect(res).toBe("3");
  });

  test("can evaluate cell range values", () => {
    const res = calc.eval("LOWER(a1:a3)");
    expect(isArray(res)).toBe(true);
    res.forEach(
      row => row.forEach(
        value => expect(value).toBe("3")
      ));
  });

  test("no argument throws error", () => {
    const res = calc.eval("LOWER()");
    expect(res instanceof CalcError).toBe(true);
  });

  test("multiple arguments throws error", () => {
    const res = calc.eval("LOWER(1, 2)");
    expect(res instanceof CalcError).toBe(true);
  });

  test("can work with string arguments", () => {
    const res = calc.eval('LOWER("tESt")');
    expect(res).toBe("test");
  });

  test("works correctly with boolean true value", () => {
    const res = calc.eval("LOWER(True)");
    expect(res).toBe("true");
  });

  test("works correctly with boolean false value", () => {
    const res = calc.eval("LOWER(false)");
    expect(res).toBe("false");
  });

  test("propogates error correctly", () => {
    const res = calc.eval("LOWER(2/0)");
    expect(res instanceof CalcError).toBe(true);
  });

});