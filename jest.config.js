/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  roots: ['./tests'],
  transform: {
    "^.+.tsx?$": ["ts-jest",{ tsconfig: "tsconfig.test.json" }],
  },
};