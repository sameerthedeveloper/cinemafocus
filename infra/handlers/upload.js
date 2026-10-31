import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { requireAdmin, errorResponse } from "../lib/aws/authz.js";
import { json, parseBody } from "../lib/http.js";
import { ValidationError } from "../lib/aws/validators.js";
import { pick } from "../lib/validate.js";

const s3 = new S3Client({});
const BUCKET = () => process.env.IMAGES_BUCKET;

// Top-level prefixes that already exist in the bucket.
export const ALLOWED_FOLDERS = ["about", "hero", "optimized", "press", "products", "projects", "uploads"];
// Raster images only. SVG and HTML are rejected: served from the CDN origin they can run script.
export const TYPES = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
  "image/avif": ["avif"],
  "image/gif": ["gif"],
};
export const MAX_BYTES = 10 * 1024 * 1024;

const SEGMENT_RE = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;

export function validateUpload(body) {
  const { folder = "uploads", fileName, contentType, size } = pick(body, ["folder", "fileName", "contentType", "size"]);

  if (typeof folder !== "string" || folder.length > 200) throw new ValidationError("folder is invalid");
  const segments = folder.split("/").filter(Boolean);
  if (segments.length === 0 || segments.length > 6) throw new ValidationError("folder is invalid");
  if (!ALLOWED_FOLDERS.includes(segments[0])) throw new ValidationError(`folder must start with one of: ${ALLOWED_FOLDERS.join(", ")}`);
  if (!segments.every((s) => SEGMENT_RE.test(s))) throw new ValidationError("folder contains invalid characters");

  if (typeof contentType !== "string" || !TYPES[contentType]) throw new ValidationError("Only JPEG, PNG, WebP, AVIF and GIF images are allowed");

  if (typeof fileName !== "string" || fileName.length === 0 || fileName.length > 200) throw new ValidationError("fileName is invalid");
  const clean = fileName.replace(/\s+/g, "_");
  const dot = clean.lastIndexOf(".");
  const ext = dot === -1 ? "" : clean.slice(dot + 1).toLowerCase();
  if (!TYPES[contentType].includes(ext)) throw new ValidationError("File extension does not match the content type");
  const base = clean.slice(0, dot).replace(/[^A-Za-z0-9_.-]/g, "-").replace(/\.{2,}/g, ".").replace(/^[.-]+/, "").slice(0, 100);
  if (!base) throw new ValidationError("fileName is invalid");

  if (!Number.isInteger(size) || size < 1 || size > MAX_BYTES) throw new ValidationError(`size must be an integer between 1 and ${MAX_BYTES} bytes`);

  return { key: `${segments.join("/")}/${Date.now()}_${base}.${ext}`, contentType, size };
}

export async function getPresignedUrl(event) {
  try {
    await requireAdmin(event);
    const { key, contentType, size } = validateUpload(parseBody(event));

    // ContentLength is part of the signature, so S3 rejects a body of any other size.
    const command = new PutObjectCommand({
      Bucket: BUCKET(),
      Key: key,
      ContentType: contentType,
      ContentLength: size,
      CacheControl: "public, max-age=31536000, immutable",
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
    const publicUrl = `https://${process.env.CDN_DOMAIN}/${key}`;

    return json(200, { uploadUrl, key, publicUrl });
  } catch (e) {
    return errorResponse(e);
  }
}
