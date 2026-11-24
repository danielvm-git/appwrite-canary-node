#!/usr/bin/env bash
# Deploy active build to staging host (same Site; staging rule must target this site).
set -euo pipefail
echo "dry-run: staging uses APPWRITE_SITE_ID + node-staging.danielvm.net proxy rule"
exec bash "$(dirname "$0")/deploy-appwrite.sh"