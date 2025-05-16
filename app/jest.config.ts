/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        babelConfig: false,
        tsconfig: "tsconfig.json",
      },
    ],
  },
  passWithNoTests: true,
  transformIgnorePatterns: [`/node_modules/*`],
  testRegex: "(/specs/.*.test.(tsx?)$|(\\.|/)(test|spec).tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  modulePathIgnorePatterns: ["dist/*"],
};
