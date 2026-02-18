import { describe, test, expect } from "bun:test";
import { CellRange, CellRef } from "../../src/parser/cell-range";

describe("CellRange", () => {

  describe("constructor defaults", () => {
    test("single cell range when r2/c2 omitted", () => {
      const rng = new CellRange(2, 3);
      expect(rng.row).toBe(2);
      expect(rng.col).toBe(3);
      expect(rng.row2).toBe(2);
      expect(rng.col2).toBe(3);
    });

    test("explicit r2/c2", () => {
      const rng = new CellRange(0, 0, 5, 5);
      expect(rng.row).toBe(0);
      expect(rng.col).toBe(0);
      expect(rng.row2).toBe(5);
      expect(rng.col2).toBe(5);
    });
  });

  describe("computed properties", () => {
    test("rowCount and columnCount for normal range", () => {
      const rng = new CellRange(0, 0, 3, 2);
      expect(rng.rowCount).toBe(4);
      expect(rng.columnCount).toBe(3);
    });

    test("rowCount and columnCount for single cell", () => {
      const rng = new CellRange(5, 5);
      expect(rng.rowCount).toBe(1);
      expect(rng.columnCount).toBe(1);
    });

    test("rowCount and columnCount when reversed", () => {
      // r2 < r, c2 < c  — should still report absolute size
      const rng = new CellRange(5, 5, 2, 2);
      expect(rng.rowCount).toBe(4);
      expect(rng.columnCount).toBe(4);
    });

    test("rowCount returns -1 when a row is negative", () => {
      const rng = new CellRange(-1, 0, 3, 2);
      expect(rng.rowCount).toBe(-1);
    });

    test("columnCount returns -1 when a col is negative", () => {
      const rng = new CellRange(0, -1, 3, 2);
      expect(rng.columnCount).toBe(-1);
    });

    test("topRow and bottomRow", () => {
      const rng = new CellRange(5, 0, 2, 0);
      expect(rng.topRow).toBe(2);
      expect(rng.bottomRow).toBe(5);
    });

    test("leftCol and rightCol", () => {
      const rng = new CellRange(0, 5, 0, 2);
      expect(rng.leftCol).toBe(2);
      expect(rng.rightCol).toBe(5);
    });
  });

  describe("isValid", () => {
    test("valid when all coords are positive", () => {
      const rng = new CellRange(0, 0, 5, 5);
      expect(rng.isValid).toBe(true);
    });

    test("valid when all coords are negative (unbounded)", () => {
      const rng = new CellRange(-1, -1, -1, -1);
      expect(rng.isValid).toBe(true);
    });

    test("invalid when only one row is negative", () => {
      const rng = new CellRange(-1, 0, 5, 5);
      expect(rng.isValid).toBe(false);
    });

    test("invalid when only one col is negative", () => {
      const rng = new CellRange(0, -1, 5, 5);
      expect(rng.isValid).toBe(false);
    });
  });

  describe("contains", () => {
    test("cell inside range returns true", () => {
      const rng = new CellRange(0, 0, 5, 5);
      expect(rng.contains(3, 3)).toBe(true);
    });

    test("cell at top-left corner returns true", () => {
      const rng = new CellRange(1, 1, 5, 5);
      expect(rng.contains(1, 1)).toBe(true);
    });

    test("cell at bottom-right corner returns true", () => {
      const rng = new CellRange(1, 1, 5, 5);
      expect(rng.contains(5, 5)).toBe(true);
    });

    test("cell outside range returns false", () => {
      const rng = new CellRange(1, 1, 5, 5);
      expect(rng.contains(0, 0)).toBe(false);
      expect(rng.contains(6, 6)).toBe(false);
      expect(rng.contains(3, 6)).toBe(false);
    });

    test("works with reversed coords", () => {
      const rng = new CellRange(5, 5, 1, 1);
      expect(rng.contains(3, 3)).toBe(true);
      expect(rng.contains(0, 0)).toBe(false);
    });
  });

  describe("containsRef", () => {
    test("returns true for ref inside range", () => {
      const rng = new CellRange(0, 0, 5, 5);
      const ref = new CellRef(3, 3);
      expect(rng.containsRef(ref)).toBe(true);
    });

    test("returns false for ref outside range", () => {
      const rng = new CellRange(0, 0, 5, 5);
      const ref = new CellRef(6, 6);
      expect(rng.containsRef(ref)).toBe(false);
    });
  });

  describe("fromCellRef", () => {
    test("creates range from two cell refs", () => {
      const ref1 = CellRef.fromCellName("A1");
      const ref2 = CellRef.fromCellName("C3");
      const rng = CellRange.fromCellRef(ref1, ref2);
      expect(rng.row).toBe(0);
      expect(rng.col).toBe(0);
      expect(rng.row2).toBe(2);
      expect(rng.col2).toBe(2);
      expect(rng.rowCount).toBe(3);
      expect(rng.columnCount).toBe(3);
    });

    test("handles reversed refs correctly", () => {
      const ref1 = CellRef.fromCellName("C3");
      const ref2 = CellRef.fromCellName("A1");
      const rng = CellRange.fromCellRef(ref1, ref2);
      expect(rng.topRow).toBe(0);
      expect(rng.leftCol).toBe(0);
      expect(rng.bottomRow).toBe(2);
      expect(rng.rightCol).toBe(2);
    });
  });

});
