# appwrite-canary-node

Appwrite Sites canary — Node pilot at [node.danielvm.net](https://node.danielvm.net).

## Setup

```bash
bash scripts/setup.sh
cp .env.example .env   # set VITE_APPWRITE_*
npm run dev
```

## Version

Root `VERSION` is written by `big-release`. UI uses `__APP_VERSION__`; `GET /health` reads `VERSION` at runtime.

## Releases

See [docs/RELEASE_SLICES.md](docs/RELEASE_SLICES.md).

Shell: [appwrite-canary-shell](https://github.com/danielvm-git/appwrite-canary-shell).