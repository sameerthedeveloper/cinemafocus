import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Loader2, Save, Globe, Search, Share2 } from 'lucide-react';

const SEO = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [seo, setSeo] = useState({
    siteTitle: 'Cinema Focus',
    titleSuffix: '| Premium Audio',
    defaultDescription: 'Experience the ultimate in home audio and cinema.',
    defaultKeywords: 'audio, hifi, speakers, home theater, cinema focus',
    ogImage: ''
  });

  useEffect(() => {
    fetchSeoData();
  }, []);

  const fetchSeoData = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'site_content', 'seo');
      const docSnap = await getDoc(docRef);
        
      if (docSnap.exists()) {
        setSeo(prev => ({ ...prev, ...docSnap.data() }));
      }
    } catch (error) {
      console.error("Error fetching SEO data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setDoc(doc(db, 'site_content', 'seo'), seo);
      
      setMessage('SEO settings updated!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error saving SEO data:", error);
      setMessage('Failed to save settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSeo(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto animate-fade-in pb-20 md:pb-8">
      <header className="mb-8 md:mb-10">
         <h1 className="text-2xl md:text-3xl font-medium tracking-tight">SEO Settings</h1>
         <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage search engine optimization preferences.</p>
      </header>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* General Settings */}
        <div className="bg-background border border-border rounded-2xl p-4 md:p-8 space-y-6">
           <h2 className="text-lg md:text-xl font-medium flex items-center gap-2">
             <Globe size={20} className="text-primary"/> 
             General Settings
           </h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
               <label className="text-sm font-medium">Site Name</label>
               <input 
                 name="siteTitle"
                 value={seo.siteTitle} 
                 onChange={handleChange} 
                 className="w-full p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none" 
                 placeholder="Cinema Focus" 
               />
               <p className="text-xs text-muted-foreground">The main name of your website.</p>
             </div>
             <div className="space-y-2">
               <label className="text-sm font-medium">Title Suffix</label>
               <input 
                 name="titleSuffix"
                 value={seo.titleSuffix} 
                 onChange={handleChange} 
                 className="w-full p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none" 
                 placeholder="| Premium Audio" 
               />
               <p className="text-xs text-muted-foreground">Appended to page titles (e.g. "Home | Premium Audio").</p>
             </div>
           </div>

           <div className="space-y-2">
             <label className="text-sm font-medium">Default Meta Description</label>
             <textarea 
               name="defaultDescription"
               rows={3}
               value={seo.defaultDescription} 
               onChange={handleChange} 
               className="w-full p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none" 
               placeholder="A brief description of your website..." 
             />
             <p className="text-xs text-muted-foreground">Used when a specific page doesn't have its own description.</p>
           </div>

           <div className="space-y-2">
             <label className="text-sm font-medium">Default Keywords</label>
             <input 
               name="defaultKeywords"
               value={seo.defaultKeywords} 
               onChange={handleChange} 
               className="w-full p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none" 
               placeholder="kef, mcintosh, speakers..." 
             />
             <p className="text-xs text-muted-foreground">Comma separated keywords.</p>
           </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-end pt-4">
           <button 
             type="submit" 
             disabled={loading}
             className="w-full md:w-auto px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
           >
             {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
             Save SEO Settings
           </button>
        </div>

      </form>

      {message && (
        <div className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg animate-fade-in-up flex items-center gap-2">
          {message}
        </div>
      )}
    </div>
  );
};

export default SEO;
