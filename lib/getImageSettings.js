import { unstable_cache } from 'next/cache';
import { createPublicClient } from './supabase/server';
import { fetchSiteSetting } from './db';

/**
 * High-performance, cached server helper to retrieve the image optimization mode settings.
 * Safe for use during pre-rendering and build-time generation as it uses the cookie-free createPublicClient.
 * Revalidates every hour or immediately when the 'settings' tag is revalidated (e.g. via revalidateData('settings')).
 * 
 * @returns {Promise<{ imageOptimizationMode: 'upload' | 'runtime' | 'hybrid' }>} Cached settings object.
 */
export const getImageSettings = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    try {
      const { data, error } = await fetchSiteSetting(supabase, 'general');
      if (error || !data) {
        console.warn('[getImageSettings] General settings not found, falling back to default imageOptimizationMode: upload');
        return { imageOptimizationMode: 'upload' };
      }
      
      return {
        imageOptimizationMode: data.data?.imageOptimizationMode || 'upload'
      };
    } catch (error) {
      console.error('[getImageSettings] Error fetching general site settings:', error);
      return { imageOptimizationMode: 'upload' };
    }
  },
  ['image-settings'],
  { 
    revalidate: 3600, // Cache for up to 1 hour
    tags: ['settings'] // Immediate purge on settings change
  }
);
