# Platform — DNS and Appwrite Sites

| Host | Type | Target |
|------|------|--------|
| sites.danielvm.net | A | 138.2.246.52 |
| node.danielvm.net | CNAME | `sites.danielvm.net` |
| python.danielvm.net | CNAME | `sites.danielvm.net` |
| php.danielvm.net | CNAME | `sites.danielvm.net` |
| go.danielvm.net | CNAME | `sites.danielvm.net` |

Cloudflare: **DNS only** (grey cloud). Custom site hostnames must **CNAME** to `sites.danielvm.net` so Appwrite proxy rules verify (A-only fails verification).

Appwrite instance `.env`:

- `_APP_DOMAIN_SITES=sites.danielvm.net`
- `_APP_DOMAIN_TARGET_CNAME=sites.danielvm.net`
- `_APP_DOMAIN_TARGET_A=138.2.246.52` (origin IP for validation)

Then `docker compose up -d --force-recreate appwrite appwrite-worker` on the host.

## GitHub repository secrets (appwrite-canary-node)

| Secret | Purpose |
|--------|---------|
| `APPWRITE_ENDPOINT` | `https://appwrite.danielvm.net/v1` |
| `APPWRITE_PROJECT_ID` | Scaffold / Canaries project id |
| `APPWRITE_API_KEY` | Deploy-capable API key |
| `APPWRITE_SITE_ID` | Site id for node.danielvm.net |

Repository variables (public, for Vite build): set `VITE_APPWRITE_ENDPOINT` and `VITE_APPWRITE_PROJECT_ID` in workflow `env` from secrets where appropriate.