import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

const SiteSettingsContext = createContext();

export const useSiteSettings = () => useContext(SiteSettingsContext);

export const SiteSettingsProvider = ({ children }) => {
  const [theme] = useState('light'); // Hardcoded as per agreement
  const [showDesktopMenu, setShowDesktopMenu] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  const [loading, setLoading] = useState(true);

  const [seoSettings, setSeoSettings] = useState({
    siteTitle: 'Cinema Focus',
    titleSuffix: '| Premium Audio',
    defaultDescription: 'Experience the ultimate in high-fidelity audio.',
    defaultKeywords: 'audio, hifi, speakers'
  });

  useEffect(() => {
    // 1. General Settings Listener
    const settingsRef = doc(db, 'site_settings', 'general');
    const unsubSettings = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.showDesktopMenu !== undefined) setShowDesktopMenu(data.showDesktopMenu);
        if (data.showPrice !== undefined) setShowPrice(data.showPrice);
      } else {
        setDoc(settingsRef, { showDesktopMenu: true, showPrice: true }, { merge: true });
      }
    });

    // 2. SEO Settings Listener
    const seoRef = doc(db, 'site_content', 'seo');
    const unsubSeo = onSnapshot(seoRef, (docSnap) => {
      if (docSnap.exists()) {
        setSeoSettings(prev => ({ ...prev, ...docSnap.data() }));
      } else {
        // Initialize default SEO doc if missing
        setDoc(seoRef, seoSettings, { merge: true });
      }
      setLoading(false); // Set loading false after at least SEO attempts load
    });

    return () => {
      unsubSettings();
      unsubSeo();
    };
  }, []);

  const updateSettings = async (settings) => {
    try {
      await setDoc(doc(db, 'site_settings', 'general'), settings, { merge: true });
    } catch (error) {
      console.error("Error updating settings:", error);
      throw error;
    }
  };
  
  // Legacy support for theme update (noop)
  const updateTheme = async () => {};

  return (
    <SiteSettingsContext.Provider value={{ theme, showDesktopMenu, showPrice, seoSettings, updateSettings, updateTheme, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};
