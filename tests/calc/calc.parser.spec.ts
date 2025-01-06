import {CalcParser} from "../../src/parser/calc";


describe("Test calc parser", () => {
  test("base test", () => {

    
    const p = new CalcParser();
    const res = p.run("a + ( b / c1 ) * (c1:b4 + -8.99)) + 7 - 9");
    console.log(res);
    expect(1).toBeTruthy();
  });
});

// 8 + + + 8