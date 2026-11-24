#!/usr/bin/env bash
# Run on the Oracle host (ssh oracle) with appwrite-cli installed.
#
# 1) One-time login (stores session in ~/.appwrite):
#      appwrite login \
#        --email 'danielvm@gmail.com' \
#        --password 'YOUR_CONSOLE_PASSWORD' \
#        --endpoint 'https://appwrite.danielvm.net/v1' \
#        --self-signed true
#
# 2) Create a **standard** API key in Console → project Scaffold → API keys
#    scopes: sites.read, sites.write, rules.write (rules.read optional)
#
# 3) Run:
#      APPWRITE_API_KEY='standard_...' bash scripts/platform/oracle-appwrite-bootstrap.sh
#
# Requires APPWRITE_API_KEY in the environment. Uses appwrite-cli for site + proxy rule.
set -euo pipefail

ENDPOINT="${APPWRITE_ENDPOINT:-https://appwrite.danielvm.net/v1}"
PROJECT_ID="${APPWRITE_PROJECT_ID:-6b04b29a00127bf05784}"
DOMAIN="${CANARY_DOMAIN:-node.danielvm.net}"
SITE_NAME="${APPWRITE_SITE_NAME:-appwrite-canary-node}"

: "${APPWRITE_API_KEY:?set APPWRITE_API_KEY from Console}"

appwrite client \
  --endpoint "$ENDPOINT" \
  --project-id "$PROJECT_ID" \
  --key "$APPWRITE_API_KEY" \
  --self-signed true

if appwrite sites list 2>/dev/null | grep -q "$SITE_NAME"; then
  SITE_ID="$(appwrite sites list --json 2>/dev/null | python3 -c "
import json,sys
for s in json.load(sys.stdin).get('sites',[]):
    if s.get('name')==sys.argv[1]:
        print(s['\$id']); break
" "$SITE_NAME")"
else
  SITE_ID="$(appwrite sites create \
    --name "$SITE_NAME" \
    --framework vite \
    --adapter static \
    --install-command 'echo skip' \
    --build-command 'echo skip' \
    --output-directory ./ \
    --fallback-file index.html \
    --json | python3 -c 'import json,sys; print(json.load(sys.stdin)["$id"])')"
fi

echo "SITE_ID=$SITE_ID"

if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  REPO="danielvm-git/appwrite-canary-node"
  gh secret set APPWRITE_API_KEY -R "$REPO" -b "$APPWRITE_API_KEY"
  gh secret set APPWRITE_SITE_ID -R "$REPO" -b "$SITE_ID"
  gh secret set APPWRITE_ENDPOINT -R "$REPO" -b "$ENDPOINT"
  gh secret set APPWRITE_PROJECT_ID -R "$REPO" -b "$PROJECT_ID"
  echo "GitHub secrets updated via gh on this host."
else
  echo "Install gh auth on Oracle, or run from your Mac:"
  echo "  gh secret set APPWRITE_API_KEY -R danielvm-git/appwrite-canary-node -b '\$APPWRITE_API_KEY'"
  echo "  gh secret set APPWRITE_SITE_ID -R danielvm-git/appwrite-canary-node -b '$SITE_ID'"
fi