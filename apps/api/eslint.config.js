const { config } = require("@brownie/eslint-config/base");

/** @type {import("eslint").Linter.Config[]} */
module.exports = [
  ...config,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  },
];
