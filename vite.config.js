import { defineConfig } from 'vite'
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PAGES_DIR = resolve(__dirname, 'src/pages')

const normalizeRoute = (route) => route.replace(/\\/g, '/')

const collectPageEntries = (baseDir, relative = '') => {
	const entries = {}
	const absoluteDir = resolve(baseDir, relative)
	for (const dirent of readdirSync(absoluteDir, { withFileTypes: true })) {
		if (dirent.isDirectory()) {
			const childRelative = normalizeRoute(`${relative}/${dirent.name}`)
			Object.assign(entries, collectPageEntries(baseDir, childRelative))
			continue
		}
		if (!dirent.name.endsWith('.html')) {
			continue
		}
		const relativePath = normalizeRoute(`${relative}/${dirent.name}`).replace(/^\//, '')
		entries[relativePath] = resolve(baseDir, relativePath)
	}
	return entries
}

const pageEntries = existsSync(PAGES_DIR) ? collectPageEntries(PAGES_DIR) : {}
const pageRoutes = Object.keys(pageEntries)

const pageEntryPlugin = () => ({
	name: 'page-entry-alias',
	configureServer(server) {
		server.middlewares.use((req, res, next) => {
			if (!req.url) {
				next()
				return
			}
			const [outputPath] = req.url.split('?')
			const normalizedPath = normalizeRoute(outputPath).replace(/^\//, '')
			if (pageEntries[normalizedPath]) {
				req.url = `/src/pages/${normalizedPath}`
			}
			next()
		})
	},
	closeBundle() {
		for (const route of pageRoutes) {
			const source = resolve(__dirname, 'dist/src/pages', route)
			const destination = resolve(__dirname, 'dist', route)
			if (!existsSync(source)) {
				continue
			}
			mkdirSync(dirname(destination), { recursive: true })
			copyFileSync(source, destination)
		}
	},
})

const rollupInput = {
	main: resolve(__dirname, 'index.html'),
	...pageRoutes.reduce((acc, route) => {
		acc[route] = pageEntries[route]
		return acc
	}, {}),
}

export default defineConfig({
	plugins: [pageEntryPlugin()],
	base: './',
	server: {
		open: false,
	},
	build: {
		outDir: 'dist',
		manifest: true,
		rollupOptions: {
			input: rollupInput,
		},
	},
})
