#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
npm run preflight
grep -q createFile src/pages/StoragePage.tsx
echo "e07s01 verify OK"