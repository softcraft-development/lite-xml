/* eslint-disable no-console */
import * as esbuild from "esbuild"
import { writeFileSync } from "fs"
import { join } from "path"
import { sync } from "rimraf"

const base = {
  bundle: true,
  entryPoints: ["./src/**/*.ts"],
  // minify: true,
  platform: "node",
  sourcemap: true,
  target: "node14",
}

console.info("Cleaning dist directory")
sync("./dist")

const builds = [
  { ...base, format: "cjs", outdir: "./dist/cjs", type: "commonjs" },
  { ...base, format: "esm", outdir: "./dist/esm", type: "module" },
].map(async (config) => {
  const { type, ...esbuildConfig } = config
  console.info(`${config.format}: Building `)
  await esbuild.build(esbuildConfig)
  if (type) {
    console.info(`${config.format}: Writing package.json`)
    writeFileSync(
      join(config.outdir, "package.json"),
      JSON.stringify({ type }, null, 2),
    )
  }
  console.info(`${config.format}: Finished`)
})

await Promise.all(builds)
console.info("Build Complete")
