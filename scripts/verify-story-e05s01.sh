#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
npm run preflight
grep -q createEmailPasswordSession src/pages/AuthPage.tsx
echo "e05s01 verify OK"