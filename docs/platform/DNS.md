# Platform — DNS and Appwrite Sites

| Host | Type | Target |
|------|------|--------|
| node.danielvm.net | A | 138.2.246.52 |
| python.danielvm.net | A | 138.2.246.52 |
| php.danielvm.net | A | 138.2.246.52 |
| go.danielvm.net | A | 138.2.246.52 |

Cloudflare: DNS only (no proxy) if Let's Encrypt HTTP-01 on origin.

Appwrite instance `.env`: `_APP_DOMAIN_SITES` must include `sites.danielvm.net` when using custom site domains.

## GitHub repository secrets (appwrite-canary-node)

| Secret | Purpose |
|--------|---------|
| `APPWRITE_ENDPOINT` | `https://appwrite.danielvm.net/v1` |
| `APPWRITE_PROJECT_ID` | Scaffold / Canaries project id |
| `APPWRITE_API_KEY` | Deploy-capable API key |
| `APPWRITE_SITE_ID` | Site id for node.danielvm.net |

Repository variables (public, for Vite build): set `VITE_APPWRITE_ENDPOINT` and `VITE_APPWRITE_PROJECT_ID` in workflow `env` from secrets where appropriate.