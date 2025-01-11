import {CalcParser} from "../../src/parser/calc";
import { TokenKind } from "../../src/parser/parse-result";


describe("Test calc parser", () => {
  test("can parse simple equations correctly", () => {
    const res = CalcParser.instance.run("a + 3 * 5");
    expect(res.isError).toBe(false);
    expect(res.result.kind).toBe(TokenKind.Operator);
    expect(res.result.value).toBe('+');
    expect(res.result.childs.length).toBe(2);
    expect(res.result.childs[0].kind).toBe(TokenKind.VarName);
    expect(res.result.childs[0].value).toBe('a');
    expect(res.result.childs[1].kind).toBe(TokenKind.Operator);
    expect(res.result.childs[1].value).toBe('*');
    expect(res.result.childs[1].childs.length).toBe(2);
    expect(res.result.childs[1].childs[0].kind).toBe(TokenKind.Integer);
    expect(res.result.childs[1].childs[0].value).toBe(3);
    expect(res.result.childs[1].childs[1].kind).toBe(TokenKind.Integer);
    expect(res.result.childs[1].childs[1].value).toBe(5);
  });

  test("fails at invalid equations gracefully", () => {
    let res = CalcParser.instance.run("a + * * * *3 * 5");
    expect(res.isError).toBe(true);
    res = CalcParser.instance.run("3a");
    expect(res.isError).toBe(true);
  });

  test("can use parenthesis to increase operator priority correctly", () => {
    const res = CalcParser.instance.run("(a + 3) * 5");
    expect(res.isError).toBe(false);
    expect(res.result.kind).toBe(TokenKind.Operator);
    expect(res.result.value).toBe('*');
    expect(res.result.childs.length).toBe(2);
    expect(res.result.childs[0].kind).toBe(TokenKind.Operator);
    expect(res.result.childs[0].value).toBe('+');
    expect(res.result.childs[0].childs.length).toBe(2);
    expect(res.result.childs[0].childs[0].kind).toBe(TokenKind.VarName);
    expect(res.result.childs[0].childs[0].value).toBe('a');
    expect(res.result.childs[0].childs[1].kind).toBe(TokenKind.Integer);
    expect(res.result.childs[0].childs[1].value).toBe(3);
    expect(res.result.childs[1].kind).toBe(TokenKind.Integer);
    expect(res.result.childs[1].value).toBe(5);
  });

  test("can parse uniary operators correctly", () => {
    const res = CalcParser.instance.run("5 + -2");
    expect(res.isError).toBe(false);
    expect(res.result.kind).toBe(TokenKind.Operator);
    expect(res.result.value).toBe('+');
    expect(res.result.childs.length).toBe(2);
    expect(res.result.childs[1].kind).toBe(TokenKind.UniaryOperator);
    expect(res.result.childs[1].value).toBe('-');
  });

  test("can parse formulas correctly", () => {
    const res = CalcParser.instance.run("5 + sum(2, 4+5)");
    expect(res.isError).toBe(false);
    expect(res.result.kind).toBe(TokenKind.Operator);
    expect(res.result.value).toBe('+');
    expect(res.result.childs.length).toBe(2);
    expect(res.result.childs[1].kind).toBe(TokenKind.Formula);
    expect(res.result.childs[1].value).toBe('sum');
    expect(res.result.childs[1].childs.length).toBe(2);
    expect(res.result.childs[1].childs[0].value).toBe(2);
    expect(res.result.childs[1].childs[1].value).toBe('+');
  });

  test("can parse nested formulas correctly", () => {
    const res = CalcParser.instance.run("5 + sum(2, 4+5, abs(-3))");
    expect(res.isError).toBe(false);
    expect(res.result.kind).toBe(TokenKind.Operator);
    expect(res.result.value).toBe('+');
    expect(res.result.childs.length).toBe(2);
    expect(res.result.childs[1].kind).toBe(TokenKind.Formula);
    expect(res.result.childs[1].value).toBe('sum');
    expect(res.result.childs[1].childs.length).toBe(3);
    expect(res.result.childs[1].childs[2].kind).toBe(TokenKind.Formula);
    expect(res.result.childs[1].childs[2].value).toBe('abs');
    expect(res.result.childs[1].childs[2].childs.length).toBe(1);
    expect(res.result.childs[1].childs[2].childs[0].kind).toBe(TokenKind.UniaryOperator);
    expect(res.result.childs[1].childs[2].childs[0].value).toBe('-');
  });

  test("can parse boolean values", () => {
    let res = CalcParser.instance.run("true");
    expect(res.isError).toBe(false);
    expect(res.result.kind).toBe(TokenKind.Boolean);
    expect(res.result.value).toBe(true);

    res = CalcParser.instance.run("True");
    expect(res.isError).toBe(false);
    expect(res.result.kind).toBe(TokenKind.Boolean);
    expect(res.result.value).toBe(true);

    res = CalcParser.instance.run("false");
    expect(res.isError).toBe(false);
    expect(res.result.kind).toBe(TokenKind.Boolean);
    expect(res.result.value).toBe(false);

    res = CalcParser.instance.run("False");
    expect(res.isError).toBe(false);
    expect(res.result.kind).toBe(TokenKind.Boolean);
    expect(res.result.value).toBe(false);
  });


});
