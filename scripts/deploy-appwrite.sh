#!/usr/bin/env bash
# story: e01s05
set -euo pipefail

: "${APPWRITE_ENDPOINT:?}"
: "${APPWRITE_PROJECT_ID:?}"
: "${APPWRITE_API_KEY:?}"
: "${APPWRITE_SITE_ID:?}"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIST="${ROOT}/dist"

if [ ! -d "$DIST" ]; then
  echo "dist/ missing — run npm run build first" >&2
  exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "curl required" >&2
  exit 1
fi

ARCHIVE="$(mktemp -t canary-deploy.XXXXXX.tar.gz)"
trap 'rm -f "$ARCHIVE"' EXIT

tar -czf "$ARCHIVE" -C "$DIST" .

auth_headers=(
  -H "X-Appwrite-Project: ${APPWRITE_PROJECT_ID}"
  -H "X-Appwrite-Key: ${APPWRITE_API_KEY}"
)

DEPLOY_JSON="$(
  curl -skS -X POST "${APPWRITE_ENDPOINT%/}/sites/${APPWRITE_SITE_ID}/deployments" \
    "${auth_headers[@]}" \
    -F "entrypoint=" \
    -F "activate=true" \
    -F "code=@${ARCHIVE};type=application/gzip;filename=code.tar.gz"
)"

DEPLOY_ID="$(python3 -c 'import json,sys; print(json.load(sys.stdin).get("$id",""))' <<<"$DEPLOY_JSON")"
if [ -z "$DEPLOY_ID" ]; then
  echo "create deployment failed: $DEPLOY_JSON" >&2
  exit 1
fi

echo "deployment=$DEPLOY_ID waiting for ready"

for attempt in $(seq 1 60); do
  STATUS_JSON="$(
    curl -skS "${APPWRITE_ENDPOINT%/}/sites/${APPWRITE_SITE_ID}/deployments/${DEPLOY_ID}" \
      "${auth_headers[@]}"
  )"
  STATUS="$(python3 -c 'import json,sys; print(json.load(sys.stdin).get("status",""))' <<<"$STATUS_JSON")"
  if [ "$STATUS" = "ready" ]; then
    echo "deployment ready"
    exit 0
  fi
  if [ "$STATUS" = "failed" ]; then
    echo "deployment failed: $STATUS_JSON" >&2
    exit 1
  fi
  sleep 5
done

echo "timeout waiting for deployment $DEPLOY_ID" >&2
exit 1