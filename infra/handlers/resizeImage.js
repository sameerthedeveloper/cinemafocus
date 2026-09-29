import sharp from "sharp";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({});
const WIDTHS = [320, 640, 750, 828, 1080, 1200, 1920, 2048, 3840];
const SIZED_PATTERN = /-w\d+\.[a-zA-Z0-9]+$/;

async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export async function handler(event) {
  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));

    // Skip objects that are already-generated width variants to avoid
    // re-triggering this same function recursively.
    if (SIZED_PATTERN.test(key)) continue;

    const { Body, ContentType } = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    const buffer = await streamToBuffer(Body);

    const dotIndex = key.lastIndexOf(".");
    const ext = dotIndex !== -1 ? key.slice(dotIndex) : "";
    const base = dotIndex !== -1 ? key.slice(0, dotIndex) : key;

    await Promise.all(WIDTHS.map(async (width) => {
      const resized = await sharp(buffer).resize({ width, withoutEnlargement: true }).toBuffer();
      await s3.send(new PutObjectCommand({
        Bucket: bucket,
        Key: `${base}-w${width}${ext}`,
        Body: resized,
        ContentType: ContentType || "image/jpeg",
        CacheControl: "public, max-age=31536000, immutable",
      }));
    }));
  }
}
