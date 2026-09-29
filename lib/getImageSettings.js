import { unstable_cache } from 'next/cache';
import { getGeneralSettings } from './cms';

/**
 * High-performance, cached server helper to retrieve the image optimization mode settings.
 * Reads the 'general' site setting through the CMS layer (AWS) and
 * is safe for use during pre-rendering and build-time generation.
 * Revalidates every hour or immediately when the 'settings' tag is revalidated (e.g. via revalidateData('settings')).
 * 
 * @returns {Promise<{ imageOptimizationMode: 'upload' | 'runtime' | 'hybrid' }>} Cached settings object.
 */
export const getImageSettings = unstable_cache(
  async () => {
    try {
      const general = await getGeneralSettings();
      if (!general) {
        console.warn('[getImageSettings] General settings not found, falling back to default imageOptimizationMode: upload');
        return { imageOptimizationMode: 'upload' };
      }

      return {
        imageOptimizationMode: general.imageOptimizationMode || 'upload'
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
