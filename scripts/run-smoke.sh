#!/usr/bin/env bash
set -euo pipefail
FILE="${SMOKE_CHECKS_FILE:-smoke-checks.yaml}"
BASE="${DEPLOY_URL:-}"
if [[ -z "$BASE" ]]; then
  BASE=$(rg '^base_url:' "$FILE" | awk '{print $2}' | tr -d '"')
fi
name=$(rg -A1 'name: Homepage' "$FILE" | rg 'content_signal' | awk '{print $2}' | tr -d '"')
curl -sfS "$BASE/" | rg -q "$name"