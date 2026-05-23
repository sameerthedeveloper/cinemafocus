"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Loader2, 
  Save, 
  Upload, 
  Database, 
  LayoutTemplate, 
  Info, 
  Phone, 
  Shield, 
  Globe, 
  Plus, 
  Trash2, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Sparkles, 
  Eye, 
  Hammer, 
  AlertTriangle,
  Image as ImageIcon,
  Zap,
  HardDrive
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import BackupTools from '@/components/admin/BackupTools';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import clsx from 'clsx';
import { seedDatabase } from '@/lib/seeder';
import { revalidateData } from '@/lib/actions';

// Extract all valid icon names from the lucide-react package
const ALL_ICONS = Object.keys(LucideIcons)
  .filter(name => {
    // Only allow components starting with an uppercase letter and excluding helpers/internal types
    return /^[A-Z]/.test(name) && 
           name !== 'createLucideIcon' && 
           name !== 'LucideIcon' && 
           name !== 'Icon' && 
           name !== 'HelpCircle' &&
           (typeof LucideIcons[name] === 'function' || typeof LucideIcons[name] === 'object');
  })
  .sort();

// Let's create a curated/popular list of icons to show when search is empty
const POPULAR_ICONS = [
  'ShieldCheck', 'Award', 'Trophy', 'Crown', 'Headphones', 'Clock', 'Truck', 
  'Package', 'RotateCcw', 'Heart', 'Star', 'ThumbsUp', 'Sparkles', 'Gem', 
  'Globe', 'Activity', 'Zap', 'Shield', 'Mail', 'Phone', 'MapPin', 'Search', 
  'Settings', 'Sliders', 'HelpCircle'
];

