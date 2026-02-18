import { describe, test, expect } from "bun:test";
import { SimpleDataStore } from "../../src/datastore/simple-data-store";

describe("SimpleDataStore", () => {

  // --- variable store ---

  describe("variable storage", () => {
    test("can set and get a variable", () => {
      const ds = new SimpleDataStore();
      ds.setVariableValue("x", 42);
      expect(ds.getVariableValue("x")).toBe(42);
    });

    test("returns undefined for unknown variable", () => {
      const ds = new SimpleDataStore();
      expect(ds.getVariableValue("missing")).toBeUndefined();
    });

    test("can overwrite a variable", () => {
      const ds = new SimpleDataStore();
      ds.setVariableValue("x", 1);
      ds.setVariableValue("x", 2);
      expect(ds.getVariableValue("x")).toBe(2);
    });

    test("supports different value types", () => {
      const ds = new SimpleDataStore();
      ds.setVariableValue("str", "hello");
      ds.setVariableValue("bool", true);
      ds.setVariableValue("num", 3.14);
      expect(ds.getVariableValue("str")).toBe("hello");
      expect(ds.getVariableValue("bool")).toBe(true);
      expect(ds.getVariableValue("num")).toBe(3.14);
    });
  });

  // --- scoped variables ---

  describe("scoped variable storage", () => {
    test("scoped variable is isolated from default scope", () => {
      const ds = new SimpleDataStore();
      ds.setVariableValue("x", 10);
      ds.setVariableValue("x", 20, "sheet2");
      expect(ds.getVariableValue("x")).toBe(10);
      expect(ds.getVariableValue("x", "sheet2")).toBe(20);
    });

    test("scoped get falls back to default scope", () => {
      const ds = new SimpleDataStore();
      ds.setVariableValue("x", 10);
      // scope "sheet2" has no "x", should fall back to default
      expect(ds.getVariableValue("x", "sheet2")).toBe(10);
    });

    test("different scopes are independent", () => {
      const ds = new SimpleDataStore();
      ds.setVariableValue("x", 1, "s1");
      ds.setVariableValue("x", 2, "s2");
      expect(ds.getVariableValue("x", "s1")).toBe(1);
      expect(ds.getVariableValue("x", "s2")).toBe(2);
    });
  });

  // --- cell storage by index ---

  describe("setCellValue / getComputedValue", () => {
    test("can set and get a cell by index", () => {
      const ds = new SimpleDataStore();
      ds.setCellValue(0, 0, 100);
      expect(ds.getComputedValue(0, 0)).toBe(100);
    });

    test("returns 0 for unset cells", () => {
      const ds = new SimpleDataStore();
      expect(ds.getComputedValue(5, 5)).toBe(0);
    });

    test("throws on negative row index", () => {
      const ds = new SimpleDataStore();
      expect(() => ds.setCellValue(-1, 0, 1)).toThrow("invalid cell index");
    });

    test("throws on negative column index", () => {
      const ds = new SimpleDataStore();
      expect(() => ds.setCellValue(0, -1, 1)).toThrow("invalid cell index");
    });

    test("can overwrite a cell value", () => {
      const ds = new SimpleDataStore();
      ds.setCellValue(0, 0, 1);
      ds.setCellValue(0, 0, 2);
      expect(ds.getComputedValue(0, 0)).toBe(2);
    });
  });

  // --- cell storage by name ---

  describe("setCellValueByName", () => {
    test("can set cell by name and read by index", () => {
      const ds = new SimpleDataStore();
      ds.setCellValueByName("B3", 99);
      // B3 => row 2, col 1
      expect(ds.getComputedValue(2, 1)).toBe(99);
    });

    test("throws on invalid cell name", () => {
      const ds = new SimpleDataStore();
      expect(() => ds.setCellValueByName("!!!", 1)).toThrow("invalid cell name");
    });
  });

  // --- scoped cell data ---

  describe("scoped cell storage", () => {
    test("scoped cells are isolated from default", () => {
      const ds = new SimpleDataStore();
      ds.setCellValue(0, 0, 10);
      ds.setCellValue(0, 0, 20, "sheet2");
      expect(ds.getComputedValue(0, 0)).toBe(10);
      expect(ds.getComputedValue(0, 0, "sheet2")).toBe(20);
    });

    test("returns 0 for unset scoped cells", () => {
      const ds = new SimpleDataStore();
      expect(ds.getComputedValue(0, 0, "nosheet")).toBe(0);
    });
  });

  // --- range retrieval ---

  describe("getRangeComputedValue", () => {
    test("returns correct 2D slice of data", () => {
      const ds = new SimpleDataStore();
      ds.setCellValue(0, 0, 1);
      ds.setCellValue(0, 1, 2);
      ds.setCellValue(1, 0, 3);
      ds.setCellValue(1, 1, 4);
      const range = ds.getRangeComputedValue(0, 0, 2, 2);
      expect(range).toEqual([[1, 2], [3, 4]]);
    });

    test("returns partial data for sparse grid", () => {
      const ds = new SimpleDataStore();
      ds.setCellValue(0, 0, 1);
      // row 1 has no data
      ds.setCellValue(2, 0, 5);
      const range = ds.getRangeComputedValue(0, 0, 3, 1);
      expect(range[0]).toEqual([1]);
      expect(range[2]).toEqual([5]);
    });

    test("returns empty array for unknown scope", () => {
      const ds = new SimpleDataStore();
      const range = ds.getRangeComputedValue(0, 0, 2, 2, "nope");
      expect(range).toEqual([]);
    });
  });

});
