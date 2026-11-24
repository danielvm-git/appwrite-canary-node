#!/usr/bin/env bash
# Production smoke for current VERSION (SPA-aware).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VER="$(cat "$ROOT/VERSION")"
BASE="${SMOKE_BASE_URL:-https://node.danielvm.net}"
html="$(curl -skS "$BASE/")"
asset="$(echo "$html" | grep -oE '/assets/index-[^"]+\.js' | head -1)"
[ -n "$asset" ] || { echo "no bundle" >&2; exit 1; }
js="$(curl -skS "$BASE$asset")"
echo "$js" | grep -q 'Hello World'
echo "$js" | grep -q "v$VER"
health="$(curl -skS "$BASE/health.json")"
echo "$health" | grep -q '"status"'
echo "$health" | grep -q '"version"'
echo "$health" | grep -q "$VER"
echo "smoke OK v$VER @ $BASE"