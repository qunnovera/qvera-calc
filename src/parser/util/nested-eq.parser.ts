import * as lx from "@sharadt/lexicons";

// inner equation inside formula argument
export const nestedEq = new lx.Parser((state) => {
  if (state.isError) {
    return state;
  }

  let result = "";
  let i = state.index, openParanCount = 0;
  for (; i < state.inputString.length; i++) {
    if (openParanCount == 0 && (state.inputString[i] == ')' || state.inputString[i] == ',')) {
      break;
    }

    if (state.inputString[i] == '(') {
      openParanCount++;
    } else if (state.inputString[i] == ')') {
      openParanCount--;
    }

    result += state.inputString[i];
  }

  result = result.trim();

  if(!result && state.inputString[i] !== ',' && state.inputString[i-1] === '('){
    return lx.StateUtils.withError(state, 'Unexpected end of input');
  }

  return lx.StateUtils.updateResult(state, result, i);
});