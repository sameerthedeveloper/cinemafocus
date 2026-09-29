"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSettingData } from '@/lib/aws/adapter';
import { revalidateData } from '@/lib/actions';

// Admin-only writes go to AWS through the supabase-js-compatible query shim.
// Loaded lazily so public pages never download it.
const getSupabase = async () => (await import('@/lib/aws/queryClient')).createClient();

const SiteSettingsContext = createContext();

export const useSiteSettings = () => useContext(SiteSettingsContext);

export const SiteSettingsProvider = ({ children, initialImageOptimizationMode = 'upload' }) => {
  const [theme, setTheme] = useState('light');
  const [showDesktopMenu, setShowDesktopMenu] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  const [imageOptimizationMode, setImageOptimizationMode] = useState(initialImageOptimizationMode);
  const [loading, setLoading] = useState(true);

  const [seoSettings, setSeoSettings] = useState({
    siteTitle: 'Cinema Focus',
    titleSuffix: '| Premium Audio',
    defaultDescription: 'Experience the ultimate in high-fidelity audio.',
    defaultKeywords: 'audio, hifi, speakers'
  });

  useEffect(() => {
    let cancelled = false;

    const fetchSettings = async () => {
      // Public settings come from AWS (through the same-origin /api/aws proxy).
      const [general, seo] = await Promise.allSettled([getSettingData('general'), getSettingData('seo')]);
      if (cancelled) return;

      if (general.status === 'fulfilled' && general.value) {
        const g = general.value;
        if (g.showDesktopMenu !== undefined) setShowDesktopMenu(g.showDesktopMenu);
        if (g.showPrice !== undefined) setShowPrice(g.showPrice);
        if (g.imageOptimizationMode !== undefined) setImageOptimizationMode(g.imageOptimizationMode);
      } else if (general.status === 'rejected') {
        console.warn("Settings fetch failed:", general.reason);
      }
      if (seo.status === 'fulfilled' && seo.value) {
        setSeoSettings(prev => ({ ...prev, ...seo.value }));
      }
      setLoading(false);
    };

    fetchSettings();
    return () => { cancelled = true; };
  }, []);

  const updateSettings = async (partialSettings) => {
    try {
      const supabase = await getSupabase();
      // 1. Fetch current 'general' data to ensure a clean merge
      const { data: current, error: fetchError } = await supabase
        .from('site_settings')
        .select('data')
        .eq('id', 'general')
        .single();

      const baseData = current?.data || { showDesktopMenu: true, showPrice: true, imageOptimizationMode: 'upload' };
      const mergedData = { ...baseData, ...partialSettings };

      // 2. Upsert to save safely
      const { error } = await supabase
        .from('site_settings')
        .upsert({ id: 'general', data: mergedData });
      
      if (error) throw error;
      
      // Revalidate server cache
      await revalidateData('settings');
      
      // 3. Optimistic local update for zero-latency feel
      if (mergedData.showDesktopMenu !== undefined) setShowDesktopMenu(mergedData.showDesktopMenu);
      if (mergedData.showPrice !== undefined) setShowPrice(mergedData.showPrice);
      if (mergedData.imageOptimizationMode !== undefined) setImageOptimizationMode(mergedData.imageOptimizationMode);
      
    } catch (error) {
      console.error("Error updating settings:", error);
      throw error;
    }
  };

  const updateSeoSettings = async (partialSeo) => {
    try {
      const supabase = await getSupabase();
      const { data: current } = await supabase
        .from('site_settings')
        .select('data')
        .eq('id', 'seo')
        .single();

      const mergedData = { ...(current?.data || {}), ...partialSeo };

      const { error } = await supabase
        .from('site_settings')
        .upsert({ id: 'seo', data: mergedData });
      
      if (error) throw error;
      
      // Revalidate server cache
      await revalidateData('settings');
      
      setSeoSettings(mergedData);
    } catch (error) {
      console.error("Error updating SEO settings:", error);
      throw error;
    }
  };
  
  const updateTheme = (newTheme) => {
    setTheme(newTheme || (theme === 'light' ? 'dark' : 'light'));
  };

  return (
    <SiteSettingsContext.Provider value={{ theme, showDesktopMenu, showPrice, imageOptimizationMode, seoSettings, updateSettings, updateSeoSettings, updateTheme, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useImageOptimizationMode = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useImageOptimizationMode must be used within a SiteSettingsProvider');
  }
  return {
    mode: context.imageOptimizationMode || 'upload',
    setMode: (mode) => context.updateSettings({ imageOptimizationMode: mode }),
    loading: context.loading
  };
};
