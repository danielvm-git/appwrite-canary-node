#!/usr/bin/env bash
# Assert Todo TablesDB schema (tables + title fulltext index).
set -euo pipefail
WS="$(cd "$(dirname "$0")/../.." && pwd)"
# shellcheck disable=SC1090
source "$WS/.env.provision"
: "${APPWRITE_ENDPOINT:?}"
: "${APPWRITE_PROJECT_ID:?}"
: "${APPWRITE_API_KEY:?}"

api() {
  curl -skS -H "X-Appwrite-Project: $APPWRITE_PROJECT_ID" \
    -H "X-Appwrite-Key: $APPWRITE_API_KEY" \
    "$@"
}

for table in lists tasks; do
  api "$APPWRITE_ENDPOINT/tablesdb/todo/tables/$table" | grep -q '"$id"' || {
    echo "missing table $table" >&2
    exit 1
  }
done

idx="$(api "$APPWRITE_ENDPOINT/tablesdb/todo/tables/tasks/indexes/title_search")"
echo "$idx" | grep -q '"type":"fulltext"' || {
  echo "missing fulltext index title_search" >&2
  echo "$idx" >&2
  exit 1
}
status="$(echo "$idx" | python3 -c 'import json,sys; print(json.load(sys.stdin).get("status",""))')"
[[ "$status" == "available" ]] || echo "warn: index status=$status (may still be processing)"

echo "verify-todo-schema-live: OK"