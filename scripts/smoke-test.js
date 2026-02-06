import { existsSync, readdirSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const configPath = resolve(__dirname, '../build-config.cjs')
const buildConfig = existsSync(configPath) ? require(configPath) : { outDir: 'dist' }
const distDir = resolve(__dirname, '..', buildConfig.outDir || 'dist')
const pagesDir = resolve(__dirname, '../src/pages')

const normalizeRoute = (route) => route.replace(/\\/g, '/')

const collectHtmlPages = (baseDir, relative = '') => {
	const absoluteDir = resolve(baseDir, relative)
	if (!existsSync(absoluteDir)) {
		return []
	}
	const entries = []
	for (const dirent of readdirSync(absoluteDir, { withFileTypes: true })) {
		if (dirent.isDirectory()) {
			const childRelative = normalizeRoute(`${relative}/${dirent.name}`)
			entries.push(...collectHtmlPages(baseDir, childRelative))
			continue
		}
		if (!dirent.name.endsWith('.html')) {
			continue
		}
		const relativePath = normalizeRoute(`${relative}/${dirent.name}`).replace(/^\//, '')
		entries.push(relativePath)
	}
	return entries
}

const expectedPages = ['index.html', ...collectHtmlPages(pagesDir)]

const runnerScript = resolve(__dirname, 'vite-runner.js')
const buildProcess = spawn(process.execPath, [runnerScript, 'build'], { stdio: 'inherit' })

buildProcess.on('error', (error) => {
	console.error('Smoke test build failed to start:', error.message)
	process.exit(1)
})

buildProcess.on('close', (code) => {
	if (code !== 0) {
		process.exit(code)
	}
	const missing = expectedPages.filter((page) => !existsSync(resolve(distDir, page)))
	if (missing.length) {
		console.error('Smoke test failed; expected built pages missing:', missing.join(', '))
		process.exit(1)
	}
	console.log('Smoke test passed; built pages are present.')
	process.exit(0)
})
