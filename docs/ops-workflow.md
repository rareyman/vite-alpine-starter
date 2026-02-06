# Operations & Release Workflow

This project mirrors the mature Parcel setup but now runs on Vite. The new helpers keep the build outputs, metadata, and deployment hooks predictable, even when you deploy into a Bluehost subfolder.

## Release metadata

- `scripts/generate-version.js` writes `dist/version.txt` in whatever `build-config.cjs.outDir` you set and stamps it with the build time, local time, timezone, branch, and commit SHA. It is invoked automatically after each `npm run build` so every production artifact contains the same quick reference as `version.txt` in the Parcel project.
- `scripts/audit-commits.js` records the last ten commits in `dist/commit-log-<timestamp>.txt` (same `outDir`). This script runs as part of `npm run release` and keeps those logs out of Git while still giving you a timestamped snapshot of recent history.

## Mirror Parcel-style ops scripts

- `package.json` now has a `clean` script (uses `rimraf`) that removes `dist`, `dist-dev`, and the local `.vite` cache so you can start fresh like you did with `rimraf dist dist-dev` before. Run `npm run clean` before `npm run dev` if you want to purge past builds.
- `scripts/vite-runner.js` wraps every Vite command (`dev`, `build`, `preview`) through a single entrypoint that reads `build-config.cjs`. This lets you change the `publicUrl` for deployments to subfolders, keep a separate `dist-dev` folder for dev builds, and control dev/preview ports without editing `package.json` or `vite.config.js` directly.
- The runner also exports `PUBLIC_URL` (matching the configured base) so any HTML partials that expect `PUBLIC_URL` behave exactly like they did under Parcel.

## Build configuration

`build-config.cjs` defines the values that the runner and metadata scripts share:

```cjs
module.exports = {
  publicUrl: '/path/if-needed', // change when your host serves from a nested folder
  outDir: 'dist',
  devOutDir: 'dist-dev',
  devPort: 5173,
  previewPort: 4173,
}
```

Update `publicUrl` before deploying to a subfolder or CDN, and the runner plus the metadata scripts follow that same location so `version.txt`/`commit-log-*` stay next to the files you ship.

## Future README entry

When you transfer this doc into the README, highlight:

1. The `npm run release` flow (`build` → `generate-version` → `audit-commits`) and where the output lives.
2. How `build-config.cjs` controls the base URL and output directories, so Bluehost deployments can map `dist/` to a subfolder without renaming artifacts.
3. That the summary logs stay untracked but live in `dist`, allowing comparisons between builds without polluting Git.

Let me know when you want me to fold this write-up into the main README and polish it for contributors.