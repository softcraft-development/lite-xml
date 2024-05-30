import * as esbuild from "esbuild"

esbuild.build({
  bundle: true,
  entryPoints: ["./src/**/*.ts"],
  minify: true,
  outdir: "./dist",
  platform: "node",
  sourcemap: true,
}).catch(() => process.exit(1))
