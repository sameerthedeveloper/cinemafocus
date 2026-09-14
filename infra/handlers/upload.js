import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { requireAdmin, errorResponse } from "../lib/aws/authz.js";
import { json, parseBody } from "../lib/http.js";

const s3 = new S3Client({});
const BUCKET = () => process.env.IMAGES_BUCKET;

export async function getPresignedUrl(event) {
  try {
    await requireAdmin(event);
    const body = parseBody(event);
    const folder = body.folder || "uploads";
    const baseName = String(body.fileName || "upload")
      .replace(/\s+/g, "_")
      .replace(/\.[^/.]+$/, "");
    const key = `${folder}/${Date.now()}_${baseName}.webp`;

    const command = new PutObjectCommand({
      Bucket: BUCKET(),
      Key: key,
      ContentType: "image/webp",
      CacheControl: "public, max-age=31536000, immutable",
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
    const publicUrl = `https://${process.env.CDN_DOMAIN}/${key}`;

    return json(200, { uploadUrl, key, publicUrl });
  } catch (e) {
    return errorResponse(e);
  }
}
