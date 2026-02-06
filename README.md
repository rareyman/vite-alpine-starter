# vite-alpine-starter

Vite + Alpine.js + Tailwind CSS starter tailored for TWv3 static microsites.

## Requirements & Environment
- Node.js v22.14.0 (fnm honors `.node-version`, so run `fnm use` before npm scripts).
- `npm install` to populate dependencies and `fnm install` when switching machines.

## Setup
```bash
npm install
fnm install
fnm use
```
Keeps your local shell on the Node version recorded in `.node-version` before you run the toolchain.

## Development flow
```bash
npm run dev
```
All Vite commands are routed through `scripts/vite-runner.js`, which respects `build-config.cjs` (`publicUrl`, output dirs, and dev/preview ports) so you can point the site at a Bluehost subfolder without changing Vite CLI args manually.

## Linting & Formatting
```bash
npm run check
npm run lint
npm run format
```
`npm run check` already runs `npm run lint` + `npm run format`. ESLint enables `eslint-plugin-html` so inline `<script type="module">` blocks in HTML files are linted, and Stylelint enforces the idiomatic CSS order plus the `stylelint-order` plugin rules.

## Release workflow
```bash
npm run clean
npm run release
```
`npm run release` runs the build runner, emits `dist/` (or whatever `build-config.cjs.outDir` specifies), writes `dist/version.txt`, and generates `dist/commit-log-<timestamp>.txt` with the last ten commits (stored with the build but not committed). This mirrors the Parcel release pipeline you used before.

## Deployment notes (Bluehost or similar)
1. Set `build-config.cjs.publicUrl` to the folder where the host serves the site (e.g., `/client-site/`).
2. Run `npm run release` so the built assets reference the correct base and the metadata files land beside them.
3. Upload everything inside the configured `dist/` directory to the remote web root (via FTP, SFTP, or Bluehost’s file manager). Overwrite the target folder with the local `dist` contents.
4. Leave `version.txt` and `commit-log-*` in place on the server for traceability; they are intentionally lightweight helpers to confirm the deployed Git identity.

## Build configuration
`build-config.cjs` centralizes the values used by the runner and metadata scripts:
```cjs
module.exports = {
  publicUrl: '/',       // change when the host serves from a subfolder
  outDir: 'dist',       // where production artifacts land
  devOutDir: 'dist-dev', // optional separate folder for dev output
  devPort: 5173,
  previewPort: 4173,
}
```
Any change to these values automatically flows through `scripts/vite-runner.js`, `scripts/generate-version.js`, and `scripts/audit-commits.js`.

## TWv3 philosophy reminders
- Favor semantic markup (proper headings, lists, sections) and readable copy.
- Lean on the custom spacing/margin scale in `tailwind.config.cjs` and resist adding conflicting CSS conventions.
- Keep interactive areas accessible with focus states, `aria` attributes, and logical tab order.
- Treat this starter as a microsite template: add only what you need, keep assets lean, and document new conventions back in the README.

## Additional documentation
See [docs/ops-workflow.md](docs/ops-workflow.md) for a walkthrough of the metadata scripts, the Vite runner, and how to fold that explanation into future README updates.

## Notes
- `dist/` is generated output; don’t check it into Git.
- Some configuration files stay `.cjs` because tools like ESLint and Stylelint expect CommonJS configs even though the project declares `"type": "module"`.
