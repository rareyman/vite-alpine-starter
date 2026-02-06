# vite-alpine-starter

Vite + Alpine.js + Tailwind CSS starter for simple static/brochure sites.

## Requirements
- Node.js (any modern LTS should work)

## Install
```bash
npm install
```

## Dev
Start the Vite dev server:

```bash
npm run dev
```

## Check (lint + format)
Run the full toolchain:

```bash
npm run check
```

Individual commands:
```bash
npm run lint:js
npm run lint:css
npm run format
```

## Build
Create a production build:

```bash
npm run build
```

This runs `vite build` and then generates `dist/version.txt`. [vite](https://vite.dev/guide/cli)

## Preview (production build)
Serve the `dist/` build locally:

```bash
npm run preview
```

Vite’s `preview` is for local verification of the production build and is not meant to be used as a production server. [vite](https://vite.dev/guide/cli)

## version.txt
After `npm run build`, a `version.txt` file is generated at:

- `dist/version.txt`

It contains build timestamp + git identity info to confirm what source state produced a deployed build.

## Notes
- `dist/` is build output and should not be committed.
- Some config files use `.cjs` because this repo uses `"type": "module"` and those tools expect CommonJS config files.

