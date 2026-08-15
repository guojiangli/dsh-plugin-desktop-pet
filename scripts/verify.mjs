import { readFile } from 'node:fs/promises'

const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
const patch = await readFile(new URL('../cordis.patch.yml', import.meta.url), 'utf8')
const client = await readFile(new URL('../lib/client.js', import.meta.url), 'utf8')

const packageName = '@liguojiang/dsh-plugin-desktop-pet'
const failures = []
if (pkg.name !== packageName) failures.push('unexpected npm package name')
if (pkg.dsh?.bundle?.patch !== './cordis.patch.yml') failures.push('missing dsh bundle patch declaration')
if (pkg.dsh?.client?.platform !== 'web') failures.push('missing web client declaration')
if (!patch.includes(`name: '${packageName}'`)) failures.push('bundle patch does not mount the scoped package')
for (const marker of [packageName, 'shell.overlay', 'settings.plugins.tab', 'projectionValues', 'localStorage', 'type: "file"']) {
  if (!client.includes(marker)) failures.push(`client bundle is missing ${marker}`)
}
if (failures.length > 0) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else {
  console.log('desktop-pet package contract verified')
}
