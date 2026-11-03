#!/usr/bin/env bash
# Full backup of the CinemaFocus AWS backend (DynamoDB + S3 + Cognito users + config).
# Usage: scripts/backup-aws.sh [output_dir]
# Uses the currently active AWS CLI credentials. Output is gitignored (aws-backup-*).
set -euo pipefail

REGION="${AWS_REGION:-ap-south-1}"
BUCKET="${IMAGES_BUCKET:-cinemafocus-images}"
POOL_ID="${COGNITO_POOL_ID:-}"
if [ -z "$POOL_ID" ] && [ -f .env.local ]; then
  POOL_ID="$(grep -E '^COGNITO_POOL_ID=' .env.local | cut -d= -f2- | tr -d '"' || true)"
fi
TABLES=(Users Products Categories NewLaunches PressReleases Projects Messages SiteSettings Stats)
PREFIX="${DYNAMO_TABLE_PREFIX:-cinemafocus-}"

OUT="${1:-aws-backup-$(date +%Y%m%d-%H%M%S)}"
mkdir -p "$OUT"/{dynamodb,s3,cognito,config}
echo "Account: $(aws sts get-caller-identity --query Account --output text)  Region: $REGION  Out: $OUT"

for t in "${TABLES[@]}"; do
  name="${PREFIX}${t}"
  echo "DynamoDB: $name"
  aws dynamodb describe-table --table-name "$name" --region "$REGION" --query Table \
    > "$OUT/dynamodb/$name.schema.json"
  # Paginated full scan (CLI auto-paginates and merges Items)
  aws dynamodb scan --table-name "$name" --region "$REGION" --output json > "$OUT/dynamodb/$name.items.json"
  echo "  items: $(python3 -c "import json,sys;print(len(json.load(open(sys.argv[1]))['Items']))" "$OUT/dynamodb/$name.items.json")"
done

echo "S3: syncing s3://$BUCKET"
aws s3 sync "s3://$BUCKET" "$OUT/s3/$BUCKET" --region "$REGION" --only-show-errors

if [ -n "$POOL_ID" ]; then
  echo "Cognito: exporting pool config and users"
  aws cognito-idp describe-user-pool --user-pool-id "$POOL_ID" --region "$REGION" --query UserPool > "$OUT/cognito/pool.json"
  aws cognito-idp list-user-pool-clients --user-pool-id "$POOL_ID" --region "$REGION" > "$OUT/cognito/clients.json"
  aws cognito-idp list-users --user-pool-id "$POOL_ID" --region "$REGION" > "$OUT/cognito/users.json"
else
  echo "Cognito: COGNITO_POOL_ID not found, skipped"
fi

# Infra definition + non-secret config needed to redeploy in the new account
cp infra/serverless.yml "$OUT/config/serverless.yml"
cp infra/legacy/supabase_schema.sql "$OUT/config/" 2>/dev/null || true
grep -E '^[A-Z_]+=' .env.local 2>/dev/null | sed -E 's/=.*/=/' > "$OUT/config/env-variable-names.txt" || true

# Integrity manifest
( cd "$OUT" && find . -type f ! -name MANIFEST.sha256 -exec shasum -a 256 {} + > MANIFEST.sha256 )
echo "Done. $(du -sh "$OUT" | cut -f1) in $OUT"
