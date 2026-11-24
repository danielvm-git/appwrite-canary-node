#!/usr/bin/env bash
# Idempotent: create the share-task function (if missing) and deploy functions/share-task.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WS="$(cd "$ROOT/.." && pwd)"
if [[ -z "${APPWRITE_API_KEY:-}" && -f "$WS/.env.provision" ]]; then
  # shellcheck disable=SC1091
  source "$WS/.env.provision"
fi
: "${APPWRITE_ENDPOINT:?}"
: "${APPWRITE_PROJECT_ID:?}"
: "${APPWRITE_API_KEY:?}"

FUNCTION_ID="share-task"
SRC="$ROOT/functions/share-task"
auth=(-H "X-Appwrite-Project: $APPWRITE_PROJECT_ID" -H "X-Appwrite-Key: $APPWRITE_API_KEY")
json() { python3 -c "import json,sys; print(json.load(sys.stdin).get('$1',''))"; }

config='{
  "name":"Share task","runtime":"node-22","execute":["users"],
  "entrypoint":"src/main.js","commands":"npm install --omit=dev",
  "scopes":["users.read","rows.read","rows.write"],"timeout":15,"logging":true
}'

existing="$(curl -skS "${auth[@]}" "$APPWRITE_ENDPOINT/functions/$FUNCTION_ID")"
if [[ "$(json '$id' <<<"$existing")" == "$FUNCTION_ID" ]]; then
  echo "function exists — updating config"
  curl -skS -X PUT "${auth[@]}" -H "Content-Type: application/json" \
    "$APPWRITE_ENDPOINT/functions/$FUNCTION_ID" -d "$config" | head -c 200
else
  echo "creating function"
  body="$(python3 -c "import json,sys; d=json.loads(sys.argv[1]); d['functionId']='$FUNCTION_ID'; print(json.dumps(d))" "$config")"
  curl -skS -X POST "${auth[@]}" -H "Content-Type: application/json" \
    "$APPWRITE_ENDPOINT/functions" -d "$body" | head -c 200
fi
echo

ARCHIVE="$(mktemp -t share-task.XXXXXX.tar.gz)"
trap 'rm -f "$ARCHIVE"' EXIT
tar -czf "$ARCHIVE" -C "$SRC" --exclude node_modules --exclude '*.test.js' .

deploy="$(curl -skS -X POST "${auth[@]}" "$APPWRITE_ENDPOINT/functions/$FUNCTION_ID/deployments" \
  -F "activate=true" -F "entrypoint=src/main.js" -F "commands=npm install --omit=dev" \
  -F "code=@$ARCHIVE;type=application/gzip;filename=code.tar.gz")"
DEPLOY_ID="$(json '$id' <<<"$deploy")"
[[ -n "$DEPLOY_ID" ]] || { echo "deployment failed: $deploy" >&2; exit 1; }
echo "deployment=$DEPLOY_ID"

for _ in $(seq 1 60); do
  status="$(curl -skS "${auth[@]}" "$APPWRITE_ENDPOINT/functions/$FUNCTION_ID/deployments/$DEPLOY_ID" | json status)"
  case "$status" in
    ready) echo "deploy-share-function: OK"; exit 0 ;;
    failed) echo "build failed" >&2
      curl -skS "${auth[@]}" "$APPWRITE_ENDPOINT/functions/$FUNCTION_ID/deployments/$DEPLOY_ID" | json buildLogs >&2
      exit 1 ;;
  esac
  sleep 5
done
echo "timeout waiting for $DEPLOY_ID" >&2
exit 1
