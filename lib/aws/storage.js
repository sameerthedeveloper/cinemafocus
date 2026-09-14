/**
 * CloudFront-backed replacement for lib/supabase/storage.js.
 * Preserves the exact nested path convention: products/<brand>/<slug>/<filename>
 */
export function getProductImageUrl(brand, slug, filename = null) {
  if (!brand || !slug) return null;

  const cleanBrand = brand.toLowerCase();
  const file = filename || `${slug}-0.jpg`;
  const path = `products/${cleanBrand}/${slug}/${file}`;

  return `https://${process.env.CDN_DOMAIN}/${path}`;
}
