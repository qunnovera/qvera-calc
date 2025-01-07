import * as lx from "@sharadt/lexicons";

// matches multiple matches of given parser separated by another provided parser
export const ManySept = (parser: lx.IParser, septBy: lx.Parser, minCount: number = -1) => {
  return new lx.Parser((state) => {
    if (state.isError) {
      return state;
    }

    const results = [];
    let nextState = state;

    while (!nextState.isError) {
      nextState = parser.parse(nextState);
      if (!nextState.isError) {
        results.push(nextState.result);
        state = nextState;
      }

      nextState = septBy.parse(nextState);
    }

    if (results.length < minCount) {
      return lx.StateUtils.withError(state, `expected ${minCount} counts, but got ${results.length} counts`)
    }
    else {
      return lx.StateUtils.withResult(state, results);
    }
  });
}
