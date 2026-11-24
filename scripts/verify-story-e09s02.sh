#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
grep -qxF v2.0.0 public/shell/SHELL_PIN
test -d functions/share-task
bash "$ROOT/scripts/preflight.sh"
export VITE_APPWRITE_ENDPOINT="${VITE_APPWRITE_ENDPOINT:-https://appwrite.danielvm.net/v1}"
export VITE_APPWRITE_PROJECT_ID="${VITE_APPWRITE_PROJECT_ID:-local}"
export VITE_SHARE_FUNCTION_ID=share-task
export VITE_CANARY_NAME=Node
export VITE_REPO_URL=https://github.com/danielvm-git/appwrite-canary-node
npm run build
bundle="$(ls dist/assets/index-*.js | head -1)"
grep -q 'Shared with me' "$bundle"
grep -q share-task "$bundle"
grep -q Node "$bundle"
grep -q danielvm-git/appwrite-canary-node "$bundle"
echo "verify-story-e09s02: OK"