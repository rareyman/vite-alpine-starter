import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const versionFile = resolve(__dirname, '..', '.node-version')

if (!existsSync(versionFile)) {
	console.warn('No .node-version file found; skipping node version guard.')
	process.exit(0)
}

const expectedVersion = readFileSync(versionFile, 'utf8').trim()
if (!expectedVersion) {
	console.warn('.node-version is empty; skipping node version guard.')
	process.exit(0)
}

const currentVersion = process.version
if (currentVersion !== expectedVersion) {
	console.error(
		`Node version mismatch: expected ${expectedVersion}, but current process is ${currentVersion}. Run fnm install && fnm use to align.`,
	)
	process.exit(1)
}

process.exit(0)
