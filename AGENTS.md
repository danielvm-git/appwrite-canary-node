# AGENTS — appwrite-canary-node

| Action | Command |
|--------|---------|
| Setup | `bash scripts/setup.sh` |
| Preflight | `bash scripts/preflight.sh` |
| Dev | `npm run dev` |
| Build | `npm run build` |
| Start | `npm start` |
| Deploy share function | `bash scripts/deploy-share-function.sh` (reads `../.env.provision`; site CI does not deploy it) |

Sharing runs in the Appwrite Function `share-task` (`functions/share-task`): browsers cannot look up users or grant `user:<id>` permissions, so the function does both with its dynamic server key.

Shell sync: `bash ../appwrite-canary-shell/scripts/sync-shell.sh .`

## Observability

| What | Command |
|------|---------|
| Production health | `curl -s https://node.danielvm.net/health.json` |
| Smoke + schema | `bash scripts/observability-check.sh` |
| TablesDB isolation + sharing | `bash scripts/verify-todo-live.sh` |
| Share function logs | Appwrite Console → Functions → **Share task** → Executions |
| Data-layer unit tests | `npm run test:data` |
| Local HTTP logs (JSON) | `LOG_LEVEL=info npm start` (Pino + pino-http on each request) |
| Browser client logs | Safari Web Inspector → Console (lines prefixed `"service":"todo-client"`) |

Appwrite Console → project **Scaffold** → **Activity** shows Auth / TablesDB / Storage API calls (not the static site container).