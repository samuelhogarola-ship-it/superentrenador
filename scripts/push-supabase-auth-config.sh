#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${repo_root}"

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

node "${repo_root}/scripts/verify-supabase-project.mjs" --workdir "${repo_root}"
supabase config push --project-ref qxugymzyvtbxeyqcvtgk
