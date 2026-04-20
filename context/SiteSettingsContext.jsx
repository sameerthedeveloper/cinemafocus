"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

const SiteSettingsContext = createContext();

export const useSiteSettings = () => useContext(SiteSettingsContext);

export const SiteSettingsProvider = ({ children }) => {
  const [theme] = useState('light');
  const [showDesktopMenu, setShowDesktopMenu] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  const [loading, setLoading] = useState(true);
  const [supabase] = useState(() => createClient());

  const [seoSettings, setSeoSettings] = useState({
    siteTitle: 'Cinema Focus',
    titleSuffix: '| Premium Audio',
    defaultDescription: 'Experience the ultimate in high-fidelity audio.',
    defaultKeywords: 'audio, hifi, speakers'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Fetch SEO and General settings from Supabase
        const { data, error } = await supabase
          .from('site_settings')
          .select('id, data')
          .in('id', ['general', 'seo']);

        if (error) throw error;

        if (data) {
          data.forEach(row => {
            if (row.id === 'general') {
              if (row.data.showDesktopMenu !== undefined) setShowDesktopMenu(row.data.showDesktopMenu);
              if (row.data.showPrice !== undefined) setShowPrice(row.data.showPrice);
            }
            if (row.id === 'seo') {
              setSeoSettings(prev => ({ ...prev, ...row.data }));
            }
          });
        }
      } catch (error) {
        console.warn("Settings fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();

    // Set up Realtime listener for site_settings changes
    const channel = supabase
      .channel('site_settings_changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'site_settings' },
        (payload) => {
          const { id, data: newData } = payload.new;
          if (id === 'general') {
             if (newData.showDesktopMenu !== undefined) setShowDesktopMenu(newData.showDesktopMenu);
             if (newData.showPrice !== undefined) setShowPrice(newData.showPrice);
          }
          if (id === 'seo') {
             setSeoSettings(prev => ({ ...prev, ...newData }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const updateSettings = async (partialSettings) => {
    try {
      // 1. Fetch current 'general' data to ensure a clean merge
      const { data: current, error: fetchError } = await supabase
        .from('site_settings')
        .select('data')
        .eq('id', 'general')
        .single();

      const baseData = current?.data || { showDesktopMenu: true, showPrice: true };
      const mergedData = { ...baseData, ...partialSettings };

      // 2. Upsert to save safely
      const { error } = await supabase
        .from('site_settings')
        .upsert({ id: 'general', data: mergedData });
      
      if (error) throw error;
      
      // 3. Optimistic local update for zero-latency feel
      if (mergedData.showDesktopMenu !== undefined) setShowDesktopMenu(mergedData.showDesktopMenu);
      if (mergedData.showPrice !== undefined) setShowPrice(mergedData.showPrice);
      
    } catch (error) {
      console.error("Error updating settings:", error);
      throw error;
    }
  };

  const updateSeoSettings = async (partialSeo) => {
    try {
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
      setSeoSettings(mergedData);
    } catch (error) {
      console.error("Error updating SEO settings:", error);
      throw error;
    }
  };
  
  const updateTheme = async () => {};

  return (
    <SiteSettingsContext.Provider value={{ theme, showDesktopMenu, showPrice, seoSettings, updateSettings, updateSeoSettings, updateTheme, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};
