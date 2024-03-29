/* eslint-env node */
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  plugins: ["@typescript-eslint"],
  root: true,
  overrides: [
    {
      files: ["automation/**/*.ts"],
      parserOptions: {
        project: "./tsconfig.automation.json",
      },
    },
    {
      files: ["__tests/**/*.ts"],
      parserOptions: {
        project: "./tsconfig.tests.json",
      },
    },
  ],
};
