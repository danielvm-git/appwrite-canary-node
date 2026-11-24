# CONVENTIONS — appwrite-canary-node

Version source of truth: repo root `VERSION` (big-release). UI reads `__APP_VERSION__` from Vite define. `/health` reads `VERSION` at runtime.

No version literals in source. No nested package.json version field (single root package.json only).

Conventional Commits. No Co-authored-by.

Appwrite secrets only in GitHub Actions secrets, never in git.