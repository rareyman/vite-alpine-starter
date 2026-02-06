import { defineConfig } from 'vite'

export default defineConfig({
	// Base public path when served in development or production.
	base: './',

	server: {
		// Open browser automatically on server start
		open: true,
	},

	build: {
		// Output directory for build (default is 'dist')
		outDir: 'dist',

		// Generate manifest.json (useful for backend integration if needed later)
		manifest: true,

		rollupOptions: {
			// Ensure all HTML entry points in the project are included
			input: ['./index.html', './src/pages/typography-testbed.html'],
		},
	},
})
