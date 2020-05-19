module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@typescript-eslint/recommended",
    "standard-with-typescript",
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    project: "./test/tsconfig.json"
  },
  rules: {
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-floating-promises": "warn",
    "@typescript-eslint/no-use-before-define": ["error", {
      "functions": false
    }],
    "@typescript-eslint/strict-boolean-expressions": "off"
  }
};
