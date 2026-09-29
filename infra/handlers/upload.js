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
    const rawName = String(body.fileName || "upload").replace(/\s+/g, "_");
    const dotIndex = rawName.lastIndexOf(".");
    const ext = dotIndex !== -1 ? rawName.slice(dotIndex) : "";
    const baseName = dotIndex !== -1 ? rawName.slice(0, dotIndex) : rawName;
    // Presigned PUT bypasses the Next.js server entirely, so there's no Sharp
    // pass to re-encode to WebP here — the original format/bytes are stored
    // as-is. Width variants are generated after the fact by resizeImage.js.
    const key = `${folder}/${Date.now()}_${baseName}${ext}`;
    const contentType = body.contentType || "application/octet-stream";

    const command = new PutObjectCommand({
      Bucket: BUCKET(),
      Key: key,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
    const publicUrl = `https://${process.env.CDN_DOMAIN}/${key}`;

    return json(200, { uploadUrl, key, publicUrl });
  } catch (e) {
    return errorResponse(e);
  }
}
