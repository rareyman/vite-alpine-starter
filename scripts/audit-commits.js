import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const require = createRequire(import.meta.url)
const configPath = path.resolve(__dirname, '../build-config.cjs')
const buildConfig = fs.existsSync(configPath) ? require(configPath) : { outDir: 'dist' }
const distDir = path.resolve(__dirname, '..', buildConfig.outDir || 'dist')

if (!fs.existsSync(distDir)) {
	fs.mkdirSync(distDir, { recursive: true })
}

const now = new Date()
const timestamp = now.toISOString().replace(/[:.]/g, '-')
const recentCommits = execSync('git log -n 10 --pretty=format:"%h  %cd  %s" --date=short', {
	encoding: 'utf8',
}).trim()

const content = `Commit Log
===========
Generated: ${now.toISOString()}

Recent commits (context)
========================
${recentCommits}
`

const filePath = path.join(distDir, `commit-log-${timestamp}.txt`)
fs.writeFileSync(filePath, content, 'utf8')
console.log(`Generated ${filePath}`)
