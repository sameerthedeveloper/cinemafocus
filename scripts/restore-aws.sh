#!/usr/bin/env bash
# Restore a backup made by scripts/backup-aws.sh into the CURRENTLY ACTIVE AWS account.
# Run AFTER deploying the stack there (cd infra && npx serverless deploy), which creates
# the empty tables, bucket, Cognito pool and CloudFront.
# Usage: scripts/restore-aws.sh <backup_dir> [bucket_name]
set -euo pipefail

BK="${1:?backup dir required}"
REGION="${AWS_REGION:-ap-south-1}"
BUCKET="${2:-${IMAGES_BUCKET:-cinemafocus-images}}"
PREFIX="${DYNAMO_TABLE_PREFIX:-cinemafocus-}"
echo "Restoring into account $(aws sts get-caller-identity --query Account --output text), region $REGION"

for f in "$BK"/dynamodb/*.items.json; do
  name="$(basename "$f" .items.json)"
  echo "DynamoDB: $name"
  python3 - "$f" "$name" "$REGION" <<'PY'
import json, subprocess, sys, tempfile, os
f, table, region = sys.argv[1:4]
items = json.load(open(f))["Items"]
for i in range(0, len(items), 25):
    req = {table: [{"PutRequest": {"Item": it}} for it in items[i:i+25]]}
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as t:
        json.dump(req, t)
    for _ in range(5):
        out = subprocess.run(["aws","dynamodb","batch-write-item","--region",region,
                              "--request-items","file://"+t.name], capture_output=True, text=True)
        if out.returncode: sys.exit(out.stderr)
        un = json.loads(out.stdout or "{}").get("UnprocessedItems")
        if not un: break
        req = un
        json.dump(req, open(t.name, "w"))
    os.unlink(t.name)
print("  restored", len(items))
PY
done

echo "S3: uploading to s3://$BUCKET"
aws s3 sync "$BK"/s3/*/ "s3://$BUCKET" --region "$REGION" --only-show-errors

echo "Done. Cognito users are NOT restored (passwords can't be exported): recreate admins with"
echo "  scripts/create-cognito-user.mjs, then update .env.local (API_GATEWAY_URL, COGNITO_*, CDN_DOMAIN)."
