"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Save, Upload, Database, LayoutTemplate, Info, Phone, Shield, Globe, Plus, Trash2 } from 'lucide-react';
import BackupTools from '@/components/admin/BackupTools';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import clsx from 'clsx';
import { seedDatabase } from '@/lib/seeder';
import { revalidateData } from '@/lib/actions';

export default function AdminSiteControlPage() {
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const themeContext = useSiteSettings();
  const supabase = createClient();
  
  // States
  const [hero, setHero] = useState({ title: '', imageUrl: '' });
  const [philosophy, setPhilosophy] = useState({ title: '', text: '' });
  const [footer, setFooter] = useState({ address: '', phones: [], email: '', facebook: '', instagram: '', twitter: '', workingHours: '' });
  const [trustBadges, setTrustBadges] = useState([]);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let settingId = null;
      if (activeTab === 'hero') settingId = 'hero_main';
      else if (activeTab === 'philosophy') settingId = 'philosophy';
      else if (activeTab === 'footer') settingId = 'footer';
      else if (activeTab === 'trust') settingId = 'trust_badges';
      
      if (!settingId) {
        setLoading(false);
        return;
      }

      let { data, error } = await supabase
        .from('site_settings')
        .select('data')
        .eq('id', settingId)
        .single();

      if (error && error.code === 'PGRST205') {
        const fallback = await supabase
          .from('site_content')
          .select('data')
          .eq('id', settingId)
          .single();
        data = fallback.data;
        error = fallback.error;
      }

      if (data) {
        const val = data.data;
        if (activeTab === 'hero') setHero(prev => ({...prev, ...val}));
        else if (activeTab === 'philosophy') setPhilosophy(prev => ({...prev, ...val}));
        else if (activeTab === 'footer') setFooter(prev => ({...prev, ...val}));
        else if (activeTab === 'trust') setTrustBadges(val.items || []);
      } else {
        // Fallback for missing trust badges
        if (activeTab === 'trust') {
            setTrustBadges([
             { icon: 'Globe', title: 'Global Shipping', description: 'Insured delivery worldwide' },
             { icon: 'ShieldCheck', title: '5-Year Warranty', description: 'On all premium components' },
             { icon: 'Headphones', title: 'Expert Support', description: 'Consult with audiophiles' },
             { icon: 'Award', title: 'Authorized Dealer', description: '100% Genuine Products' }
           ]);
        }
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleSave = async (settingId, data) => {
    setLoading(true);
    try {
      // Try to upsert to site_settings first
      let { error } = await supabase
        .from('site_settings')
        .upsert({ id: settingId, data });
      
      // If table doesn't exist, fallback to site_content
      if (error && error.code === 'PGRST205') {
        const fallback = await supabase
          .from('site_content')
          .upsert({ id: settingId, data });
        error = fallback.error;
      }
      
      if (error) throw error;
      
      // Revalidate server cache for settings
      await revalidateData('settings');
      
      setMessage('Saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (e) {
      console.error(e);
      setMessage('Error saving: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleHeroImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `hero/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      setHero(prev => ({ ...prev, imageUrl: publicUrl }));
      setMessage("Image uploaded! Don't forget to save.");
      
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage("Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  const saveSection = (id, data) => handleSave(id, data);

  const handleTrustChange = (index, field, value) => {
    const newBadges = [...trustBadges];
    newBadges[index][field] = value;
    setTrustBadges(newBadges);
  };

  const handleSeed = async () => {
    if (window.confirm("This will overwrite existing products and categories with sample data in Supabase. Continue?")) {
      setLoading(true);
      try {
        await seedDatabase();
        setMessage("Database seeded successfully!");
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error("Seeding Error:", error);
        setMessage("Seeding failed: " + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: LayoutTemplate },
    { id: 'navigation', label: 'Navigation', icon: Globe },
    { id: 'philosophy', label: 'About/Philosophy', icon: Info },
    { id: 'trust', label: 'Trust Badges', icon: Shield },
    { id: 'footer', label: 'Footer & Contact', icon: Phone },
    { id: 'database', label: 'Database Ops', icon: Database },
  ];

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto animate-fade-in pb-20 md:pb-8">
      <header className="mb-8 md:mb-10">
         <h1 className="text-2xl md:text-3xl font-medium tracking-tight">Site Control</h1>
         <p className="text-muted-foreground mt-1 text-sm md:text-base">Customize global website content.</p>
      </header>
      
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-6 border-b border-border mb-8 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
              activeTab === tab.id 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-muted-foreground hover:bg-secondary/70"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        
        {/* HERO TAB */}
        {activeTab === 'hero' && (
          <div className="bg-background border border-border rounded-2xl p-4 md:p-8 space-y-6">
             <div className="space-y-2">
               <label className="text-sm font-medium">Main Hero Title</label>
               <input value={hero.title} onChange={e => setHero({...hero, title: e.target.value})} className="w-full p-3 bg-secondary/30 rounded-lg border border-border outline-none focus:border-primary" placeholder="e.g. The Future of Sound" />
             </div>

             <div className="space-y-2">
               <label className="text-sm font-medium">Subtitle</label>
               <input value={hero.subtitle || ''} onChange={e => setHero({...hero, subtitle: e.target.value})} className="w-full p-3 bg-secondary/30 rounded-lg border border-border outline-none focus:border-primary" placeholder="e.g. Experience audio perfection..." />
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-sm font-medium">CTA Button Text</label>
                   <input value={hero.ctaText || ''} onChange={e => setHero({...hero, ctaText: e.target.value})} className="w-full p-3 bg-secondary/30 rounded-lg border border-border outline-none focus:border-primary" placeholder="e.g. Discover Products" />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-medium">CTA Button Link</label>
                   <input value={hero.ctaLink || ''} onChange={e => setHero({...hero, ctaLink: e.target.value})} className="w-full p-3 bg-secondary/30 rounded-lg border border-border outline-none focus:border-primary" placeholder="e.g. /products" />
                </div>
             </div>
             
             <div className="space-y-2">
               <label className="text-sm font-medium">Hero Background Image</label>
               <div className="flex gap-4 items-start">
                  <div className="w-32 h-20 bg-secondary rounded-lg overflow-hidden border border-border">
                    {hero.imageUrl && <img src={hero.imageUrl} className="w-full h-full object-cover" />}
                  </div>
                  <label className="cursor-pointer bg-secondary px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/70 flex items-center gap-2 border border-border transition-colors">
                    <Upload size={16} /> Upload New
                    <input type="file" className="hidden" accept="image/*" onChange={handleHeroImageUpload} />
                  </label>
               </div>
             </div>

             <button onClick={() => saveSection("hero_main", hero)} disabled={loading} className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 flex items-center gap-2 font-medium transition-opacity disabled:opacity-50">
               {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save Changes
             </button>
          </div>
        )}

        {/* PHILOSOPHY TAB */}
        {activeTab === 'philosophy' && (
          <div className="bg-background border border-border rounded-2xl p-4 md:p-8 space-y-6">
             <p className="text-sm text-muted-foreground mb-4">Edit text for specific site sections.</p>
             
             <div className="space-y-2">
               <label className="text-sm font-medium">Section Title</label>
               <input value={philosophy.title} onChange={e => setPhilosophy({...philosophy, title: e.target.value})} className="w-full p-3 bg-secondary/30 rounded-lg border border-border outline-none focus:border-primary" placeholder="Our Mission" />
             </div>
             <div className="space-y-2">
               <label className="text-sm font-medium">Content Text</label>
               <textarea value={philosophy.text} onChange={e => setPhilosophy({...philosophy, text: e.target.value})} rows={4} className="w-full p-3 bg-secondary/30 rounded-lg border border-border outline-none focus:border-primary" placeholder="Text content..." />
             </div>

             <button onClick={() => saveSection("philosophy", philosophy)} disabled={loading} className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 flex items-center gap-2 font-medium transition-opacity disabled:opacity-50">
               {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save Section
             </button>
          </div>
        )}
        
        {/* TRUST BADGES TAB */}
        {activeTab === 'trust' && (
           <div className="bg-background border border-border rounded-2xl p-4 md:p-8 space-y-6">
              <div className="flex justify-between items-center mb-4">
                 <p className="text-sm text-muted-foreground font-medium">Edit highlight markers.</p>
                 <button onClick={() => saveSection("trust_badges", { items: trustBadges })} disabled={loading} className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 flex items-center gap-2 font-medium transition-opacity">
                   {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save All
                 </button>
              </div>
              
              <div className="space-y-6">
                {trustBadges.map((badge, idx) => (
                  <div key={idx} className="p-4 bg-secondary/20 rounded-xl border border-border">
                     <h3 className="font-medium mb-3 text-sm uppercase tracking-wider text-muted-foreground">Badge {idx + 1}</h3>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-medium">Icon Name</label>
                          <input value={badge.icon} onChange={e => handleTrustChange(idx, 'icon', e.target.value)} className="w-full p-2 bg-background rounded border border-border text-sm outline-none focus:border-primary" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium">Title</label>
                          <input value={badge.title} onChange={e => handleTrustChange(idx, 'title', e.target.value)} className="w-full p-2 bg-background rounded border border-border text-sm outline-none focus:border-primary" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium">Description</label>
                          <input value={badge.description} onChange={e => handleTrustChange(idx, 'description', e.target.value)} className="w-full p-2 bg-background rounded border border-border text-sm outline-none focus:border-primary" />
                        </div>
                     </div>
                  </div>
                ))}
              </div>
           </div>
        )}

        {/* FOOTER TAB */}
        {activeTab === 'footer' && (
          <div className="bg-background border border-border rounded-2xl p-4 md:p-8 space-y-6">
             <div className="space-y-2">
               <label className="text-sm font-medium">Showroom Address</label>
               <input value={footer.address} onChange={e => setFooter({...footer, address: e.target.value})} className="w-full p-3 bg-secondary/30 rounded-lg border border-border outline-none focus:border-primary" placeholder="123 Audio Lane" />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-3">
                    <label className="text-sm font-medium">Phone Numbers</label>
                    {(footer.phones || []).length > 0 ? footer.phones.map((phone, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input 
                          value={phone} 
                          onChange={e => {
                            const newPhones = [...footer.phones];
                            newPhones[idx] = e.target.value;
                            setFooter({...footer, phones: newPhones});
                          }}
                          className="w-full p-3 bg-secondary/30 rounded-lg border border-border outline-none focus:border-primary" 
                          placeholder="+1 555 123 4567" 
                        />
                        <button onClick={() => {
                            const newPhones = footer.phones.filter((_, i) => i !== idx);
                            setFooter({...footer, phones: newPhones});
                        }} className="p-3 text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )) : (
                      <p className="text-xs text-muted-foreground italic">No phone numbers added.</p>
                    )}
                    <button onClick={() => setFooter(prev => ({ ...prev, phones: [...(prev.phones || []), ''] }))} className="text-sm text-primary hover:underline flex items-center gap-1 font-medium">
                      <Plus size={14} /> Add phone number
                    </button>
                 </div>

                 <div className="space-y-2">
                   <label className="text-sm font-medium">Email Address</label>
                   <input value={footer.email} onChange={e => setFooter({...footer, email: e.target.value})} className="w-full p-3 bg-secondary/30 rounded-lg border border-border outline-none focus:border-primary" placeholder="contact@example.com" />
                 </div>

                 <div className="space-y-2">
                   <label className="text-sm font-medium">Working Hours</label>
                   <textarea rows={3} value={footer.workingHours || ''} onChange={e => setFooter({...footer, workingHours: e.target.value})} className="w-full p-3 bg-secondary/30 rounded-lg border border-border outline-none focus:border-primary resize-none" placeholder="Mon - Fri: 10am - 7pm&#10;Sat: 11am - 5pm" />
                 </div>
             </div>
             
             <div className="pt-6 border-t border-border">
                <h3 className="font-medium mb-4 text-lg">Social Media Presence</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="space-y-2">
                     <label className="text-sm font-medium">Facebook</label>
                     <input value={footer.facebook || ''} onChange={e => setFooter({...footer, facebook: e.target.value})} className="w-full p-3 bg-secondary/30 rounded-lg border border-border outline-none focus:border-primary" placeholder="https://facebook.com/..." />
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-medium">Instagram</label>
                     <input value={footer.instagram || ''} onChange={e => setFooter({...footer, instagram: e.target.value})} className="w-full p-3 bg-secondary/30 rounded-lg border border-border outline-none focus:border-primary" placeholder="https://instagram.com/..." />
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-medium">Twitter/X</label>
                     <input value={footer.twitter || ''} onChange={e => setFooter({...footer, twitter: e.target.value})} className="w-full p-3 bg-secondary/30 rounded-lg border border-border outline-none focus:border-primary" placeholder="https://twitter.com/..." />
                   </div>
                </div>
             </div>

             <button onClick={() => saveSection("footer", footer)} disabled={loading} className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 flex items-center gap-2 font-medium transition-opacity disabled:opacity-50">
               {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Update Footer & Contact
             </button>
          </div>
        )}

        {/* DATABASE TAB */}
        {activeTab === 'database' && (
          <div className="bg-background border border-border rounded-2xl p-4 md:p-8 space-y-6">
             <div className="space-y-4">
               <h3 className="font-medium text-lg">Supabase Data Management</h3>
               <p className="text-sm text-muted-foreground">
                 Manage your site data. Resetting will use the new Supabase-compatible seeder.
               </p>
               
               <BackupTools />

               <div className="my-6 border-t border-border"></div>

               <div className="p-5 bg-orange-50/50 border border-orange-100 rounded-xl space-y-4">
                 <div className="flex items-start gap-4">
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg mt-1">
                      <Database size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-900">Reset & Seed (Supabase)</h4>
                      <p className="text-sm text-orange-800/80 mt-1 mb-3">
                         This will <strong>delete all records in your Postgres tables</strong> and re-seed from sample data.
                         <br/> Assets will be uploaded to Supabase Storage.
                      </p>
                      <button 
                        onClick={handleSeed} 
                        disabled={loading} 
                        className="px-5 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors shadow-sm disabled:opacity-50"
                      >
                         {loading ? <Loader2 className="animate-spin inline mr-2" size={14} /> : null}
                         {loading ? 'Processing...' : 'Reset Supabase to Seed Data'}
                      </button>
                    </div>
                 </div>
               </div>
             </div>
          </div>
        )}
        

        {/* NAVIGATION TAB */}
        {activeTab === 'navigation' && (
           <div className="bg-background border border-border rounded-2xl p-4 md:p-8 space-y-6">
               <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                     <LayoutTemplate size={24} />
                   </div>
                   <div>
                     <h3 className="font-medium text-lg">UI Controls</h3>
                     <p className="text-sm text-muted-foreground">Global visibility toggles.</p>
                   </div>
               </div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 border border-border rounded-xl bg-card gap-4 md:gap-0">
                  <div>
                    <div className="font-medium text-lg">Desktop Menu Visibility</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Toggle main navigation in the header.
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        await themeContext.updateSettings({ showDesktopMenu: !themeContext.showDesktopMenu });
                        await revalidateData('settings');
                        setMessage('Menu visibility updated!');
                        setTimeout(() => setMessage(''), 3000);
                      } catch (e) {
                        setMessage('Failed to update: ' + e.message);
                      }
                    }}
                    className={clsx(
                      "relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                      themeContext.showDesktopMenu ? "bg-primary" : "bg-zinc-200"
                    )}
                  >
                    <span
                      className={clsx(
                        "inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-sm",
                        themeContext.showDesktopMenu ? "translate-x-7" : "translate-x-1"
                      )}
                    />
                  </button>
               </div>
               
               <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 border border-border rounded-xl bg-card gap-4 md:gap-0">
                  <div>
                    <div className="font-medium text-lg">Price Visibility</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Toggle price display across public pages.
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        await themeContext.updateSettings({ showPrice: !themeContext.showPrice });
                        await revalidateData('settings');
                        setMessage('Price visibility updated!');
                        setTimeout(() => setMessage(''), 3000);
                      } catch (e) {
                        setMessage('Failed to update: ' + e.message);
                      }
                    }}
                    className={clsx(
                      "relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                      themeContext.showPrice ? "bg-primary" : "bg-zinc-200"
                    )}
                  >
                    <span
                      className={clsx(
                        "inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-sm",
                        themeContext.showPrice ? "translate-x-7" : "translate-x-1"
                      )}
                    />
                  </button>
               </div>
            </div>
        )}

        {message && (
          <div className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg animate-fade-in-up flex items-center gap-2 z-50">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
