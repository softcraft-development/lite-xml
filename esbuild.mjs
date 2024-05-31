import * as esbuild from "esbuild"

esbuild.build({
  bundle: true,
  entryPoints: ["./src/**/*.ts"],
  format: "esm",
  minify: true,
  outdir: "./dist",
  platform: "node",
  sourcemap: true,
  target: "node14",
}).catch(() => process.exit(1))
