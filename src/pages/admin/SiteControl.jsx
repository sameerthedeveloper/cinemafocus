import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { supabase, storageBucket } from '../../lib/supabase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Loader2, Save, Upload, Database, LayoutTemplate, Info, Phone, Shield, Globe, Plus, Trash2 } from 'lucide-react';
import { seedDatabase } from '../../lib/seeder';
import BackupTools from '../../components/admin/BackupTools';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import clsx from 'clsx';

const SiteControl = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const themeContext = useSiteSettings();
  
  // States
  const [hero, setHero] = useState({ title: '', imageUrl: '' });
  const [philosophy, setPhilosophy] = useState({ title: '', text: '' });
  const [footer, setFooter] = useState({ address: '', phone: '', email: '', facebook: '', instagram: '', twitter: '' });
  const [trustBadges, setTrustBadges] = useState([]);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let docRef = null;
      if (activeTab === 'hero') docRef = doc(db, 'hero', 'main');
      else if (activeTab === 'philosophy') docRef = doc(db, 'site_content', 'philosophy');
      else if (activeTab === 'footer') docRef = doc(db, 'site_content', 'footer');
      else if (activeTab === 'trust') docRef = doc(db, 'site_content', 'trust_badges');
      
      if (!docRef) {
        setLoading(false);
        return;
      }

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (activeTab === 'hero') setHero(prev => ({...prev, ...data}));
        else if (activeTab === 'philosophy') setPhilosophy(prev => ({...prev, ...data}));
        else if (activeTab === 'footer') setFooter(prev => ({...prev, ...data}));
        else if (activeTab === 'trust') setTrustBadges(data.items || []);
      } else {
        // Defaults if empty
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

  const handleSave = async (sectionId, data) => {
    setLoading(true);
    try {
       // Determine collection based on id is tricky if we pass generic ID. 
       // We can infer or pass collection.
       // Based on fetchData:
       // 'hero_main' -> hero/main
       // 'philosophy' -> site_content/philosophy
       // 'footer' -> site_content/footer
       // 'trust_badges' -> site_content/trust_badges
       
       let collectionName = 'site_content';
       let docId = sectionId;

       if (sectionId === 'hero_main') {
           collectionName = 'hero';
           docId = 'main';
       }

       await setDoc(doc(db, collectionName, docId), data, { merge: true });
      
      setMessage('Saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (e) {
      console.error(e);
      setMessage('Error saving.');
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
      const bucketName = storageBucket;

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      setHero(prev => ({ ...prev, imageUrl: publicUrlData.publicUrl }));
      setMessage("Image uploaded! Don't forget to save.");
      
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage("Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  // Wrapper for handleSave
  const saveSection = (id, data) => handleSave(id, data);

  const handleTrustChange = (index, field, value) => {
    const newBadges = [...trustBadges];
    newBadges[index][field] = value;
    setTrustBadges(newBadges);
  };

  const handleSeed = async () => {
    if (window.confirm("This will overwrite existing products and categories with sample data. Continue?")) {
      setLoading(true);
      try {
        // Create a timeout promise that rejects after 60 seconds
        const timeout = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Request timed out. This might be due to slow network or firewall blocking connections.")), 60000);
        });

        // Race the seed operation against the timeout
        await Promise.race([seedDatabase(), timeout]);

        setMessage("Database seeded successfully!");
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error("Seeding Error:", error);
        
        let msg = `Error: ${error.message}`;
        if (error.message.includes("timed out")) {
             msg = "Error: Operation timed out. Check your internet connection or Firebase Console > Authorized Domains.";
        }
            
        setMessage(msg);
        alert(msg); 
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
    <div className="p-8 max-w-4xl mx-auto animate-fade-in pb-20">
      <header className="mb-10">
         <h1 className="text-3xl font-medium tracking-tight">Site Control</h1>
         <p className="text-muted-foreground mt-1">Customize global website content.</p>
      </header>
      
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-6 border-b border-border mb-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
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
          <div className="bg-background border border-border rounded-2xl p-8 space-y-6">
             <div className="space-y-2">
               <label className="text-sm font-medium">Main Halo Title</label>
               <input value={hero.title} onChange={e => setHero({...hero, title: e.target.value})} className="w-full p-3 bg-secondary/30 rounded-lg border border-border" placeholder="e.g. The Future of Sound" />
             </div>

             <div className="space-y-2">
               <label className="text-sm font-medium">Subtitle</label>
               <input value={hero.subtitle || ''} onChange={e => setHero({...hero, subtitle: e.target.value})} className="w-full p-3 bg-secondary/30 rounded-lg border border-border" placeholder="e.g. Experience audio perfection..." />
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-sm font-medium">CTA Button Text</label>
                   <input value={hero.ctaText || ''} onChange={e => setHero({...hero, ctaText: e.target.value})} className="w-full p-3 bg-secondary/30 rounded-lg border border-border" placeholder="e.g. Discover Products" />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-medium">CTA Button Link</label>
                   <input value={hero.ctaLink || ''} onChange={e => setHero({...hero, ctaLink: e.target.value})} className="w-full p-3 bg-secondary/30 rounded-lg border border-border" placeholder="e.g. /products" />
                </div>
             </div>
             
             <div className="space-y-2">
               <label className="text-sm font-medium">Hero Background Image</label>
               <div className="flex gap-4 items-start">
                  <div className="w-32 h-20 bg-secondary rounded-lg overflow-hidden border border-border">
                    {hero.imageUrl && <img src={hero.imageUrl} className="w-full h-full object-cover" />}
                  </div>
                  <label className="cursor-pointer bg-secondary px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/70 flex items-center gap-2">
                    <Upload size={16} /> Upload New
                    <input type="file" className="hidden" accept="image/*" onChange={handleHeroImageUpload} />
                  </label>
               </div>
             </div>

             <button onClick={() => saveSection("hero_main", hero)} disabled={loading} className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 flex items-center gap-2">
               {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save Changes
             </button>
          </div>
        )}

        {/* PHILOSOPHY TAB */}
        {activeTab === 'philosophy' && (
          <div className="bg-background border border-border rounded-2xl p-8 space-y-6">
             <p className="text-sm text-muted-foreground mb-4">Edit text for specific site sections.</p>
             
             <div className="space-y-2">
               <label className="text-sm font-medium">Section Title</label>
               <input value={philosophy.title} onChange={e => setPhilosophy({...philosophy, title: e.target.value})} className="w-full p-3 bg-secondary/30 rounded-lg border border-border" placeholder="Our Mission" />
             </div>
             <div className="space-y-2">
               <label className="text-sm font-medium">Content Text</label>
               <textarea value={philosophy.text} onChange={e => setPhilosophy({...philosophy, text: e.target.value})} rows={4} className="w-full p-3 bg-secondary/30 rounded-lg border border-border" placeholder="Text content..." />
             </div>

             <button onClick={() => saveSection("philosophy", philosophy)} disabled={loading} className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 flex items-center gap-2">
               {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save Section
             </button>
          </div>
        )}
        
        {/* TRUST BADGES TAB */}
        {activeTab === 'trust' && (
           <div className="bg-background border border-border rounded-2xl p-8 space-y-6">
              <div className="flex justify-between items-center mb-4">
                 <p className="text-sm text-muted-foreground">Edit the 4 key service highlights.</p>
                 <button onClick={() => saveSection("trust_badges", { items: trustBadges })} disabled={loading} className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 flex items-center gap-2">
                   {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save All
                 </button>
              </div>
              
              <div className="space-y-6">
                {trustBadges.map((badge, idx) => (
                  <div key={idx} className="p-4 bg-secondary/20 rounded-xl border border-border">
                     <h3 className="font-medium mb-3 text-sm uppercase tracking-wider text-muted-foreground">Badge {idx + 1}</h3>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-medium">Icon Name (Lucide)</label>
                          <input value={badge.icon} onChange={e => handleTrustChange(idx, 'icon', e.target.value)} className="w-full p-2 bg-background rounded border border-border text-sm" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium">Title</label>
                          <input value={badge.title} onChange={e => handleTrustChange(idx, 'title', e.target.value)} className="w-full p-2 bg-background rounded border border-border text-sm" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium">Description</label>
                          <input value={badge.description} onChange={e => handleTrustChange(idx, 'description', e.target.value)} className="w-full p-2 bg-background rounded border border-border text-sm" />
                        </div>
                     </div>
                  </div>
                ))}
              </div>
           </div>
        )}

        {/* FOOTER TAB */}
        {activeTab === 'footer' && (
          <div className="bg-background border border-border rounded-2xl p-8 space-y-6">
             <div className="space-y-2">
               <label className="text-sm font-medium">Showroom Address</label>
               <input value={footer.address} onChange={e => setFooter({...footer, address: e.target.value})} className="w-full p-3 bg-secondary/30 rounded-lg border border-border" placeholder="123 Audio Lane" />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-3">
                   <label className="text-sm font-medium">Phone Numbers</label>
                   {(footer.phones || [footer.phone]).map((phone, idx) => (
                     <div key={idx} className="flex gap-2">
                       <input 
                         value={phone} 
                         onChange={e => {
                           const newPhones = [...(footer.phones || [footer.phone])];
                           newPhones[idx] = e.target.value;
                           setFooter({...footer, phones: newPhones});
                         }}
                         className="w-full p-3 bg-secondary/30 rounded-lg border border-border" 
                         placeholder="+1 555 123 4567" 
                       />
                       {idx > 0 && (
                         <button onClick={() => {
                            const newPhones = (footer.phones || [footer.phone]).filter((_, i) => i !== idx);
                            setFooter({...footer, phones: newPhones});
                         }} className="p-3 text-red-500 hover:bg-red-50 rounded-lg">
                           <Trash2 size={18} />
                         </button>
                       )}
                     </div>
                   ))}
                   <button onClick={() => setFooter(prev => ({ ...prev, phones: [...(prev.phones || [prev.phone]), ''] }))} className="text-sm text-primary hover:underline flex items-center gap-1">
                     <Plus size={14} /> Add another number
                   </button>
                 </div>

                 <div className="space-y-2">
                   <label className="text-sm font-medium">Email Address</label>
                   <input value={footer.email} onChange={e => setFooter({...footer, email: e.target.value})} className="w-full p-3 bg-secondary/30 rounded-lg border border-border" placeholder="contact@example.com" />
                 </div>

                 <div className="space-y-2">
                   <label className="text-sm font-medium">Working Hours</label>
                   <textarea rows={3} value={footer.workingHours || ''} onChange={e => setFooter({...footer, workingHours: e.target.value})} className="w-full p-3 bg-secondary/30 rounded-lg border border-border" placeholder="Mon - Fri: 10am - 7pm&#10;Sat: 11am - 5pm" />
                 </div>
             </div>
             
             <div className="pt-6 border-t border-border">
                <h3 className="font-medium mb-4">Social Media Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="space-y-2">
                     <label className="text-sm font-medium">Facebook URL</label>
                     <input value={footer.facebook || ''} onChange={e => setFooter({...footer, facebook: e.target.value})} className="w-full p-3 bg-secondary/30 rounded-lg border border-border" placeholder="https://facebook.com/..." />
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-medium">Instagram URL</label>
                     <input value={footer.instagram || ''} onChange={e => setFooter({...footer, instagram: e.target.value})} className="w-full p-3 bg-secondary/30 rounded-lg border border-border" placeholder="https://instagram.com/..." />
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-medium">Twitter URL</label>
                     <input value={footer.twitter || ''} onChange={e => setFooter({...footer, twitter: e.target.value})} className="w-full p-3 bg-secondary/30 rounded-lg border border-border" placeholder="https://twitter.com/..." />
                   </div>
                </div>
             </div>

             <button onClick={() => saveSection("footer", footer)} disabled={loading} className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 flex items-center gap-2">
               {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Update Info
             </button>
          </div>
        )}

        {/* DATABASE TAB */}
        {activeTab === 'database' && (
          <div className="bg-background border border-border rounded-2xl p-8 space-y-6">
             <div className="space-y-4">
               <h3 className="font-medium text-lg">Database Management</h3>
               <p className="text-sm text-muted-foreground">
                 Manage your Firestore data. Use backups to save your current state before seeding or resetting.
               </p>
               
               {/* Backup & Restore Component */}
               <BackupTools />

               <div className="my-6 border-t border-border"></div>

               {/* Seeding Section */}
               <div className="p-5 bg-orange-50/50 border border-orange-100 rounded-xl space-y-4">
                 <div className="flex items-start gap-4">
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg mt-1">
                      <Database size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-900">Reset & Seed Database</h4>
                      <p className="text-sm text-orange-800/80 mt-1 mb-3">
                         This will <strong>delete all existing products and categories</strong> and replace them with the default demo data.
                         <br/>
                         Images will be served from Supabase storage if configured.
                      </p>
                      <button 
                        onClick={handleSeed} 
                        disabled={loading} 
                        className="px-5 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors shadow-sm"
                      >
                         {loading ? 'Processing...' : 'Reset to Default Seed Data'}
                      </button>
                    </div>
                 </div>
               </div>
             </div>
          </div>
        )}
        

        {/* NAVIGATION TAB */}
        {activeTab === 'navigation' && (
           <div className="bg-background border border-border rounded-2xl p-8 space-y-6">
               <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                     <LayoutTemplate size={24} />
                   </div>
                   <div>
                     <h3 className="font-medium text-lg">Navigation Settings</h3>
                     <p className="text-sm text-muted-foreground">Manage site navigation visibility.</p>
                   </div>
               </div>

               <div className="flex items-center justify-between p-6 border border-border rounded-xl bg-card">
                  <div>
                    <div className="font-medium text-lg">Show Desktop Menu</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Toggle the visibility of the navigation links in the header on desktop screens.
                    </div>
                  </div>
                  <button
                    onClick={() => themeContext.updateSettings({ showDesktopMenu: !themeContext.showDesktopMenu })}
                    className={clsx(
                      "relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                      themeContext.showDesktopMenu ? "bg-blue-600" : "bg-zinc-200"
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
            </div>
        )}

        {message && <div className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg animate-fade-in-up">{message}</div>}
      </div>
    </div>
  );
};

export default SiteControl;
