import { describe, test, expect } from "bun:test";
import { FormulaManager } from "../../src/formula/formula-manager";
import { IEvalContext } from "../../src/evaluator/evaluator";

describe("FormulaManager", () => {

  describe("built-in formulas", () => {
    test("has SUM registered on construction", () => {
      const fm = new FormulaManager();
      expect(fm.hasFormula("sum")).toBe(true);
      expect(fm.hasFormula("SUM")).toBe(true);
    });

    test("has AVERAGE registered on construction", () => {
      const fm = new FormulaManager();
      expect(fm.hasFormula("average")).toBe(true);
    });

    test("has UPPER and LOWER registered on construction", () => {
      const fm = new FormulaManager();
      expect(fm.hasFormula("upper")).toBe(true);
      expect(fm.hasFormula("lower")).toBe(true);
    });
  });

  describe("hasFormula", () => {
    test("returns false for unregistered formula", () => {
      const fm = new FormulaManager();
      expect(fm.hasFormula("nonexistent")).toBe(false);
    });

    test("is case-insensitive", () => {
      const fm = new FormulaManager();
      expect(fm.hasFormula("Sum")).toBe(true);
      expect(fm.hasFormula("sUm")).toBe(true);
      expect(fm.hasFormula("SUM")).toBe(true);
    });
  });

  describe("getFormula", () => {
    test("returns formula object with correct defaults", () => {
      const fm = new FormulaManager();
      const sum = fm.getFormula("sum");
      expect(sum).toBeDefined();
      expect(sum.name).toBe("sum");
      expect(sum.minArgs).toBe(1);
      expect(typeof sum.evaluate).toBe("function");
    });

    test("returns undefined for unregistered formula", () => {
      const fm = new FormulaManager();
      expect(fm.getFormula("nonexistent")).toBeUndefined();
    });

    test("is case-insensitive", () => {
      const fm = new FormulaManager();
      const f1 = fm.getFormula("SUM");
      const f2 = fm.getFormula("sum");
      expect(f1).toBe(f2);
    });
  });

  describe("registerFormula", () => {
    test("can register a custom formula", () => {
      const fm = new FormulaManager();
      const result = fm.registerFormula({
        name: "DOUBLE",
        evaluate: (args: any[]) => args[0] * 2,
      });
      expect(result).toBe(true);
      expect(fm.hasFormula("double")).toBe(true);
    });

    test("returns false when registering duplicate without override", () => {
      const fm = new FormulaManager();
      fm.registerFormula({
        name: "myfn",
        evaluate: () => 1,
      });
      const result = fm.registerFormula({
        name: "myfn",
        evaluate: () => 2,
      });
      expect(result).toBe(false);
      // original should still be there
      expect(fm.getFormula("myfn").evaluate([], {} as IEvalContext)).toBe(1);
    });

    test("can override existing formula when flag is true", () => {
      const fm = new FormulaManager();
      fm.registerFormula({
        name: "myfn",
        evaluate: () => 1,
      });
      const result = fm.registerFormula(
        { name: "myfn", evaluate: () => 2 },
        true
      );
      expect(result).toBe(true);
      expect(fm.getFormula("myfn").evaluate([], {} as IEvalContext)).toBe(2);
    });

    test("cannot override built-in formula without flag", () => {
      const fm = new FormulaManager();
      const result = fm.registerFormula({
        name: "SUM",
        evaluate: () => 999,
      });
      expect(result).toBe(false);
    });

    test("can override built-in formula with flag", () => {
      const fm = new FormulaManager();
      const result = fm.registerFormula(
        { name: "SUM", evaluate: () => 999 },
        true
      );
      expect(result).toBe(true);
      expect(fm.getFormula("sum").evaluate([], {} as IEvalContext)).toBe(999);
    });

    test("applies correct defaults for optional fields", () => {
      const fm = new FormulaManager();
      fm.registerFormula({
        name: "minimal",
        evaluate: () => 0,
      });
      const f = fm.getFormula("minimal");
      expect(f.minArgs).toBe(0);
      expect(f.maxArgs).toBe(Infinity);
      expect(f.acceptsError).toBe(false);
      expect(f.acceptsRef).toBe(false);
    });

    test("respects explicitly set optional fields", () => {
      const fm = new FormulaManager();
      fm.registerFormula({
        name: "custom",
        minArgs: 2,
        maxArgs: 5,
        acceptsError: true,
        acceptsRef: true,
        evaluate: () => 0,
      });
      const f = fm.getFormula("custom");
      expect(f.minArgs).toBe(2);
      expect(f.maxArgs).toBe(5);
      expect(f.acceptsError).toBe(true);
      expect(f.acceptsRef).toBe(true);
    });
  });

});
