import * as lx from "@sharadt/lexicons";

// inner equation inside formula argument
export const strValue = new lx.Parser((state) => {
  if (state.isError) {
    return state;
  }

  if(state.index > state.inputString.length){
    return lx.StateUtils.withError(state, `Unexpected end of input`);
  }

  if(state.inputString[state.index] != '"'){
    return lx.StateUtils.withError(state, `Unexpected char at index ${state.index} expected: " but got ${state.inputString[state.index]}`);
  }

  let res = '';
  let i = state.index + 1;
  for (; i < state.inputString.length; i++) {
    const curChar = state.inputString[i],
      nextChar = state.inputString[i + 1];
    if(curChar == '"' && nextChar == '"'){
      res += '"';
      i++;
    }else if(curChar == '"') {
      break;
    }else {
      res += curChar;
    }
  }

  if(i >= state.inputString.length){
    return lx.StateUtils.withError(state, `Unexpected end of input`);
  }else {
    return lx.StateUtils.updateResult(state, res, state.index + res.length + 2);
  }

});