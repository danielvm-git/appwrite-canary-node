#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
npm run preflight
grep -q listDocuments src/pages/DatabasePage.tsx
echo "e06s01 verify OK"