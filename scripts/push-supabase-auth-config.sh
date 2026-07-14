#!/usr/bin/env bash
set -euo pipefail

required_vars=(
  "SUPABASE_AUTH_SMTP_HOST"
  "SUPABASE_AUTH_SMTP_USER"
  "SUPABASE_AUTH_SMTP_PASS"
  "SUPABASE_AUTH_SMTP_ADMIN_EMAIL"
)

for var_name in "${required_vars[@]}"; do
  if [[ -z "${!var_name:-}" ]]; then
    echo "Missing required environment variable: ${var_name}" >&2
    exit 1
  fi
done

supabase config push --project-ref qxugymzyvtbxeyqcvtgk
