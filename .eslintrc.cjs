module.exports = {
  extends: [
    "plugin:@stylistic/recommended-extends",
  ],
  ignorePatterns: [
    "dist",
    "node_modules",
  ],
  parser: "@typescript-eslint/parser",
  plugins: [
    "@stylistic",
    "@typescript-eslint",
  ],
  root: true,
  rules: {
    "@stylistic/max-len": ["warn", { code: 120 }],
    "@stylistic/no-multiple-empty-lines": ["error", { max: 1 }],
    "@stylistic/quote-props": ["error", "as-needed"],
    "@stylistic/quotes": ["error", "double"],
    "@typescript-eslint/consistent-type-assertions": ["error", { assertionStyle: "never" }],
    "@typescript-eslint/no-explicit-any": "error",
    "func-names": ["error", "always"],
    "func-style": ["error", "declaration", { allowArrowFunctions: true }],
    "no-console": "warn",
    "sort-keys": ["error", "asc", { caseSensitive: true, natural: false }],
  },
}
