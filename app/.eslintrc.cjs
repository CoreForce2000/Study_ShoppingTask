module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
  },
  plugins: [
    "react",
    "@typescript-eslint",
    "unused-imports",
    "react-refresh",
    "prettier",
  ],

  rules: {
    "prettier/prettier": [
      "error",
      {
        printWidth: 80,
      },
    ],
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    indent: ["warn", "tab"],
    "linebreak-style": ["warn", "windows"],
    quotes: ["warn", "double"],
    semi: ["warn", "always"],
    "@typescript-eslint/no-unused-vars": "on",
    "unused-imports/no-unused-imports-ts": "on",
  },
};
