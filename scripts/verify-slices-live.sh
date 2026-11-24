#!/usr/bin/env bash
# Post-deploy slice wiring check (no credentials).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
npm run preflight
bash scripts/verify-story-e05s01.sh
bash scripts/verify-story-e06s01.sh
bash scripts/verify-story-e07s01.sh
bash scripts/run-smoke.sh
echo "slices verify OK"