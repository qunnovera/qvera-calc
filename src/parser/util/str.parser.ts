import * as lx from "@sharadt/lexicons";

// str utility parser
export const Str = (str: string) => {
  return new lx.Parser((state) => {
    const inp = state.inputString.slice(state.index);

    if (inp.length == 0) {
      return lx.StateUtils.withError(state, `Unexpected end of input`);
    }

    if (inp.startsWith(str)) {
      return lx.StateUtils.updateResult(state, str, state.index + str.length);
    } else {
      return lx.StateUtils.withError(state,
        `Parse Error: expected '${str}' but got ${inp.substring(0, str.length)} at index ${state.index}`
      );
    }
  });
};