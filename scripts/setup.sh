#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SHELL_ROOT="$(cd "$ROOT/../appwrite-canary-shell" && pwd)"

if [[ -f "$SHELL_ROOT/scripts/sync-shell.sh" ]]; then
  bash "$SHELL_ROOT/scripts/sync-shell.sh" "$ROOT"
  echo "v0.1.0" >"$ROOT/public/shell/SHELL_PIN"
fi

if [[ ! -f "$ROOT/.env" && -f "$ROOT/.env.example" ]]; then
  cp "$ROOT/.env.example" "$ROOT/.env"
  echo "Created .env from .env.example — set Appwrite values"
fi

npm install
echo "OK: setup complete"