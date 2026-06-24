"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import ContentBlockBuilder from '@/components/admin/ContentBlockBuilder';
import { revalidatePressCache } from '@/app/actions/press';

export default function EditPressReleasePage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    date: '',
    excerpt: '',
    coverImages: [],
    imageUrl: '', 
    pdfUrl: '',
    contentBlocks: []
  });

  useEffect(() => {
    const fetchRelease = async () => {
      try {
        const { data, error } = await supabase
          .from('press_releases')
          .select('*')
          .eq('id', id)
          .single();
        
        if (data) {
          // Migration logic from legacy fields
          let contentBlocks = data.content_blocks || [];
          if (contentBlocks.length === 0 && data.content) {
            contentBlocks = [
              { 
                id: crypto.randomUUID(), 
                type: 'text', 
                data: { text: data.content } 
              }
            ];
          }

          let coverImages = data.cover_images || [];
          if (coverImages.length === 0 && data.image_url) {
             coverImages = [data.image_url];
          }

          setFormData({
            title: data.title || '',
            slug: data.slug || '',
            date: data.date || '',
            excerpt: data.excerpt || '',
            coverImages: coverImages,
            imageUrl: data.image_url || '',
            pdfUrl: data.pdf_url || '',
            contentBlocks: contentBlocks
          });
        } else {
          console.error("Press release fetch error:", error);
          alert("Press release not found!");
          router.push('/admin/press-releases');
        }
      } catch (error) {
        console.error("Error fetching press release:", error);
      } finally {
        setLoading(false);
      }
    };

    if(id) fetchRelease();
  }, [id, router]);

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
    setSaving(true);
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
        .update(dataToSave)
        .eq('id', id);

      if (error) throw error;

      await revalidatePressCache();
      router.push('/admin/press-releases');
      router.refresh();
    } catch (error) {
      console.error("Error updating press release:", error);
      alert("Failed to update press release: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading press release...</div>;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-20 md:pb-8 animate-fade-in text-sm md:text-base">
      <Link href="/admin/press-releases" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors font-medium">
        <ArrowLeft size={18} className="mr-2" />
        Back to Press Releases
      </Link>
      
      <h1 className="text-2xl md:text-3xl font-medium tracking-tight mb-8">Edit Press Release</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-4 md:p-8 rounded-xl border border-border shadow-sm">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input 
            required
            type="text" 
            className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
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
               value={formData.slug || ''}
               onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')})}
               placeholder="my-press-release"
             />
           </div>
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
           <p className="text-xs text-muted-foreground mb-3">The first image will be used as the main cover.</p>
           
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
                     Main
                   </span>
                 )}
               </div>
             ))}
             
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
            disabled={saving}
            className="w-full md:w-auto bg-primary text-primary-foreground px-8 py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 font-medium"
          >
            <Save size={18} />
            {saving ? 'Updating...' : 'Update Release'}
          </button>
        </div>
      </form>
    </div>
  );
}
