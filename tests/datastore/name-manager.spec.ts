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

  // Note: NameManager currently has no public method to add names,
  // so we can only test the empty-state behavior.
  // When a public register/add method is added, expand these tests.

});
