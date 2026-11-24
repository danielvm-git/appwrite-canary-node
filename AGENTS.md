# AGENTS — appwrite-canary-node

| Action | Command |
|--------|---------|
| Setup | `bash scripts/setup.sh` |
| Preflight | `bash scripts/preflight.sh` |
| Dev | `npm run dev` |
| Build | `npm run build` |
| Start | `npm start` |

Shell sync: `bash ../appwrite-canary-shell/scripts/sync-shell.sh .`

## Observability

| What | Command |
|------|---------|
| Production health | `curl -s https://node.danielvm.net/health.json` |
| Smoke + schema | `bash scripts/observability-check.sh` |
| TablesDB isolation | `bash scripts/verify-todo-live.sh` |
| Data-layer unit tests | `npm run test:data` |
| Local HTTP logs (JSON) | `LOG_LEVEL=info npm start` (Pino + pino-http on each request) |
| Browser client logs | Safari Web Inspector → Console (lines prefixed `"service":"todo-client"`) |

Appwrite Console → project **Scaffold** → **Activity** shows Auth / TablesDB / Storage API calls (not the static site container).