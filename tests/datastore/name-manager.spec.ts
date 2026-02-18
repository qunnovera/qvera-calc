import { describe, test, expect } from "bun:test";
import { NameManager } from "../../src/datastore/name-manager";

describe("NameManager", () => {

  test("hasName returns false for unregistered name", () => {
    const nm = new NameManager();
    expect(nm.hasName("myName")).toBe(false);
  });

  test("hasName returns false with scope for unregistered name", () => {
    const nm = new NameManager();
    expect(nm.hasName("myName", "sheet1")).toBe(false);
  });

});
