module.exports = {
  extends: [
    "plugin:@stylistic/recommended-extends",
    "plugin:import/recommended",
  ],
  ignorePatterns: [
    "dist",
    "node_modules",
  ],
  parser: "@typescript-eslint/parser",
  plugins: [
    "@stylistic",
  ],
  root: true,
  rules: {
    "@stylistic/max-len": ["warn", { code: 120 }],
    "@stylistic/no-multiple-empty-lines": ["error", { max: 1 }],
    "@stylistic/quote-props": ["error", "as-needed"],
    "@stylistic/quotes": ["error", "double"],
    "func-names": ["error", "always"],
    "func-style": ["error", "declaration", { allowArrowFunctions: true }],
    "no-console": "warn",
    "sort-keys": ["error", "asc", { caseSensitive: true, natural: false }],
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        moduleDirectory: ["node_modules", "src/"],
      },
    },
  },
}
