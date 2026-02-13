# GitHub CLI + SSH Setup

This repo is now published at https://github.com/rareyman/vite-alpine-starter. Keep this doc as the single source of truth for how to prepare any machine that clones or copies the starter.

## 1. Confirm which SSH key you want to use

1. List keys: `ls ~/.ssh`. Look for `id_ed25519`, `id_ed25519_{context}`, or another descriptive pair.
2. Print the public key you intend to use: `cat ~/.ssh/id_ed25519_<suffix>.pub`.
3. On GitHub go to **Settings > SSH and GPG keys** and make sure that exact key (matching the comment or fingerprint) is listed. If you prefer CLI: `gh ssh-key list`.

## 2. Load the key in your agent

```bash
ssh-add ~/.ssh/id_ed25519_<suffix>
ssh -T git@github.com    # should say “Hi <username>! You've successfully authenticated”
```

If the welcome message succeeds, you now have a machine-bound key ready to use.

## 3. Tell GitHub CLI to use SSH

```bash
gh auth login
```

- Answer `GitHub.com` → `SSH` → point to the same `.pub` file you confirmed earlier.
- When asked how to authenticate, choose **“Login with a web browser”** (or paste a PAT if you must stay terminal-only).
- Accept the token in the browser or paste it, then confirm `gh` shows your GitHub username.

## 4. Create or connect a repo (first time only)

Run this from the starter root:

```bash
gh repo create vite-alpine-starter --public --source=. --remote=origin --push
```

It will:
- create the GitHub repo
- add `git@github.com:rareyman/vite-alpine-starter.git` as `origin`
- push your current `main`
- set `main` to track `origin/main`

## 5. Repeat for future machines/projects

1. Clone the starter and repeat steps 1–3 to ensure the machine has a valid key and `gh` auth.
2. When starting a new project, either fork/clone this repo into a new repo or copy files, then run `gh repo create` with the new name.
3. Tag releases with `git tag -a vX.Y.Z` when publishing the starter to keep a clean history.

## 6. Bonus reminders

- Keep `main` pristine: only commit shared scripts/config/docs.
- Use `npm run check` (which runs lint + format) before pushing tags or releases.
- Protect `main` on GitHub: require review, require status checks, and prevent force pushes.

That’s it—this list keeps your setup repeatable without guesswork.