/* eslint-disable no-console */
import { exec } from "child_process"
import * as esbuild from "esbuild"
import { writeFileSync } from "fs"
import { join } from "path"
import { sync } from "rimraf"

const base = {
  bundle: true,
  entryPoints: ["./src/**/*.ts"],
  minify: true,
  sourcemap: true,
}

console.info("Cleaning dist directory")
sync("./dist")

const builds = [
  { ...base, outdir: "./dist/browser", platform: "browser" },
  { ...base, outdir: "./dist/cjs", platform: "node", type: "commonjs" },
  { ...base, outdir: "./dist/esm", platform: "neutral", type: "module" },
].map(async (config) => {
  const descriptor = `${config.target || config.platform || config.format}`
  const { type, ...esbuildConfig } = config
  console.info(`${descriptor}: Building `)
  await esbuild.build(esbuildConfig)

  console.info(`${descriptor}: Generating TypeScript declarations`)
  await new Promise((resolve) => {
    exec(`pnpm exec tsc -p tsconfig.${descriptor}.json`, (error, stdout, stderr) => {
      if (error) {
        console.error(`${descriptor}: ${error.message}`)
        return
      }
      if (stderr) {
        console.error(`${descriptor}: ${stderr}`)
        return
      }
      if (stdout) {
        console.info(`${descriptor}: ${stdout}`)
      }
      console.info(`${descriptor}: Finished TypeScript declarations`)
      resolve()
    })
  })

  if (type) {
    console.info(`${descriptor}: Writing package.json`)
    writeFileSync(
      join(config.outdir, "package.json"),
      JSON.stringify({ type }, null, 2),
    )
  }
  console.info(`${descriptor}: Finished Build`)
})

await Promise.all(builds)
console.info("Build Complete")
