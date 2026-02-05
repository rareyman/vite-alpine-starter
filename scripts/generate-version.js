import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

// Setup paths for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

try {
	// 1. Get Git Info
	const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
	const shortHash = execSync('git rev-parse --short HEAD').toString().trim()
	const fullHash = execSync('git rev-parse HEAD').toString().trim()

	// Get last 5 commits (hash, date, author, message)
	// Using simple format to avoid breaking on quotes
	const recentCommits = execSync(
		'git log -5 --pretty=format:"%h  %ad  %an: %s" --date=short',
	).toString()

	// 2. Prepare Content
	const now = new Date()
	const buildTimeUTC = now.toISOString()

	// Attempt local time; might default to UTC on some build servers without TZ data
	const buildTimeLocal = now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })

	const content = `Build Stamp
===========
Built (UTC):     ${buildTimeUTC}
Built (Local):   ${buildTimeLocal}
Local TZ:        America/Los_Angeles

Source Identity
===============
Branch:          ${branch}
Commit (short):  ${shortHash}
Commit (full):   ${fullHash}

Recent commits (context)
========================
${recentCommits}

----------------------------------------
Notes
=====
This file is meant for quick local-vs-remote confirmation.
If Branch + Commit match, you're looking at the same source state.
`

	// 3. Write to dist/version.txt
	// The dist folder is one level up from scripts/, so '../dist'
	const distDir = path.resolve(__dirname, '../dist')

	// Ensure dist exists (it should, after vite build)
	if (!fs.existsSync(distDir)) {
		fs.mkdirSync(distDir, { recursive: true })
	}

	fs.writeFileSync(path.join(distDir, 'version.txt'), content)
	console.log('✅ version.txt generated in dist/')
} catch (error) {
	console.error('⚠️  Failed to generate version.txt:', error.message)
}
