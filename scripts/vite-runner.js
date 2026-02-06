import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const require = createRequire(import.meta.url)
const configPath = path.resolve(__dirname, '../build-config.cjs')

const defaultConfig = {
	publicUrl: '/',
	outDir: 'dist',
	devOutDir: 'dist-dev',
	devPort: 5173,
	previewPort: 4173,
	devHost: '127.0.0.1',
}

let buildConfig = defaultConfig
if (fs.existsSync(configPath)) {
	const customConfig = require(configPath)
	buildConfig = { ...defaultConfig, ...customConfig }
}

const mode = process.argv[2]
const extraArgs = process.argv.slice(3)

if (!mode || !['dev', 'build', 'preview'].includes(mode)) {
	console.error('Usage: node scripts/vite-runner.js <dev|build|preview> [args]')
	process.exit(1)
}

const baseUrl = buildConfig.publicUrl ?? '/'
const viteBin = path.resolve(
	__dirname,
	'../node_modules/.bin',
	process.platform === 'win32' ? 'vite.cmd' : 'vite',
)

let viteArgs = []
if (mode === 'dev') {
	viteArgs = [
		'dev',
		'--host',
		buildConfig.devHost ?? '127.0.0.1',
		'--port',
		String(buildConfig.devPort),
		'--base',
		baseUrl,
	]
} else if (mode === 'build') {
	viteArgs = ['build', '--outDir', buildConfig.outDir, '--base', baseUrl]
} else if (mode === 'preview') {
	viteArgs = [
		'preview',
		'--port',
		String(buildConfig.previewPort),
		'--strictPort',
		'true',
		'--host',
		buildConfig.devHost ?? '127.0.0.1',
		'--outDir',
		buildConfig.outDir,
		'--base',
		baseUrl,
	]
}

const runner = spawn(viteBin, [...viteArgs, ...extraArgs], {
	stdio: 'inherit',
	env: {
		...process.env,
		PUBLIC_URL: baseUrl,
	},
})

runner.on('close', (code) => {
	process.exit(code)
})

runner.on('error', (error) => {
	console.error(error)
	process.exit(1)
})
