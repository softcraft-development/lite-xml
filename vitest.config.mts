import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        "esbuild.mjs",
        ".eslintrc.cjs",
      ],
      provider: "v8",
    },
  },
})
