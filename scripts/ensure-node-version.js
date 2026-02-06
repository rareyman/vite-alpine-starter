import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const versionFile = resolve(__dirname, '..', '.node-version')

const warnAndExit = (message, code = 0) => {
	console[code === 0 ? 'warn' : 'error'](message)
	process.exit(code)
}

const readExpectedVersion = () => {
	if (!existsSync(versionFile)) {
		warnAndExit('No .node-version file found; skipping node version guard.')
	}
	const value = readFileSync(versionFile, 'utf8').trim()
	if (!value) {
		warnAndExit('.node-version is empty; skipping node version guard.')
	}
	return value
}

const ensureNodeVersion = () => {
	const expectedVersion = readExpectedVersion()
	const currentVersion = process.version
	if (currentVersion !== expectedVersion) {
		warnAndExit(
			`Node version mismatch: expected ${expectedVersion}, but current process is ${currentVersion}. Run fnm install && fnm use to align.`,
			1,
		)
	}
	process.exit(0)
}

ensureNodeVersion()
