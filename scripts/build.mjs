import { build } from 'esbuild'
import { mkdir, rm, writeFile } from 'node:fs/promises'

const packageId = '@liguojiang/dsh-plugin-desktop-pet'
const external = [
  'react',
  'react/jsx-runtime',
  '@deepseek-ai/dsh-client-runtime',
  '@deepseek-ai/dsh-client-runtime/client',
  '@deepseek-ai/dsh-client-ui-layout/client',
  '@deepseek-ai/dsh-client-ui-settings/client',
  '@deepseek-ai/dsh-client-ui-slots',
]

await rm('lib', { recursive: true, force: true })
await mkdir('lib', { recursive: true })

await build({
  entryPoints: ['src/index.ts'],
  outfile: 'lib/index.js',
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node20',
  sourcemap: false,
})

const client = await build({
  entryPoints: ['src/client/index.tsx'],
  bundle: true,
  write: false,
  platform: 'browser',
  format: 'cjs',
  target: ['es2022'],
  jsx: 'automatic',
  external,
  sourcemap: false,
})
const [javascript] = client.outputFiles
if (!javascript || client.outputFiles.length !== 1) {
  throw new Error(`expected one client JavaScript output, got ${client.outputFiles.length}`)
}

const wrapped = `window.__ModuleLoader__.load({\n  id: ${JSON.stringify(packageId)},\n  factory: (require) => {\n    var module = { exports: {} };\n    var exports = module.exports;\n${javascript.text}\n    return module.exports;\n  }\n});\n`
await writeFile('lib/client.js', wrapped)
