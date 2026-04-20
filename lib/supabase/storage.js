import { createClient } from './client';

/**
 * Centrally managed helper to construct product image URLs.
 * Supports deep nested folder structure: products/<brand>/<slug>/<filename>
 * 
 * @param {string} brand - Product brand (e.g. 'atc')
 * @param {string} slug - Product slug (e.g. 'atc-scm-100a-sl-pro')
 * @param {string|null} filename - Optional specific filename. Defaults to `${slug}-0.jpg` or similar.
 * @returns {string} The public URL for the image
 */
export function getProductImageUrl(brand, slug, filename = null) {
  if (!brand || !slug) return null;
  
  const supabase = createClient();
  const bucket = 'images';
  const cleanBrand = brand.toLowerCase();
  
  // Default to the first image if filename is not provided
  const file = filename || `${slug}-0.jpg`;
  
  const path = `products/${cleanBrand}/${slug}/${file}`;
  
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
