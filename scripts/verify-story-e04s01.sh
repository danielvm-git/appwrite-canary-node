#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
test -f "$ROOT/public/shell/SHELL_PIN"
grep -q v0 "$ROOT/public/shell/SHELL_PIN"
test -d "$ROOT/public/shell/ds"
test -f "$ROOT/public/shell/ds/colors_and_type.css"
echo "e04s01 verify OK"