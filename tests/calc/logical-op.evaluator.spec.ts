import { CalcEngine } from "../../src/calc";

const calc = new CalcEngine();

describe("logical operators work correctly", () => {
  test("can eval correctly if both data type are boolean", () => {
    expect(calc.eval("true = true")).toBe(true);
    expect(calc.eval("false = false")).toBe(true);
    expect(calc.eval("true > false")).toBe(true);
    expect(calc.eval("true < false")).toBe(false);
  });

  test("can eval correctly if both data type are number", () => {
    expect(calc.eval("1 = 1")).toBe(true);
    expect(calc.eval("0 = 0")).toBe(true);
    expect(calc.eval("3 > 2.2")).toBe(true);
    expect(calc.eval("5 < 2")).toBe(false);
  });

  test("can eval correctly if both data type are strings", () => {
    expect(calc.eval('"1" = "1"')).toBe(true);
    expect(calc.eval('"abc" = "abc"')).toBe(true);
    expect(calc.eval('"d" > "c"')).toBe(true);
    expect(calc.eval('"b" < "a"')).toBe(false);
  });

  test("can eval correctly if one is number and other is bool", () => {
    expect(calc.eval('1 = true')).toBe(false);
    expect(calc.eval('0 = false')).toBe(false);
    expect(calc.eval('1 < true')).toBe(true);
    expect(calc.eval('1 < false')).toBe(true);
  });

  test("can eval correctly if one is string and other is bool", () => {
    expect(calc.eval('"a" = true')).toBe(false);
    expect(calc.eval('"0" = false')).toBe(false);
    expect(calc.eval('"abc" < true')).toBe(true);
    expect(calc.eval('"abc" < false')).toBe(true);
  });

  test("can eval correctly if one is string and other is number", () => {
    expect(calc.eval('"a" = 1')).toBe(false);
    expect(calc.eval('"0" = 0')).toBe(false);
    expect(calc.eval('"abc" < 99')).toBe(false);
    expect(calc.eval('"abc" > 99')).toBe(true);
  });

});
