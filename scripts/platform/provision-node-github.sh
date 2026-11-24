#!/usr/bin/env bash
# Provision Appwrite Site + GitHub Actions secrets/variables for node pilot.
# Requires: gh auth, APPWRITE_API_KEY with sites.* and rules.* scopes.
set -euo pipefail

REPO="danielvm-git/appwrite-canary-node"
ENDPOINT="${APPWRITE_ENDPOINT:-https://appwrite.danielvm.net/v1}"
PROJECT_ID="${APPWRITE_PROJECT_ID:-6b04b29a00127bf05784}"
SITE_NAME="${APPWRITE_SITE_NAME:-appwrite-canary-node}"
DOMAIN="${CANARY_DOMAIN:-node.danielvm.net}"

if [ -z "${APPWRITE_API_KEY:-}" ]; then
  echo "Set APPWRITE_API_KEY (Console → Scaffold → API keys → scopes: sites.read, sites.write, rules.write)" >&2
  exit 1
fi

auth=(-H "X-Appwrite-Project: ${PROJECT_ID}" -H "X-Appwrite-Key: ${APPWRITE_API_KEY}" -H "Content-Type: application/json")

SITE_JSON="$(
  curl -skS "${ENDPOINT%/}/sites" "${auth[@]}" \
    -d "{\"siteId\":\"unique()\",\"name\":\"${SITE_NAME}\",\"framework\":\"vite\",\"adapter\":\"static\",\"buildRuntime\":\"node-22\",\"installCommand\":\"echo skip\",\"buildCommand\":\"echo skip\",\"outputDirectory\":\"./\",\"fallbackFile\":\"index.html\",\"enabled\":true,\"logging\":true}"
)"

SITE_ID="$(python3 -c 'import json,sys; b=json.load(sys.stdin); print(b.get("$id") or "")' <<<"$SITE_JSON")"
if [ -z "$SITE_ID" ]; then
  echo "create site failed: $SITE_JSON" >&2
  exit 1
fi
echo "site=$SITE_ID"

RULE_JSON="$(
  curl -skS "${ENDPOINT%/}/proxy/rules/site" "${auth[@]}" \
    -d "{\"domain\":\"${DOMAIN}\",\"siteId\":\"${SITE_ID}\"}"
)"
echo "proxy rule: $(python3 -c 'import json,sys; print(json.load(sys.stdin).get("$id",""))' <<<"$RULE_JSON")"

gh variable set VITE_APPWRITE_ENDPOINT -R "$REPO" -b "$ENDPOINT"
gh variable set VITE_APPWRITE_PROJECT_ID -R "$REPO" -b "$PROJECT_ID"
gh secret set APPWRITE_ENDPOINT -R "$REPO" -b "$ENDPOINT"
gh secret set APPWRITE_PROJECT_ID -R "$REPO" -b "$PROJECT_ID"
gh secret set APPWRITE_API_KEY -R "$REPO" -b "$APPWRITE_API_KEY"
gh secret set APPWRITE_SITE_ID -R "$REPO" -b "$SITE_ID"

echo "GitHub secrets/variables updated for $REPO"