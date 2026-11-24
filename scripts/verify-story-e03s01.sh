#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
test -f "$ROOT/smoke-checks.staging.yaml"
grep -q node-staging.danielvm.net "$ROOT/smoke-checks.staging.yaml"
test -x "$ROOT/scripts/run-smoke.sh"
# dry-run: staging deploy uses same dist path
bash -n "$ROOT/scripts/deploy-appwrite.sh"
echo "e03s01 verify OK"