import { describe, test, expect } from "bun:test";
import { CalcEngine } from "../../src/calc";
import { CalcError, ErrorKind } from "../../src/evaluator/calc-error";
import { SimpleDataStore } from "../../src/datastore/simple-data-store";
import { TokenKind } from "../../src/parser/parse-result";

describe("CalcEngine", () => {

  // --- parse() method ---

  describe("parse()", () => {
    test("returns parser state with result for valid equation", () => {
      const calc = new CalcEngine();
      const state = calc.parse("2 + 3");
      expect(state.isError).toBe(false);
      expect(state.result).toBeDefined();
      expect(state.result.kind).toBe(TokenKind.Operator);
      expect(state.result.value).toBe("+");
    });

    test("returns parser state with error for invalid equation", () => {
      const calc = new CalcEngine();
      const state = calc.parse("+ * /");
      expect(state.isError).toBe(true);
    });

    test("returns parser state for single value", () => {
      const calc = new CalcEngine();
      const state = calc.parse("42");
      expect(state.isError).toBe(false);
      expect(state.result.kind).toBe(TokenKind.Integer);
      expect(state.result.value).toBe(42);
    });

    test("returns parser state for formula", () => {
      const calc = new CalcEngine();
      const state = calc.parse("SUM(1, 2)");
      expect(state.isError).toBe(false);
      expect(state.result.kind).toBe(TokenKind.Formula);
    });

    test("returns parser state for float", () => {
      const calc = new CalcEngine();
      const state = calc.parse("3.14");
      expect(state.isError).toBe(false);
      expect(state.result.kind).toBe(TokenKind.Float);
      expect(state.result.value).toBe(3.14);
    });

    test("returns parser state for string literal", () => {
      const calc = new CalcEngine();
      const state = calc.parse('"hello"');
      expect(state.isError).toBe(false);
      expect(state.result.kind).toBe(TokenKind.String);
      expect(state.result.value).toBe("hello");
    });

    test("returns parser state for cell ref", () => {
      const calc = new CalcEngine();
      const state = calc.parse("A1");
      expect(state.isError).toBe(false);
      expect(state.result.kind).toBe(TokenKind.CellRef);
    });

    test("returns parser state for cell range", () => {
      const calc = new CalcEngine();
      const state = calc.parse("A1:B3");
      expect(state.isError).toBe(false);
      expect(state.result.kind).toBe(TokenKind.CellRange);
    });
  });

  // --- scoped evaluation ---

  describe("scoped evaluation", () => {
    test("eval uses default scope when no scope provided", () => {
      const calc = new CalcEngine();
      const ds = calc.dataStore as SimpleDataStore;
      ds.setCellValue(0, 0, 10);
      expect(calc.eval("A1")).toBe(10);
    });

    test("eval reads scoped data when scope provided", () => {
      const calc = new CalcEngine();
      const ds = calc.dataStore as SimpleDataStore;
      ds.setCellValue(0, 0, 10);
      ds.setCellValue(0, 0, 99, "sheet2");
      expect(calc.eval("A1")).toBe(10);
      expect(calc.eval("A1", "sheet2")).toBe(99);
    });

    test("eval with scoped variables", () => {
      const calc = new CalcEngine();
      const ds = calc.dataStore as SimpleDataStore;
      ds.setVariableValue("x", 100);
      ds.setVariableValue("x", 200, "sheet2");
      expect(calc.eval("x")).toBe(100);
      expect(calc.eval("x", "sheet2")).toBe(200);
    });

    test("scoped eval falls back to default for variables", () => {
      const calc = new CalcEngine();
      const ds = calc.dataStore as SimpleDataStore;
      ds.setVariableValue("x", 100);
      // "sheet3" has no "x", should fallback to default
      expect(calc.eval("x", "sheet3")).toBe(100);
    });

    test("scoped eval with formulas using cell refs", () => {
      const calc = new CalcEngine();
      const ds = calc.dataStore as SimpleDataStore;
      ds.setCellValue(0, 0, 5, "s1");
      ds.setCellValue(1, 0, 10, "s1");
      expect(calc.eval("SUM(A1, A2)", "s1")).toBe(15);
    });
  });

  // --- integration: custom formula via CalcEngine ---

  describe("custom formula registration via CalcEngine", () => {
    test("can register and evaluate a custom formula", () => {
      const calc = new CalcEngine();
      calc.formulaManager.registerFormula({
        name: "TRIPLE",
        minArgs: 1,
        maxArgs: 1,
        evaluate: (args) => args[0] * 3,
      });
      expect(calc.eval("TRIPLE(4)")).toBe(12);
    });

    test("custom formula works in compound expressions", () => {
      const calc = new CalcEngine();
      calc.formulaManager.registerFormula({
        name: "DOUBLE",
        minArgs: 1,
        maxArgs: 1,
        evaluate: (args) => args[0] * 2,
      });
      expect(calc.eval("DOUBLE(5) + 3")).toBe(13);
    });
  });

});
