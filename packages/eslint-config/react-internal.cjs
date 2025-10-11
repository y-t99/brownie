const js = require("@eslint/js");
const eslintConfigPrettier = require("eslint-config-prettier");
const tseslint = require("typescript-eslint");
const pluginReactHooks = require("eslint-plugin-react-hooks");
const pluginReact = require("eslint-plugin-react");
const globals = require("globals");
const { config: baseConfig } = require("./base.cjs");

/**
 * A custom ESLint configuration for libraries that use React.
 *
 * @type {import("eslint").Linter.Config[]} */
const config = [
  ...baseConfig,
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  {
    plugins: {
      "react-hooks": pluginReactHooks,
    },
    settings: { react: { version: "detect" } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      // React scope no longer necessary with new JSX transform.
      "react/react-in-jsx-scope": "off",
    },
  },
];

module.exports = { config };
