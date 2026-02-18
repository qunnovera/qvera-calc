import { describe, test, expect } from "bun:test";
import { CellRef } from "../../src/parser/cell-range";


describe("test cell ref creation using fromCellName method", () => {
  test("test simple relative ref", () => {
    const cref = CellRef.fromCellName("a1");

    expect(cref.name).toBe("A1");
    expect(cref.rowRelative).toBe(true);
    expect(cref.colRelative).toBe(true);
    expect(cref.row).toBe(0);
    expect(cref.column).toBe(0);
  });

  test("test simple relative ref2", () => {
    const cref = CellRef.fromCellName("b9");

    expect(cref.name).toBe("B9");
    expect(cref.rowRelative).toBe(true);
    expect(cref.colRelative).toBe(true);
    expect(cref.row).toBe(8);
    expect(cref.column).toBe(1);
  });

  test("test simple absolute ref", () => {
    const cref = CellRef.fromCellName("$A$1");

    expect(cref.name).toBe("$A$1");
    expect(cref.rowRelative).toBe(false);
    expect(cref.colRelative).toBe(false);
    expect(cref.row).toBe(0);
    expect(cref.column).toBe(0);
  });

  test("test absolute ref row", () => {
    const cref = CellRef.fromCellName("A$1");

    expect(cref.name).toBe("A$1");
    expect(cref.rowRelative).toBe(false);
    expect(cref.colRelative).toBe(true);
    expect(cref.row).toBe(0);
    expect(cref.column).toBe(0);
  });

});