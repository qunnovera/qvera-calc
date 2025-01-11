import { CalcEngine } from "../../src/calc";
import {CalcParser} from "../../src/parser/calc";

const calc = new CalcEngine();
calc.dataStore.setVariableValue("a", 5);
calc.dataStore.setVariableValue("b", 8);
calc.dataStore.setCellValueByName("a1", 3);
calc.dataStore.setCellValueByName("a5", 7);

describe("Test calc engine", () => {
  test("can evaluate simple equations correctly", () => {
    const res = calc.eval("2 + 3 * 5")
    expect(res).toBe(17);
  });

  test("can evaluate parenthesis correctly", () => {
    const res = calc.eval("(2 + 3) * 5");
    expect(res).toBe(25);
  });

  test("can evaluate variables correctly", () => {
    const res = calc.eval("a + 9");
    expect(res).toBe(14);
  });

  test("can evaluate cell ref correctly", () => {
    const res = calc.eval("a * -a5");
    expect(res).toBe(-35);
  });

  test("can evaluate formulas correctly", () => {
    const res = calc.eval("a + SUM(a, b, a1, a5)");
    expect(res).toBe(28);
  });

});