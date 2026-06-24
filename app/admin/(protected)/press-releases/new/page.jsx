"use client";

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import ContentBlockBuilder from '@/components/admin/ContentBlockBuilder';
import { revalidatePressCache } from '@/app/actions/press';

export default function AddPressReleasePage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    date: new Date().toISOString().split('T')[0],
    excerpt: '',
    coverImages: [], 
    pdfUrl: '',
    contentBlocks: [] 
  });

  const handleAddCoverImage = (url) => {
    if (url) {
      setFormData({
        ...formData, 
        coverImages: [...(formData.coverImages || []), url]
      });
    }
  };

  const handleRemoveCoverImage = (index) => {
    const newImages = formData.coverImages.filter((_, i) => i !== index);
    setFormData({ ...formData, coverImages: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSave = {
        title: formData.title,
        slug: formData.slug,
        date: formData.date,
        excerpt: formData.excerpt,
        image_url: formData.coverImages?.[0] || '',
        cover_images: formData.coverImages || [],
        pdf_url: formData.pdfUrl || null,
        content_blocks: formData.contentBlocks || []
      };

      const { error } = await supabase
        .from('press_releases')
        .insert(dataToSave);

      if (error) throw error;

      await revalidatePressCache();
      router.push('/admin/press-releases');
      router.refresh();
    } catch (error) {
      console.error("Error adding press release:", error);
      alert("Failed to save: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-20 md:pb-8 animate-fade-in">
      <Link href="/admin/press-releases" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors font-medium">
        <ArrowLeft size={18} className="mr-2" />
        Back to Press Releases
      </Link>
      
      <h1 className="text-2xl md:text-3xl font-medium tracking-tight mb-8">Add New Press Release</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-4 md:p-8 rounded-xl border border-border shadow-sm">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input 
            required
            type="text" 
            className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            value={formData.title}
            onChange={(e) => {
              const title = e.target.value;
              const oldSlug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
              const currentSlug = formData.slug;
              
              if (!currentSlug || currentSlug === oldSlug) {
                const newSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                setFormData({...formData, title, slug: newSlug});
              } else {
                setFormData({...formData, title});
              }
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Slug (URL)</label>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">/press/</span>
            <input 
              required
              type="text" 
              className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
              value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')})}
              placeholder="my-press-release"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">Unique identifier for the URL.</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Date</label>
          <input 
            required
            type="date" 
            className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />
        </div>

        {/* Multiple Cover Images */}
        <div>
           <label className="block text-sm font-medium mb-2">Cover Images</label>
           <p className="text-xs text-muted-foreground mb-3">Upload multiple images. The first image will be used as the main cover.</p>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
             {formData.coverImages?.map((img, idx) => (
               <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden bg-secondary/10 border border-border">
                 <img src={img} alt={`Cover ${idx + 1}`} className="w-full h-full object-cover" />
                 <button 
                   type="button"
                   onClick={() => handleRemoveCoverImage(idx)}
                   className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                 >
                   <Trash2 size={12} />
                 </button>
                 {idx === 0 && (
                   <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded font-medium">
                     Main Cover
                   </span>
                 )}
               </div>
             ))}
             
             {/* Add New Image */}
             <div className="aspect-square rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-secondary/5">
                <ImageUpload 
                  onUploadComplete={handleAddCoverImage}
                />
             </div>
           </div>
        </div>

       <div>
           <label className="block text-sm font-medium mb-2">Excerpt</label>
           <textarea 
             required
             rows="3"
             className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
             value={formData.excerpt}
             onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
           />
        </div>

        <div>
           <label className="block text-sm font-medium mb-2">PDF Document URL (Optional)</label>
           <input 
             type="url" 
             className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
             value={formData.pdfUrl || ''}
             onChange={(e) => setFormData({...formData, pdfUrl: e.target.value})}
             placeholder="https://example.com/file.pdf"
           />
        </div>

        <div className="pt-4 border-t border-border">
           <ContentBlockBuilder 
             blocks={formData.contentBlocks || []} 
             onChange={(blocks) => setFormData({...formData, contentBlocks: blocks})} 
           />
        </div>

        <div className="pt-8">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full md:w-auto bg-primary text-primary-foreground px-8 py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 font-medium"
          >
            <Save size={18} />
            {loading ? 'Saving...' : 'Publish Release'}
          </button>
        </div>
      </form>
    </div>
  );
}
