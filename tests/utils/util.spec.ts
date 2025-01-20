import { indexToLetter, letterToIndex } from "../../src/utils/util";


describe("test letter to index", () => {
  test("test single char", () => {
    expect(letterToIndex("a")).toEqual(0);
    expect(letterToIndex("j")).toEqual(9);
    expect(letterToIndex("A")).toEqual(0);
    expect(letterToIndex("Y")).toEqual(24);
    expect(letterToIndex("h")).toEqual(7);
    expect(letterToIndex("z")).toEqual(25);
  });

  test("test multiple chars", () => {
    expect(letterToIndex("aa")).toEqual(26);
    expect(letterToIndex("bb")).toEqual(53);
    expect(letterToIndex("ccc")).toEqual(2108);
  });
});


describe("test index to letter", () => {
  test("test single char", () => {
    expect(indexToLetter(0)).toEqual("A");
    expect(indexToLetter(9)).toEqual("J");
    expect(indexToLetter(24)).toEqual("Y");
    expect(indexToLetter(7)).toEqual("H");
    expect(indexToLetter(25)).toEqual("Z");
  });

  test("test multiple chars", () => {
    expect(indexToLetter(26)).toEqual("AA");
    expect(indexToLetter(53)).toEqual("BB");
    expect(indexToLetter(2108)).toEqual("CCC");
  });
});

