/**
 * Supabase Image Loader
 * Transforms requests to use Supabase's built-in Image Transformation API.
 * This ensures we only download the exact resolution needed by the client.
 * 
 * Documentation: https://supabase.com/docs/guides/storage/serving/image-transformations
 */
export default function supabaseLoader({ src, width, quality }) {
  // If the image is already a full URL and not from Supabase, return as is
  if (src.startsWith('http') && !src.includes('supabase.co')) {
    return src;
  }

  // Handle Supabase public URLs
  // Standard: https://[id].supabase.co/storage/v1/object/public/[bucket]/[path]
  // Transform: https://[id].supabase.co/storage/v1/render/image/public/[bucket]/[path]?width=[w]&quality=[q]
  
  if (src.includes('/storage/v1/object/public/')) {
    const url = src.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
    return `${url}?width=${width}&quality=${quality || 75}`;
  }

  // If it's a local path (e.g. from public folder), return as is
  return src;
}
