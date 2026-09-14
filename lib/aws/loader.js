/**
 * CloudFront/S3 image loader — replacement for lib/supabase/loader.js.
 * CloudFront + S3 has no on-the-fly resize API (unlike Supabase's render/image
 * transform endpoint), so pre-generated width variants are produced at upload
 * time by the S3-triggered resize Lambda (see infra/handlers/resizeImage.js)
 * using this same WIDTHS list. This loader picks the nearest available width
 * at or above the requested width — deterministic, no network call needed.
 */
export const WIDTHS = [320, 640, 750, 828, 1080, 1200, 1920, 2048, 3840];

function nearestWidth(width) {
  return WIDTHS.find((w) => w >= width) || WIDTHS[WIDTHS.length - 1];
}

export default function awsImageLoader({ src, width }) {
  // Local/public-folder assets and any non-CDN absolute URL pass through unchanged
  if (!src.includes(process.env.NEXT_PUBLIC_CDN_DOMAIN || "")) {
    return src;
  }

  const dotIndex = src.lastIndexOf(".");
  if (dotIndex === -1) return src;

  const ext = src.slice(dotIndex);
  const base = src.slice(0, dotIndex);
  const targetWidth = nearestWidth(width);

  return `${base}-w${targetWidth}${ext}`;
}
