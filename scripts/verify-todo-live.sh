#!/usr/bin/env bash
# Live Todo slice: two users; user B cannot read user A's task row.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WS="$(cd "$ROOT/.." && pwd)"
PROVISION="$WS/.env.provision"
[[ -f "$PROVISION" ]] || {
  echo "missing $PROVISION" >&2
  exit 1
}
# shellcheck disable=SC1090
source "$PROVISION"
: "${APPWRITE_ENDPOINT:?}"
: "${APPWRITE_PROJECT_ID:?}"
: "${APPWRITE_API_KEY:?}"

rand="$(openssl rand -hex 4)"
U1="todo-a-${rand}@example.com"
U2="todo-b-${rand}@example.com"
PW="TodoVerify9x${rand}"

curl_json() {
  local method="$1"
  local url="$2"
  shift 2
  curl -skS -X "$method" \
    -H "X-Appwrite-Project: $APPWRITE_PROJECT_ID" \
    -H "Content-Type: application/json" \
    "$url" "$@"
}

curl_key() {
  local method="$1"
  local url="$2"
  shift 2
  curl -skS -X "$method" \
    -H "X-Appwrite-Project: $APPWRITE_PROJECT_ID" \
    -H "X-Appwrite-Key: $APPWRITE_API_KEY" \
    -H "Content-Type: application/json" \
    "$url" "$@"
}

curl_session() {
  local method="$1"
  local url="$2"
  local session="$3"
  shift 3
  curl -skS -X "$method" \
    -H "X-Appwrite-Project: $APPWRITE_PROJECT_ID" \
    -H "X-Appwrite-Session: $session" \
    -H "Content-Type: application/json" \
    "$url" "$@"
}

echo "== users =="
UID_A="todoA${rand}"
UID_B="todoB${rand}"
curl_key POST "$APPWRITE_ENDPOINT/users" \
  -d "{\"userId\":\"$UID_A\",\"email\":\"$U1\",\"password\":\"$PW\",\"name\":\"A\"}" >/dev/null
curl_key POST "$APPWRITE_ENDPOINT/users" \
  -d "{\"userId\":\"$UID_B\",\"email\":\"$U2\",\"password\":\"$PW\",\"name\":\"B\"}" >/dev/null

sid_for() {
  curl_json POST "$APPWRITE_ENDPOINT/account/sessions/email" \
    -d "{\"email\":\"$1\",\"password\":\"$PW\"}" \
    | python3 -c 'import json,sys; print(json.load(sys.stdin)["$id"])'
}

S1="$(sid_for "$U1")"
S2="$(sid_for "$U2")"
UID1="$UID_A"

echo "== create task row as user A =="
ROW_JSON="$(curl_session POST "$APPWRITE_ENDPOINT/tablesdb/todo/tables/tasks/rows" "$S1" \
  -d "{\"rowId\":\"task${rand}\",\"data\":{\"title\":\"secret-${rand}\",\"userId\":\"$UID1\",\"status\":\"open\"}}")"
ROW_ID="$(echo "$ROW_JSON" | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get("$id",""))')"
[[ -n "$ROW_ID" ]] || {
  echo "row create failed: $ROW_JSON" >&2
  exit 1
}
echo "row=$ROW_ID"

echo "== user B read must fail =="
code="$(curl_session GET "$APPWRITE_ENDPOINT/tablesdb/todo/tables/tasks/rows/$ROW_ID" "$S2" \
  -o /tmp/todo-verify-body.json -w '%{http_code}')"
if [[ "$code" == "200" ]]; then
  echo "FAIL: cross-user read allowed" >&2
  cat /tmp/todo-verify-body.json >&2
  exit 1
fi
echo "blocked HTTP $code"
echo "verify-todo-live: OK"