function IconSelector({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  // If search is empty, show POPULAR_ICONS. Otherwise, filter all 1,400+ icon names.
  const filteredIconNames = search === ''
    ? POPULAR_ICONS
    : ALL_ICONS.filter(name => name.toLowerCase().includes(search.toLowerCase()));

  // Limit rendering to first 50 results for stellar UX performance
  const displayedIconNames = filteredIconNames.slice(0, 50);

  const SelectedIcon = LucideIcons[value] || LucideIcons.HelpCircle;
  
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2.5 bg-background rounded-lg border border-border text-sm outline-none focus:border-primary text-left cursor-pointer hover:bg-secondary/10 transition-all shadow-sm"
      >
        <div className="flex items-center gap-2.5">
          <SelectedIcon size={16} className="text-primary" />
          <span className="font-medium text-foreground">{value || 'Select Icon'}</span>
        </div>
        <span className="text-muted-foreground text-[10px] uppercase font-semibold">change ▾</span>
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => {
              setIsOpen(false);
              setSearch('');
            }}
          />
          <div className="absolute left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-xl z-50 p-2 space-y-2 max-h-64 flex flex-col">
            <input
              type="text"
              placeholder="Search all 1,400+ icons..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full p-2 bg-background rounded-lg border border-border text-xs outline-none focus:border-primary text-foreground"
              autoFocus
            />
            <div className="overflow-y-auto flex-grow space-y-0.5 pr-1">
              {displayedIconNames.map(name => {
                const IconComp = LucideIcons[name] || LucideIcons.HelpCircle;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      onChange(name);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg text-xs hover:bg-primary/10 transition-colors text-left ${
                      value === name ? 'bg-primary/5 text-primary' : 'text-foreground'
                    }`}
                  >
                    <IconComp size={16} className={value === name ? 'text-primary' : 'text-muted-foreground'} />
                    <div className="flex-grow">
                      <div className="font-medium">{name}</div>
                      {search === '' && (
                        <div className="text-[9px] text-muted-foreground font-light">Popular Selection</div>
                      )}
                    </div>
                  </button>
                );
              })}
              {filteredIconNames.length === 0 && (
                <div className="text-[11px] text-muted-foreground text-center py-4 italic">
                  No icons found for "{search}"
                </div>
              )}
              {filteredIconNames.length > 50 && (
                <div className="text-[9px] text-muted-foreground text-center py-1.5 border-t border-border/40 font-light mt-1">
                  Showing top 50 of {filteredIconNames.length} results. Refine search to see more.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminSiteControlPage() {
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const themeContext = useSiteSettings();
  const supabase = createClient();
  
  // States
  const [hero, setHero] = useState({ slides: [] });
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [philosophy, setPhilosophy] = useState({
    title: '',
    intro: '',
    philosophyTitle: '',
    philosophyText1: '',
    philosophyText2: '',
    philosophyImage: '',
    experienceTitle: '',
    experienceText: '',
    experienceImage: '',
    experienceBullets: []
  });
  const [footer, setFooter] = useState({ address: '', phones: [], email: '', facebook: '', instagram: '', twitter: '', workingHours: '' });
  const [trustBadges, setTrustBadges] = useState([]);
  const [maintenance, setMaintenance] = useState({
    enabled: false,
    title: 'Refining the Sound.',
    message: 'We are currently upgrading our digital studio to bring you an even more refined acoustic experience. Please check back shortly.',
    activeInDev: false
  });

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
      else if (activeTab === 'maintenance') settingId = 'maintenance';
      
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
        if (activeTab === 'hero') {
          if (val.slides && Array.isArray(val.slides)) {
            setHero(val);
          } else {
            // Normalise legacy single hero object to slides format
            setHero({
              slides: [{
                title: val.title || '',
                subtitle: val.subtitle || '',
                ctaText: val.ctaText || '',
                ctaLink: val.ctaLink || '',
                imageUrl: val.imageUrl || '',
                layout: val.layout || 'full-bg',
                textAlignment: val.textAlignment || 'center',
                verticalAlignment: val.verticalAlignment || 'center',
                imageOpacity: val.imageOpacity !== undefined ? val.imageOpacity : 60,
                imageBlur: val.imageBlur !== undefined ? val.imageBlur : 0,
                imageBrightness: val.imageBrightness !== undefined ? val.imageBrightness : 100,
                imagePosition: val.imagePosition || 'center',
                overlayColor: val.overlayColor || 'black',
                overlayColorCustom: val.overlayColorCustom || '#000000',
                overlayOpacity: val.overlayOpacity !== undefined ? val.overlayOpacity : 40,
                ctaVariant: val.ctaVariant || 'primary',
                ctaSize: val.ctaSize || 'lg',
                ctaShape: val.ctaShape || 'rounded-full',
                duration: val.duration !== undefined ? val.duration : 6
              }]
            });
          }
          setActiveSlideIndex(0);
        }
        else if (activeTab === 'philosophy') {
          setPhilosophy(prev => ({
            title: val.title || 'About Cinema Focus',
            intro: val.intro || 'We are more than just a retailer — we are a destination for those who seek to experience music and film exactly as the artist intended. Visit our showroom in Chennai, India.',
            philosophyTitle: val.philosophyTitle || 'Our Philosophy',
            philosophyText1: val.philosophyText1 || 'At Cinema Focus, we believe that high-fidelity sound is a gateway to emotion. Whether it\'s the subtle breath of a vocalist or the thunderous roar of a cinematic explosion, every detail matters. Our curated selection represents the pinnacle of audio engineering.',
            philosophyText2: val.philosophyText2 || 'Founded in 2010, we have spent over a decade perfecting the art of system matching—pairing speakers, amplifiers, and sources that synergize to create magic.',
            philosophyImage: val.philosophyImage || '/images/hero-light.webp',
            experienceTitle: val.experienceTitle || 'The Experience',
            experienceText: val.experienceText || 'Our showroom is designed as a sanctuary for the senses. We invite you to bring your favorite music and get lost in the sound. Our expert consultants are here not to sell, but to guide you on your journey to sonic nirvana.',
            experienceImage: val.experienceImage || '/images/speakers.webp',
            experienceBullets: val.experienceBullets || [
              'Private Listening Rooms',
              'Expert Calibration Services',
              'Home Installation & Support'
            ],
            ...val
          }));
        }
        else if (activeTab === 'footer') setFooter(prev => ({...prev, ...val}));
        else if (activeTab === 'trust') setTrustBadges(val.items || []);
        else if (activeTab === 'maintenance') setMaintenance(prev => ({...prev, ...val}));
      } else {
        // Fallback for missing trust badges
        if (activeTab === 'trust') {
            setTrustBadges([
             { icon: 'Globe', title: 'Global Shipping', description: 'Insured delivery worldwide' },
             { icon: 'ShieldCheck', title: '5-Year Warranty', description: 'On all premium components' },
             { icon: 'Headphones', title: 'Expert Support', description: 'Consult with audiophiles' },
             { icon: 'Award', title: 'Authorized Dealer', description: '100% Genuine Products' }
           ]);
        } else if (activeTab === 'maintenance') {
            setMaintenance({
              enabled: false,
              title: 'Refining the Sound.',
              message: 'We are currently upgrading our digital studio to bring you an even more refined acoustic experience. Please check back shortly.',
              activeInDev: false
            });
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

  const addHeroSlide = () => {
    const newSlide = {
      title: 'New Audio Experience',
      subtitle: 'Discover premium details and visual perfection.',
      ctaText: 'Explore More',
      ctaLink: '/products',
      imageUrl: '',
      layout: 'full-bg',
      textAlignment: 'center',
      verticalAlignment: 'center',
      imageOpacity: 60,
      imageBlur: 0,
      imageBrightness: 100,
      imagePosition: 'center',
      overlayColor: 'black',
      overlayColorCustom: '#000000',
      overlayOpacity: 40,
      ctaVariant: 'primary',
      ctaSize: 'lg',
      ctaShape: 'rounded-full',
      duration: 6
    };
    setHero(prev => {
      const slides = [...(prev.slides || [])];
      slides.push(newSlide);
      setActiveSlideIndex(slides.length - 1);
      return { ...prev, slides };
    });
    setMessage("New slide added! Don't forget to save changes.");
  };

  const deleteHeroSlide = (indexToDelete) => {
    setHero(prev => {
      const slides = (prev.slides || []).filter((_, idx) => idx !== indexToDelete);
      const newActiveIndex = activeSlideIndex >= slides.length ? Math.max(0, slides.length - 1) : activeSlideIndex;
      setActiveSlideIndex(newActiveIndex);
      return { ...prev, slides };
    });
    setMessage("Slide deleted! Don't forget to save changes.");
  };

  const moveHeroSlide = (index, direction) => {
    setHero(prev => {
      const slides = [...(prev.slides || [])];
      const targetIndex = direction === 'left' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= slides.length) return prev;
      
      const temp = slides[index];
      slides[index] = slides[targetIndex];
      slides[targetIndex] = temp;
      
      setActiveSlideIndex(targetIndex);
      return { ...prev, slides };
    });
  };

  const updateCurrentSlide = (updatedFields) => {
    setHero(prev => {
      const slides = [...(prev.slides || [])];
      if (slides.length === 0) {
        slides.push({
          title: '', subtitle: '', ctaText: '', ctaLink: '', imageUrl: '',
          layout: 'full-bg', textAlignment: 'center', verticalAlignment: 'center',
          imageOpacity: 60, imageBlur: 0, imageBrightness: 100, imagePosition: 'center',
          overlayColor: 'black', overlayColorCustom: '#000000', overlayOpacity: 40,
          ctaVariant: 'primary', ctaSize: 'lg', ctaShape: 'rounded-full'
        });
      }
      slides[activeSlideIndex] = { ...slides[activeSlideIndex], ...updatedFields };
      return { ...prev, slides };
    });
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

      setHero(prev => {
        const slides = [...(prev.slides || [])];
        if (slides[activeSlideIndex]) {
          slides[activeSlideIndex] = { ...slides[activeSlideIndex], imageUrl: publicUrl };
        } else {
          slides[activeSlideIndex] = { imageUrl: publicUrl };
        }
        return { ...prev, slides };
      });
      setMessage("Image uploaded! Don't forget to save.");
      
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage("Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  const handleAboutImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `about/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      setPhilosophy(prev => ({
        ...prev,
        [field]: publicUrl
      }));
      setMessage("Image uploaded! Don't forget to save changes.");
      
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage("Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  const handleBulletChange = (index, value) => {
    setPhilosophy(prev => {
      const bullets = [...(prev.experienceBullets || [])];
      bullets[index] = value;
      return { ...prev, experienceBullets: bullets };
    });
  };

  const addBullet = () => {
    setPhilosophy(prev => {
      const bullets = [...(prev.experienceBullets || [])];
      bullets.push('');
      return { ...prev, experienceBullets: bullets };
    });
  };

  const removeBullet = (index) => {
    setPhilosophy(prev => {
      const bullets = (prev.experienceBullets || []).filter((_, idx) => idx !== index);
      return { ...prev, experienceBullets: bullets };
    });
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
    { id: 'images', label: 'Image Optimization', icon: ImageIcon },
    { id: 'philosophy', label: 'About/Philosophy', icon: Info },
    { id: 'trust', label: 'Trust Badges', icon: Shield },
    { id: 'footer', label: 'Footer & Contact', icon: Phone },
    { id: 'maintenance', label: 'Maintenance Mode', icon: Hammer },
    { id: 'database', label: 'Database Ops', icon: Database },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-fade-in pb-20 md:pb-8">
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
        {activeTab === 'hero' && (() => {
          const currentSlide = (hero.slides && hero.slides[activeSlideIndex]) || {
            title: '',
            subtitle: '',
            ctaText: '',
            ctaLink: '',
            imageUrl: '',
            layout: 'full-bg',
            textAlignment: 'center',
            verticalAlignment: 'center',
            imageOpacity: 60,
            imageBlur: 0,
            imageBrightness: 100,
            imagePosition: 'center',
            overlayColor: 'black',
            overlayColorCustom: '#000000',
            overlayOpacity: 40,
            ctaVariant: 'primary',
            ctaSize: 'lg',
            ctaShape: 'rounded-full',
            duration: 6
          };

          return (
            <div className="bg-background border border-border rounded-2xl p-4 md:p-8 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                 
                {/* Visual Editor Form (3/5 Columns) */}
                <div className="lg:col-span-3 space-y-6">
                   
                   {/* Slide Navigator Ribbon */}
                   <div className="bg-secondary/15 p-4 rounded-xl border border-border space-y-3">
                     <div className="flex justify-between items-center">
                       <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                         <LayoutTemplate size={12} className="text-primary" />
                         Hero Slide Manager
                       </span>
                       <button 
                         type="button" 
                         onClick={addHeroSlide} 
                         className="flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-md hover:bg-primary/25 transition-all cursor-pointer"
                       >
                         <Plus size={12} /> Add Hero Slide
                       </button>
                     </div>
                     
                     <div className="flex flex-wrap gap-2 items-center">
                       {(hero.slides || []).map((slide, idx) => (
                         <div 
                           key={`slide-tab-${idx}`} 
                           className={clsx(
                             "flex items-center gap-2 p-1.5 px-3 rounded-lg border text-xs font-semibold transition-all shadow-sm",
                             idx === activeSlideIndex 
                               ? "bg-primary text-primary-foreground border-primary" 
                               : "bg-background border-border text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                           )}
                         >
                           <button 
                             type="button" 
                             onClick={() => setActiveSlideIndex(idx)}
                             className="cursor-pointer font-bold bg-transparent border-none text-current p-0 outline-none"
                           >
                             Slide {idx + 1}
                           </button>
                           
                           {/* Reordering */}
                           <div className="flex gap-0.5 ml-1 border-l border-current/25 pl-1.5">
                             <button 
                               type="button" 
                               disabled={idx === 0} 
                               onClick={() => moveHeroSlide(idx, 'left')} 
                               className="hover:bg-black/10 dark:hover:bg-white/10 px-1 py-0.5 rounded disabled:opacity-20 cursor-pointer text-[10px]"
                               title="Move Left"
                             >
                               ←
                             </button>
                             <button 
                               type="button" 
                               disabled={idx === (hero.slides || []).length - 1} 
                               onClick={() => moveHeroSlide(idx, 'right')} 
                               className="hover:bg-black/10 dark:hover:bg-white/10 px-1 py-0.5 rounded disabled:opacity-20 cursor-pointer text-[10px]"
                               title="Move Right"
                             >
                               →
                             </button>
                           </div>

                           {/* Delete */}
                           {(hero.slides || []).length > 1 && (
                             <button 
                               type="button" 
                               onClick={() => deleteHeroSlide(idx)}
                               className="text-destructive hover:bg-destructive/10 p-0.5 rounded transition-colors cursor-pointer ml-0.5"
                               title="Delete slide"
                             >
                               <Trash2 size={11} />
                             </button>
                           )}
                         </div>
                       ))}
                     </div>
                   </div>

                   <div className="border-b border-border pb-4 mb-2 flex items-center justify-between">
                     <div>
                       <h3 className="font-semibold text-lg flex items-center gap-2 text-foreground">
                         <Sparkles className="text-primary" size={18} />
                         Slide {activeSlideIndex + 1} Visual Designer
                       </h3>
                       <p className="text-xs text-muted-foreground mt-0.5">Customize layouts, alignment, and background filter styles for this slide.</p>
                     </div>
                   </div>

                   {/* Title & Subtitle */}
                   <div className="space-y-2">
                     <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Main Hero Title</label>
                     <input value={currentSlide.title || ''} onChange={e => updateCurrentSlide({ title: e.target.value })} className="w-full p-3 bg-secondary/30 rounded-lg border border-border outline-none focus:border-primary text-sm transition-all" placeholder="e.g. The Future of Sound" />
                      
                      <div className="flex gap-4 items-center mt-2">
                        <div className="flex-grow space-y-1">
                          <div className="flex justify-between">
                            <label className="text-[10px] font-medium text-muted-foreground uppercase">Title Font Size</label>
                            <span className="text-[10px] text-primary font-bold">{currentSlide.titleSize !== undefined ? currentSlide.titleSize : 60}px</span>
                          </div>
                          <input 
                            type="range" 
                            min="24" 
                            max="120" 
                            value={currentSlide.titleSize !== undefined ? currentSlide.titleSize : 60} 
                            onChange={e => updateCurrentSlide({ titleSize: parseInt(e.target.value) })}
                            className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary" 
                          />
                        </div>
                      </div>
                   </div>

                   <div className="space-y-2">
                     <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subtitle</label>
                     <textarea value={currentSlide.subtitle || ''} onChange={e => updateCurrentSlide({ subtitle: e.target.value })} rows={2} className="w-full p-3 bg-secondary/30 rounded-lg border border-border outline-none focus:border-primary text-sm transition-all resize-none" placeholder="e.g. Experience audio perfection..." />
                      
                      <div className="flex gap-4 items-center mt-2">
                        <div className="flex-grow space-y-1">
                          <div className="flex justify-between">
                            <label className="text-[10px] font-medium text-muted-foreground uppercase">Subtitle Font Size</label>
                            <span className="text-[10px] text-primary font-bold">{currentSlide.subtitleSize !== undefined ? currentSlide.subtitleSize : 20}px</span>
                          </div>
                          <input 
                            type="range" 
                            min="12" 
                            max="48" 
                            value={currentSlide.subtitleSize !== undefined ? currentSlide.subtitleSize : 20} 
                            onChange={e => updateCurrentSlide({ subtitleSize: parseInt(e.target.value) })}
                            className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary" 
                          />
                        </div>
                      </div>
                   </div>

                   {/* Layout Mode */}
                   <div className="space-y-2">
                     <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hero Layout Mode</label>
                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                       {[
                         { id: 'full-bg', label: 'Full Screen Bg' },
                         { id: 'split-left', label: 'Split Left' },
                         { id: 'split-right', label: 'Split Right' },
                         { id: 'minimal', label: 'Minimal Glow' }
                       ].map(lay => (
                         <button
                           key={lay.id}
                           type="button"
                           onClick={() => updateCurrentSlide({ layout: lay.id })}
                           className={clsx(
                             "p-2.5 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer",
                             currentSlide.layout === lay.id 
                               ? "bg-primary/10 border-primary text-primary" 
                               : "bg-secondary/20 border-border text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                           )}
                         >
                           {lay.label}
                         </button>
                       ))}
                     </div>
                   </div>

                   {/* Autoplay Duration Option */}
                   <div className="bg-secondary/15 p-4 rounded-xl border border-border space-y-3">
                     <div className="flex justify-between items-center">
                       <div className="space-y-0.5">
                         <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Slide Autoplay Timeout</label>
                         <p className="text-[10px] text-muted-foreground">Autoplay display time for this slide in seconds.</p>
                       </div>
                       <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-bold">
                         {currentSlide.duration || 6}s
                       </span>
                     </div>
                     <input 
                       type="range" 
                       min={2} 
                       max={20} 
                       step={1}
                       value={currentSlide.duration || 6} 
                       onChange={e => updateCurrentSlide({ duration: parseInt(e.target.value) })} 
                       className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary" 
                     />
                   </div>

                   {/* Alignment Options */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Text Horizontal Align</label>
                       <div className="flex gap-1 bg-secondary/20 p-1 rounded-lg border border-border w-fit">
                         {[
                           { id: 'left', icon: AlignLeft },
                           { id: 'center', icon: AlignCenter },
                           { id: 'right', icon: AlignRight }
                         ].map(align => (
                           <button
                             key={align.id}
                             type="button"
                             onClick={() => updateCurrentSlide({ textAlignment: align.id })}
                             className={clsx(
                               "p-2 rounded-md transition-all cursor-pointer",
                               currentSlide.textAlignment === align.id
                                 ? "bg-primary text-primary-foreground shadow-sm"
                                 : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                             )}
                           >
                             <align.icon size={16} />
                           </button>
                         ))}
                       </div>
                     </div>

                     {currentSlide.layout === 'full-bg' && (
                       <div className="space-y-2">
                         <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Text Vertical Align</label>
                         <div className="flex gap-1 bg-secondary/20 p-1 rounded-lg border border-border w-fit text-xs font-semibold">
                           {[
                             { id: 'top', label: 'Top' },
                             { id: 'center', label: 'Center' },
                             { id: 'bottom', label: 'Bottom' }
                           ].map(vAlign => (
                             <button
                               key={vAlign.id}
                               type="button"
                               onClick={() => updateCurrentSlide({ verticalAlignment: vAlign.id })}
                               className={clsx(
                                 "px-3 py-1.5 rounded-md transition-all cursor-pointer",
                                 currentSlide.verticalAlignment === vAlign.id
                                   ? "bg-primary text-primary-foreground shadow-sm"
                                   : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                               )}
                             >
                               {vAlign.label}
                             </button>
                           ))}
                         </div>
                       </div>
                     )}
                   </div>

                   {/* CTA Customization */}
                   <div className="border-t border-border pt-4 mt-2">
                     <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">CTA Button Customizer</h4>
                     <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <label className="text-[11px] font-medium text-muted-foreground">Button Text</label>
                         <input value={currentSlide.ctaText || ''} onChange={e => updateCurrentSlide({ ctaText: e.target.value })} className="w-full p-2.5 bg-secondary/30 rounded-lg border border-border outline-none focus:border-primary text-sm" placeholder="Discover Products" />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[11px] font-medium text-muted-foreground">Button Link</label>
                         <input value={currentSlide.ctaLink || ''} onChange={e => updateCurrentSlide({ ctaLink: e.target.value })} className="w-full p-2.5 bg-secondary/30 rounded-lg border border-border outline-none focus:border-primary text-sm" placeholder="/products" />
                       </div>
                     </div>
                     
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                       <div className="space-y-2">
                         <label className="text-[11px] font-medium text-muted-foreground">CTA Variant</label>
                         <select value={currentSlide.ctaVariant || 'primary'} onChange={e => updateCurrentSlide({ ctaVariant: e.target.value })} className="w-full p-2.5 bg-secondary/30 rounded-lg border border-border outline-none text-sm text-foreground focus:border-primary cursor-pointer">
                           <option value="primary">Primary (White)</option>
                           <option value="secondary">Secondary (Dark)</option>
                           <option value="outline">Outline</option>
                           <option value="gradient">Indigo Gradient</option>
                           <option value="link">Text Link</option>
                         </select>
                       </div>
                       <div className="space-y-2">
                         <label className="text-[11px] font-medium text-muted-foreground">Button Shape</label>
                         <select value={currentSlide.ctaShape || 'rounded-full'} onChange={e => updateCurrentSlide({ ctaShape: e.target.value })} className="w-full p-2.5 bg-secondary/30 rounded-lg border border-border outline-none text-sm text-foreground focus:border-primary cursor-pointer">
                           <option value="rounded-none">Square</option>
                           <option value="rounded-lg">Rounded Soft</option>
                           <option value="rounded-full">Pill / Capsule</option>
                         </select>
                       </div>
                       <div className="space-y-2">
                         <label className="text-[11px] font-medium text-muted-foreground">Button Size</label>
                         <select value={currentSlide.ctaSize || 'lg'} onChange={e => updateCurrentSlide({ ctaSize: e.target.value })} className="w-full p-2.5 bg-secondary/30 rounded-lg border border-border outline-none text-sm text-foreground focus:border-primary cursor-pointer">
                           <option value="sm">Small</option>
                           <option value="md">Medium</option>
                           <option value="lg">Large</option>
                         </select>
                       </div>
                     </div>
                   </div>

                   {/* Image & Filters Configuration */}
                   {currentSlide.layout !== 'minimal' && (
                     <div className="border-t border-border pt-4 mt-2 space-y-4">
                       <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Image Filters & Position</h4>
                       
                       <div className="space-y-2">
                         <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Background Image</label>
                         <div className="flex gap-4 items-center">
                            <div className="w-20 h-12 bg-secondary rounded-lg overflow-hidden border border-border flex-shrink-0">
                              {currentSlide.imageUrl && <img src={currentSlide.imageUrl} className="w-full h-full object-cover" />}
                            </div>
                            <label className="cursor-pointer bg-secondary px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-secondary/70 flex items-center gap-1.5 border border-border transition-colors">
                              <Upload size={14} /> Change Asset
                              <input type="file" className="hidden" accept="image/*" onChange={handleHeroImageUpload} />
                            </label>
                            <div className="space-y-1 flex-grow">
                              <select value={currentSlide.imagePosition || 'center'} onChange={e => updateCurrentSlide({ imagePosition: e.target.value })} className="p-1.5 w-full bg-secondary/30 rounded border border-border text-xs text-foreground cursor-pointer">
                                <option value="center">Center Center</option>
                                <option value="top">Top Align</option>
                                <option value="bottom">Bottom Align</option>
                                <option value="left">Left Align</option>
                                <option value="right">Right Align</option>
                              </select>
                            </div>
                         </div>
                       </div>

                       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <label className="text-[11px] font-medium text-muted-foreground">Image Opacity</label>
                              <span className="text-[10px] text-primary font-bold">{currentSlide.imageOpacity !== undefined ? currentSlide.imageOpacity : 60}%</span>
                            </div>
                            <input 
                              type="range" 
                              min="10" 
                              max="100" 
                              value={currentSlide.imageOpacity !== undefined ? currentSlide.imageOpacity : 60} 
                              onChange={e => updateCurrentSlide({ imageOpacity: parseInt(e.target.value) })}
                              className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary" 
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <label className="text-[11px] font-medium text-muted-foreground">Image Blur</label>
                              <span className="text-[10px] text-primary font-bold">{currentSlide.imageBlur !== undefined ? currentSlide.imageBlur : 0}px</span>
                            </div>
                            <input 
                              type="range" 
                              min="0" 
                              max="20" 
                              value={currentSlide.imageBlur !== undefined ? currentSlide.imageBlur : 0} 
                              onChange={e => updateCurrentSlide({ imageBlur: parseInt(e.target.value) })}
                              className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary" 
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <label className="text-[11px] font-medium text-muted-foreground">Brightness</label>
                              <span className="text-[10px] text-primary font-bold">{currentSlide.imageBrightness !== undefined ? currentSlide.imageBrightness : 100}%</span>
                            </div>
                            <input 
                              type="range" 
                              min="20" 
                              max="100" 
                              value={currentSlide.imageBrightness !== undefined ? currentSlide.imageBrightness : 100} 
                              onChange={e => updateCurrentSlide({ imageBrightness: parseInt(e.target.value) })}
                              className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary" 
                            />
                          </div>
                       </div>

                       {/* Overlay contrast customizers */}
                       {currentSlide.layout === 'full-bg' && (
                         <div className="p-3 bg-secondary/10 border border-border rounded-xl space-y-3">
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div className="space-y-1.5">
                               <label className="text-[11px] font-medium text-muted-foreground">Contrast Overlay Color</label>
                               <select value={currentSlide.overlayColor || 'black'} onChange={e => updateCurrentSlide({ overlayColor: e.target.value })} className="w-full p-2 bg-background border border-border text-xs rounded outline-none cursor-pointer">
                                 <option value="black">Deep Black</option>
                                 <option value="slate">Slate Blue</option>
                                 <option value="indigo">Royal Indigo</option>
                                 <option value="rose">Burgundy Rose</option>
                                 <option value="custom">Custom Color (HEX)</option>
                               </select>
                             </div>
                             <div className="space-y-1">
                               <div className="flex justify-between">
                                 <label className="text-[11px] font-medium text-muted-foreground">Overlay Opacity</label>
                                 <span className="text-[10px] text-primary font-bold">{currentSlide.overlayOpacity !== undefined ? currentSlide.overlayOpacity : 40}%</span>
                               </div>
                               <input 
                                 type="range" 
                                 min="0" 
                                 max="90" 
                                 value={currentSlide.overlayOpacity !== undefined ? currentSlide.overlayOpacity : 40} 
                                 onChange={e => updateCurrentSlide({ overlayOpacity: parseInt(e.target.value) })}
                                 className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary" 
                               />
                             </div>
                           </div>
                           
                           {currentSlide.overlayColor === 'custom' && (
                             <div className="space-y-1.5">
                               <label className="text-[11px] font-medium text-muted-foreground">Overlay HEX Code</label>
                               <div className="flex gap-2 items-center">
                                 <input 
                                   type="color" 
                                   value={currentSlide.overlayColorCustom || '#000000'} 
                                   onChange={e => updateCurrentSlide({ overlayColorCustom: e.target.value })} 
                                   className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent"
                                 />
                                 <input 
                                   type="text" 
                                   value={currentSlide.overlayColorCustom || ''} 
                                   onChange={e => updateCurrentSlide({ overlayColorCustom: e.target.value })} 
                                   className="flex-grow p-1.5 bg-background border border-border text-xs rounded uppercase font-mono" 
                                   placeholder="#000000" 
                                 />
                               </div>
                             </div>
                           )}
                         </div>
                       )}
                     </div>
                   )}

                   <div className="pt-4 border-t border-border flex items-center gap-4">
                     <button onClick={() => saveSection("hero_main", hero)} disabled={loading} className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 flex items-center gap-2 font-medium transition-opacity disabled:opacity-50 cursor-pointer">
                       {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save Changes
                     </button>
                   </div>
                </div>

                {/* Real-time Interactive Preview (2/5 Columns) */}
                <div className="lg:col-span-2">
                   <div className="sticky top-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <Eye size={14} />
                          Live Preview
                        </h4>
                        <span className="text-[10px] text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold animate-pulse">
                          Real-time
                        </span>
                      </div>

                      {/* Interactive Visual Simulator Box */}
                      <div className="relative border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950 h-80 w-full flex flex-col justify-center shadow-xl">
                        
                        {currentSlide.layout === 'minimal' ? (
                          <div className="relative w-full h-full flex flex-col justify-center p-6 bg-zinc-950 overflow-hidden">
                            {/* Glow effects */}
                            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
                            <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
                            
                            <div className={clsx("relative z-10 flex flex-col space-y-3", 
                              currentSlide.textAlignment === 'left' ? 'items-start text-left' : currentSlide.textAlignment === 'right' ? 'items-end text-right' : 'items-center text-center'
                            )}>
                              <h3 className="text-lg md:text-xl font-bold tracking-tight text-white leading-tight" style={{ fontSize: currentSlide.titleSize ? `${Math.max(14, currentSlide.titleSize / 2.5)}px` : undefined }}>
                                {currentSlide.title || "Sound, unbound."}
                              </h3>
                              <p className="text-[10px] text-zinc-400 font-light max-w-xs leading-relaxed line-clamp-2" style={{ fontSize: currentSlide.subtitleSize ? `${Math.max(9, currentSlide.subtitleSize / 1.8)}px` : undefined }}>
                                {currentSlide.subtitle || "Experience music in its purest form..."}
                              </p>
                              <div className="pt-2">
                                <span className={clsx(
                                  "inline-block font-bold transition-all text-[9px] uppercase tracking-wide",
                                  currentSlide.ctaShape === 'rounded-none' ? 'rounded-none' : currentSlide.ctaShape === 'rounded-lg' ? 'rounded-lg' : 'rounded-full',
                                  currentSlide.ctaSize === 'sm' ? 'px-2.5 py-1' : currentSlide.ctaSize === 'lg' ? 'px-4.5 py-2' : 'px-3.5 py-1.5',
                                  currentSlide.ctaVariant === 'secondary' ? 'bg-zinc-900 text-white border border-zinc-800' :
                                  currentSlide.ctaVariant === 'outline' ? 'bg-transparent text-white border border-white' :
                                  currentSlide.ctaVariant === 'gradient' ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md' :
                                  currentSlide.ctaVariant === 'link' ? 'bg-transparent text-white underline p-0' :
                                  'bg-white text-black'
                                )}>
                                  {currentSlide.ctaText || "Discover Collection"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (currentSlide.layout === 'split-left' || currentSlide.layout === 'split-right') ? (
                          <div className="grid grid-cols-2 w-full h-full overflow-hidden">
                            {/* Text Panel */}
                            <div className={clsx(
                              "flex flex-col justify-center p-4 z-10 bg-zinc-950 border-zinc-900",
                              currentSlide.layout === 'split-right' ? 'order-2 border-l' : 'order-1 border-r'
                            )}>
                              <div className={clsx("flex flex-col space-y-2",
                                currentSlide.textAlignment === 'left' ? 'items-start text-left' : currentSlide.textAlignment === 'right' ? 'items-end text-right' : 'items-center text-center'
                              )}>
                                <h3 className="text-xs md:text-sm font-bold tracking-tight text-white leading-tight line-clamp-3" style={{ fontSize: currentSlide.titleSize ? `${Math.max(12, currentSlide.titleSize / 3)}px` : undefined }}>
                                  {currentSlide.title || "Sound, unbound."}
                                </h3>
                                <p className="text-[9px] text-zinc-400 font-light leading-relaxed line-clamp-2" style={{ fontSize: currentSlide.subtitleSize ? `${Math.max(8, currentSlide.subtitleSize / 2)}px` : undefined }}>
                                  {currentSlide.subtitle || "Experience music..."}
                                </p>
                                <div className="pt-1.5">
                                  <span className={clsx(
                                    "inline-block font-bold transition-all text-[8px] uppercase tracking-wider scale-95",
                                    currentSlide.ctaShape === 'rounded-none' ? 'rounded-none' : currentSlide.ctaShape === 'rounded-lg' ? 'rounded-lg' : 'rounded-full',
                                    currentSlide.ctaSize === 'sm' ? 'px-2 py-0.5' : currentSlide.ctaSize === 'lg' ? 'px-3.5 py-1.5' : 'px-2.5 py-1',
                                    currentSlide.ctaVariant === 'secondary' ? 'bg-zinc-900 text-white border border-zinc-800' :
                                    currentSlide.ctaVariant === 'outline' ? 'bg-transparent text-white border border-white' :
                                    currentSlide.ctaVariant === 'gradient' ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white' :
                                    currentSlide.ctaVariant === 'link' ? 'bg-transparent text-white underline p-0 hover:underline' :
                                    'bg-white text-black'
                                  )}>
                                    {currentSlide.ctaText || "Discover"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Image Panel */}
                            <div className={clsx("relative w-full h-full bg-zinc-900",
                              currentSlide.layout === 'split-right' ? 'order-1' : 'order-2'
                            )}>
                              {currentSlide.imageUrl ? (
                                <img 
                                  src={currentSlide.imageUrl} 
                                  alt="Preview" 
                                  className="w-full h-full object-cover transition-all duration-300"
                                  style={{
                                    objectPosition: currentSlide.imagePosition || 'center',
                                    filter: `brightness(${currentSlide.imageBrightness !== undefined ? currentSlide.imageBrightness : 100}%) blur(${currentSlide.imageBlur !== undefined ? Math.min(5, currentSlide.imageBlur / 4) : 0}px)`,
                                    opacity: (currentSlide.imageOpacity !== undefined ? currentSlide.imageOpacity : 100) / 100
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-500">
                                  No Image
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          // DEFAULT / FULL BACKGROUND
                          <div className="relative w-full h-full flex overflow-hidden">
                            {/* Background Image */}
                            <div className="absolute inset-0 z-0">
                              {currentSlide.imageUrl ? (
                                <img 
                                  src={currentSlide.imageUrl} 
                                  alt="Preview" 
                                  className="w-full h-full object-cover transition-all duration-300"
                                  style={{
                                    objectPosition: currentSlide.imagePosition || 'center',
                                    filter: `brightness(${currentSlide.imageBrightness !== undefined ? currentSlide.imageBrightness : 100}%) blur(${currentSlide.imageBlur !== undefined ? Math.min(5, currentSlide.imageBlur / 4) : 0}px)`,
                                    opacity: (currentSlide.imageOpacity !== undefined ? currentSlide.imageOpacity : 60) / 100
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full bg-zinc-900" />
                              )}
                              
                              {/* Custom Overlay */}
                              <div 
                                className="absolute inset-0"
                                style={{ 
                                  backgroundColor: currentSlide.overlayColor === 'slate' ? '#0f172a' : currentSlide.overlayColor === 'indigo' ? '#1e1b4b' : currentSlide.overlayColor === 'rose' ? '#4c0519' : currentSlide.overlayColor === 'custom' ? (currentSlide.overlayColorCustom || '#000000') : '#000000',
                                  opacity: (currentSlide.overlayOpacity !== undefined ? currentSlide.overlayOpacity : 40) / 100
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
                            </div>
                            
                            {/* Content overlay container */}
                            <div className={clsx("relative z-10 w-full h-full flex p-6",
                              currentSlide.verticalAlignment === 'top' ? 'items-start pt-8' : currentSlide.verticalAlignment === 'bottom' ? 'items-end pb-8' : 'items-center'
                            )}>
                              <div className={clsx("w-full flex flex-col space-y-3",
                                currentSlide.textAlignment === 'left' ? 'items-start text-left' : currentSlide.textAlignment === 'right' ? 'items-end text-right' : 'items-center text-center'
                              )}>
                                <h3 className="text-lg md:text-xl font-bold tracking-tight text-white leading-tight drop-shadow-md" style={{ fontSize: currentSlide.titleSize ? `${Math.max(14, currentSlide.titleSize / 2.5)}px` : undefined }}>
                                  {currentSlide.title || "Sound, unbound."}
                                </h3>
                                <p className="text-[10px] text-zinc-200 font-light max-w-xs leading-relaxed line-clamp-2 drop-shadow-sm" style={{ fontSize: currentSlide.subtitleSize ? `${Math.max(9, currentSlide.subtitleSize / 1.8)}px` : undefined }}>
                                  {currentSlide.subtitle || "Experience music in its purest form..."}
                                </p>
                                <div className="pt-2">
                                  <span className={clsx(
                                    "inline-block font-bold transition-all text-[9px] uppercase tracking-wide",
                                    currentSlide.ctaShape === 'rounded-none' ? 'rounded-none' : currentSlide.ctaShape === 'rounded-lg' ? 'rounded-lg' : 'rounded-full',
                                    currentSlide.ctaSize === 'sm' ? 'px-2.5 py-1' : currentSlide.ctaSize === 'lg' ? 'px-4.5 py-2' : 'px-3.5 py-1.5',
                                    currentSlide.ctaVariant === 'secondary' ? 'bg-zinc-900 text-white border border-zinc-800' :
                                    currentSlide.ctaVariant === 'outline' ? 'bg-transparent text-white border border-white' :
                                    currentSlide.ctaVariant === 'gradient' ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md' :
                                    currentSlide.ctaVariant === 'link' ? 'bg-transparent text-white underline p-0 hover:underline' :
                                    'bg-white text-black'
                                  )}>
                                    {currentSlide.ctaText || "Discover Collection"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-4 bg-secondary/10 border border-border rounded-xl text-[11px] text-muted-foreground flex gap-2">
                         <Info size={14} className="text-primary flex-shrink-0 mt-0.5" />
                         <div>
                            Dragging the sliders or selecting dropdowns immediately updates this miniature simulator. Make sure to click **Save Changes** below the designer to publish.
                         </div>
                      </div>
                   </div>
                </div>

              </div>
            </div>
          );
        })()}
         {/* PHILOSOPHY TAB */}
        {activeTab === 'philosophy' && (
          <div className="space-y-6">
            
            {/* Header & Intro Settings Card */}
            <div className="bg-background border border-border rounded-2xl p-4 md:p-8 space-y-6">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2 text-foreground">
                  <Globe className="text-primary" size={18} />
                  Page Header & Intro
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Customize the main hero title and description at the top of the About page.</p>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Header Title</label>
                  <input 
                    value={philosophy.title || ''} 
                    onChange={e => setPhilosophy({...philosophy, title: e.target.value})} 
                    className="w-full p-3 bg-secondary/30 rounded-lg border border-border outline-none focus:border-primary text-sm transition-all" 
                    placeholder="About Cinema Focus" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Intro Paragraph</label>
                  <textarea 
                    value={philosophy.intro || ''} 
                    onChange={e => setPhilosophy({...philosophy, intro: e.target.value})} 
                    rows={3} 
                    className="w-full p-3 bg-secondary/30 rounded-lg border border-border outline-none focus:border-primary text-sm transition-all resize-none" 
                    placeholder="Intro paragraph text..." 
                  />
                </div>
              </div>
            </div>

            {/* Philosophy Section Card */}
            <div className="bg-background border border-border rounded-2xl p-4 md:p-8 space-y-6">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2 text-foreground">
                  <Info className="text-primary" size={18} />
                  Philosophy Section
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Configure the first layout block with a title, two-paragraph text, and a focal image.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Section Title</label>
                  <input 
                    value={philosophy.philosophyTitle || ''} 
                    onChange={e => setPhilosophy({...philosophy, philosophyTitle: e.target.value})} 
                    className="w-full p-3 bg-secondary/30 rounded-lg border border-border outline-none focus:border-primary text-sm transition-all" 
                    placeholder="Our Philosophy" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Paragraph 1</label>
                    <textarea 
                      value={philosophy.philosophyText1 || ''} 
                      onChange={e => setPhilosophy({...philosophy, philosophyText1: e.target.value})} 
                      rows={5} 
                      className="w-full p-3 bg-secondary/30 rounded-lg border border-border outline-none focus:border-primary text-sm transition-all resize-none" 
                      placeholder="Primary philosophy body text..." 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Paragraph 2</label>
                    <textarea 
                      value={philosophy.philosophyText2 || ''} 
                      onChange={e => setPhilosophy({...philosophy, philosophyText2: e.target.value})} 
                      rows={5} 
                      className="w-full p-3 bg-secondary/30 rounded-lg border border-border outline-none focus:border-primary text-sm transition-all resize-none" 
                      placeholder="Secondary/supporting philosophy text..." 
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-border/60">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Philosophy Section Image</label>
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="w-32 h-20 bg-secondary rounded-lg overflow-hidden border border-border flex-shrink-0 relative shadow-sm">
                      {philosophy.philosophyImage ? (
                        <img src={philosophy.philosophyImage} className="w-full h-full object-cover" alt="Philosophy Preview" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">No Image</div>
                      )}
                    </div>
                    <div className="space-y-2 flex-grow w-full">
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={philosophy.philosophyImage || ''} 
                          onChange={e => setPhilosophy({...philosophy, philosophyImage: e.target.value})} 
                          className="flex-grow p-2 bg-secondary/20 border border-border text-xs rounded outline-none focus:border-primary text-sm" 
                          placeholder="/images/hero-light.webp" 
                        />
                        <label className="cursor-pointer bg-secondary px-3 py-2 rounded-lg text-xs font-medium hover:bg-secondary/70 flex items-center gap-1.5 border border-border transition-colors flex-shrink-0 select-none">
                          <Upload size={14} /> Upload
                          <input type="file" className="hidden" accept="image/*" onChange={e => handleAboutImageUpload(e, 'philosophyImage')} />
                        </label>
                      </div>
                      <p className="text-[10px] text-muted-foreground">Provide a public URL path or upload a new hi-res landscape asset.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Experience Section Card */}
            <div className="bg-background border border-border rounded-2xl p-4 md:p-8 space-y-6">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2 text-foreground">
                  <Sparkles className="text-primary" size={18} />
                  Experience & Services
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Customize the second layout block details, focal image, and checkmark features list.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Section Title</label>
                  <input 
                    value={philosophy.experienceTitle || ''} 
                    onChange={e => setPhilosophy({...philosophy, experienceTitle: e.target.value})} 
                    className="w-full p-3 bg-secondary/30 rounded-lg border border-border outline-none focus:border-primary text-sm transition-all" 
                    placeholder="The Experience" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Experience Paragraph</label>
                  <textarea 
                    value={philosophy.experienceText || ''} 
                    onChange={e => setPhilosophy({...philosophy, experienceText: e.target.value})} 
                    rows={3} 
                    className="w-full p-3 bg-secondary/30 rounded-lg border border-border outline-none focus:border-primary text-sm transition-all resize-none" 
                    placeholder="Describe the showroom listening experience..." 
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-border/60">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Experience Section Image</label>
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="w-32 h-20 bg-secondary rounded-lg overflow-hidden border border-border flex-shrink-0 relative shadow-sm">
                      {philosophy.experienceImage ? (
                        <img src={philosophy.experienceImage} className="w-full h-full object-cover" alt="Experience Preview" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">No Image</div>
                      )}
                    </div>
                    <div className="space-y-2 flex-grow w-full">
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={philosophy.experienceImage || ''} 
                          onChange={e => setPhilosophy({...philosophy, experienceImage: e.target.value})} 
                          className="flex-grow p-2 bg-secondary/20 border border-border text-xs rounded outline-none focus:border-primary text-sm" 
                          placeholder="/images/speakers.webp" 
                        />
                        <label className="cursor-pointer bg-secondary px-3 py-2 rounded-lg text-xs font-medium hover:bg-secondary/70 flex items-center gap-1.5 border border-border transition-colors flex-shrink-0 select-none">
                          <Upload size={14} /> Upload
                          <input type="file" className="hidden" accept="image/*" onChange={e => handleAboutImageUpload(e, 'experienceImage')} />
                        </label>
                      </div>
                      <p className="text-[10px] text-muted-foreground">Provide a public URL path or upload a new hi-res landscape asset.</p>
                    </div>
                  </div>
                </div>

                {/* Bullet Points checklist manager */}
                <div className="space-y-3 pt-4 border-t border-border/60">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Showroom Checkmark Features</label>
                    <button 
                      type="button" 
                      onClick={addBullet} 
                      className="flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-md hover:bg-primary/25 transition-all cursor-pointer select-none"
                    >
                      <Plus size={12} /> Add Feature Bullet
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {(philosophy.experienceBullets || []).map((bullet, index) => (
                      <div key={`bullet-${index}`} className="flex gap-2 items-center">
                        <span className="text-emerald-500 font-bold text-sm select-none">✓</span>
                        <input 
                          value={bullet || ''} 
                          onChange={e => handleBulletChange(index, e.target.value)} 
                          className="flex-grow p-2 bg-secondary/25 border border-border text-sm rounded-lg outline-none focus:border-primary" 
                          placeholder={`Feature ${index + 1} description`} 
                        />
                        <button 
                          type="button" 
                          onClick={() => removeBullet(index)}
                          className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors cursor-pointer border border-border/40 select-none"
                          title="Delete bullet"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    {(philosophy.experienceBullets || []).length === 0 && (
                      <p className="text-xs text-muted-foreground italic text-center py-2 bg-secondary/10 rounded-lg">No bullet items defined yet. Click Add to insert one.</p>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Global Actions */}
            <div className="flex items-center gap-4 pt-2">
              <button 
                onClick={() => saveSection("philosophy", philosophy)} 
                disabled={loading} 
                className="px-8 py-3 bg-primary text-primary-foreground rounded-full hover:opacity-90 flex items-center gap-2 font-medium transition-opacity disabled:opacity-50 shadow-md cursor-pointer text-sm select-none"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save About Section
              </button>
            </div>

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
                          <IconSelector value={badge.icon} onChange={val => handleTrustChange(idx, 'icon', val)} />
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
                          placeholder="e.g. Sales: +91 98410 35821, 044-28117722" 
                        />
                        <button onClick={() => {
                            const newPhones = footer.phones.filter((_, i) => i !== idx);
                            setFooter({...footer, phones: newPhones});
                        }} className="p-3 text-red-500 hover:bg-red-500/10 rounded-lg border border-transparent hover:border-red-500/20 transition-all">
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

        {/* IMAGES TAB */}
        {activeTab === 'images' && (
          <div className="bg-background border border-border rounded-2xl p-4 md:p-8 space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <ImageIcon size={24} />
              </div>
              <div>
                <h3 className="font-medium text-lg">Image Optimization Settings</h3>
                <p className="text-sm text-muted-foreground">Configure how the website loads and processes images to optimize performance and control hosting costs.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-4">
                  Optimization Pipeline Strategy
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={async () => {
                      try {
                        await themeContext.updateSettings({ imageOptimizationMode: 'upload' });
                        await revalidateData('settings');
                        setMessage('Optimization mode updated to Upload-Time!');
                        setTimeout(() => setMessage(''), 3000);
                      } catch (e) {
                        setMessage('Failed to update: ' + e.message);
                      }
                    }}
                    className={clsx(
                      "relative flex flex-col justify-between p-5 rounded-xl border-2 text-left transition-all h-full cursor-pointer",
                      themeContext.imageOptimizationMode === 'upload' || !themeContext.imageOptimizationMode
                        ? "border-primary bg-primary/5 ring-1 ring-primary" 
                        : "border-border hover:border-primary/30 hover:bg-secondary/50"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <HardDrive size={16} className="text-emerald-500" />
                      </div>
                      <div className="font-semibold text-foreground text-sm">Upload-Time</div>
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed mb-4">
                      Pre-optimized WebP served directly via CDN. Eliminates Vercel runtime computation costs. Recommended for production.
                    </div>
                    {(themeContext.imageOptimizationMode === 'upload' || !themeContext.imageOptimizationMode) && (
                      <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-primary" />
                    )}
                  </button>

                  <button
                    onClick={async () => {
                      try {
                        await themeContext.updateSettings({ imageOptimizationMode: 'hybrid' });
                        await revalidateData('settings');
                        setMessage('Optimization mode updated to Hybrid!');
                        setTimeout(() => setMessage(''), 3000);
                      } catch (e) {
                        setMessage('Failed to update: ' + e.message);
                      }
                    }}
                    className={clsx(
                      "relative flex flex-col justify-between p-5 rounded-xl border-2 text-left transition-all h-full cursor-pointer",
                      themeContext.imageOptimizationMode === 'hybrid' 
                        ? "border-primary bg-primary/5 ring-1 ring-primary" 
                        : "border-border hover:border-primary/30 hover:bg-secondary/50"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                        <Zap size={16} className="text-amber-500" />
                      </div>
                      <div className="font-semibold text-foreground text-sm">Hybrid Mode</div>
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed mb-4">
                      Optimizes LCP hero slides at runtime on Vercel while serving standard content pre-processed to balance speeds.
                    </div>
                    {themeContext.imageOptimizationMode === 'hybrid' && (
                      <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-primary" />
                    )}
                  </button>

                  <button
                    onClick={async () => {
                      try {
                        await themeContext.updateSettings({ imageOptimizationMode: 'runtime' });
                        await revalidateData('settings');
                        setMessage('Optimization mode updated to Runtime!');
                        setTimeout(() => setMessage(''), 3000);
                      } catch (e) {
                        setMessage('Failed to update: ' + e.message);
                      }
                    }}
                    className={clsx(
                      "relative flex flex-col justify-between p-5 rounded-xl border-2 text-left transition-all h-full cursor-pointer",
                      themeContext.imageOptimizationMode === 'runtime' 
                        ? "border-primary bg-primary/5 ring-1 ring-primary text-white" 
                        : "border-border hover:border-primary/30 hover:bg-secondary/50"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                        <AlertTriangle size={16} className="text-rose-500" />
                      </div>
                      <div className="font-semibold text-foreground text-sm">Runtime (Vercel)</div>
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed mb-4">
                      Standard Next.js Image optimization enabled everywhere on every request. Increases Vercel usage and costs.
                    </div>
                    {themeContext.imageOptimizationMode === 'runtime' && (
                      <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-primary" />
                    )}
                  </button>
                </div>
              </div>

              {/* Dynamic Alert Banner */}
              {(themeContext.imageOptimizationMode === 'runtime' || themeContext.imageOptimizationMode === 'hybrid') && (
                <div className="flex gap-4 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 animate-fade-in text-amber-500">
                  <AlertTriangle className="shrink-0 mt-0.5 animate-bounce-slow" size={20} />
                  <div className="text-sm">
                    <span className="font-semibold block mb-0.5">⚠️ Runtime Transformation Cost Warning</span>
                    {themeContext.imageOptimizationMode === 'runtime' 
                      ? "Every requested image will be processed dynamically on Vercel. This will rapidly increase monthly Vercel Image Transformation counts and may lead to additional hosting costs."
                      : "Hero & above-fold banners will be processed dynamically at runtime. This balances load times for critical sections but will use some monthly Vercel Image Optimization quotas."}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MAINTENANCE TAB */}
        {activeTab === 'maintenance' && (
          <div className="bg-background border border-border rounded-2xl p-4 md:p-8 space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-lg">
                <Hammer size={24} />
              </div>
              <div>
                <h3 className="font-medium text-lg">Maintenance Mode Settings</h3>
                <p className="text-sm text-muted-foreground">Control public-facing storefront access and offline screens.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 border border-border rounded-xl bg-card gap-4 md:gap-0 shadow-sm">
              <div>
                <div className="font-medium text-base">Enable Maintenance Mode</div>
                <div className="text-xs text-muted-foreground mt-1 max-w-md">
                  When enabled, public storefront pages (Home, Products, Brands) will display a premium offline screen. Admin dashboard remains fully accessible.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMaintenance(prev => ({ ...prev, enabled: !prev.enabled }))}
                className={clsx(
                  "relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0",
                  maintenance.enabled ? "bg-amber-500" : "bg-zinc-200"
                )}
              >
                <span
                  className={clsx(
                    "inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-sm",
                    maintenance.enabled ? "translate-x-7" : "translate-x-1"
                  )}
                />
              </button>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 border border-border rounded-xl bg-card gap-4 md:gap-0 shadow-sm">
              <div>
                <div className="font-medium text-base">Apply to Local Development too</div>
                <div className="text-xs text-muted-foreground mt-1 max-w-md">
                  If disabled, maintenance mode will only apply to the deployed production version (e.g. Vercel/Netlify). Keep off to debug normally.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMaintenance(prev => ({ ...prev, activeInDev: !prev.activeInDev }))}
                className={clsx(
                  "relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex-shrink-0",
                  maintenance.activeInDev ? "bg-primary" : "bg-zinc-200"
                )}
              >
                <span
                  className={clsx(
                    "inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-sm",
                    maintenance.activeInDev ? "translate-x-7" : "translate-x-1"
                  )}
                />
              </button>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Maintenance Screen Heading</label>
                <input 
                  type="text" 
                  value={maintenance.title || ''} 
                  onChange={e => setMaintenance(prev => ({ ...prev, title: e.target.value }))} 
                  className="w-full p-3 bg-secondary/30 rounded-lg border border-border outline-none focus:border-primary text-sm transition-all" 
                  placeholder="e.g. Refining the Sound." 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Splash Message Description</label>
                <textarea 
                  value={maintenance.message || ''} 
                  onChange={e => setMaintenance(prev => ({ ...prev, message: e.target.value }))} 
                  rows={3} 
                  className="w-full p-3 bg-secondary/30 rounded-lg border border-border outline-none focus:border-primary text-sm transition-all resize-none" 
                  placeholder="Explain why the site is down and when it will return..." 
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center gap-4">
              <button 
                type="button" 
                onClick={() => saveSection("maintenance", maintenance)} 
                disabled={loading} 
                className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 flex items-center gap-2 font-medium transition-opacity disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save Maintenance Settings
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
