"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Sparkles, Loader2 } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

export default function EditLaunchPage() {
  const router = useRouter();
  const params = useParams();
  const launchId = params.id;
  
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [overrideImage, setOverrideImage] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    slug: '',
    category: '',
    shortDescription: '',
    images: [],
    original_product_id: null,
  });

  useEffect(() => {
    if (launchId) {
      fetchLaunch();
    }
  }, [launchId]);

  const fetchLaunch = async () => {
    try {
      const { data, error } = await supabase
        .from("new_launches")
        .select("*")
        .eq('id', launchId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setFormData({
          name: data.name || '',
          brand: data.brand || '',
          price: data.price || '',
          slug: data.slug || '',
          category: data.category || '',
          shortDescription: data.short_description || '',
          images: data.images || [],
          original_product_id: data.original_product_id
        });
        
        // If the first image of the launch doesn't match the original product's first image (if present), or just show the first image
        if (data.images && data.images[0]) {
          setOverrideImage(data.images[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching launch:", error);
      alert("Failed to load featured launch data: " + error.message);
      router.push('/admin/new-launches');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Determine updated images array:
      // If overrideImage is specified, make sure it is at the front of the list, keeping original images too
      let updatedImages = [...formData.images];
      if (overrideImage) {
        // If override image was changed, ensure it's first
        if (updatedImages.indexOf(overrideImage) === -1) {
          updatedImages = [overrideImage, ...updatedImages.filter(img => img !== overrideImage)];
        }
      }

      const payload = {
        name: formData.name,
        brand: formData.brand,
        price: Number(formData.price),
        short_description: formData.shortDescription,
        images: updatedImages,
      };
      
      const { error } = await supabase
        .from("new_launches")
        .update(payload)
        .eq('id', launchId);

      if (error) throw error;

      router.push('/admin/new-launches');
    } catch (error) {
      console.error("Error saving launch changes:", error);
      alert("Failed to save changes: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-muted-foreground">
        <Loader2 className="animate-spin text-primary mb-4" size={32} />
        <p className="text-sm">Loading featured arrival details...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto animate-fade-in pb-20">
      <Link href="/admin/new-launches" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft size={18} className="mr-2" />
        Back to New Arrivals
      </Link>
      
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-medium tracking-tight flex items-center gap-2">
          <Sparkles className="text-primary animate-pulse" size={24} />
          Edit Featured Arrival
        </h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">Modify display settings and tags for this homepage hero showcase.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 md:p-8 rounded-xl border border-border shadow-sm">
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Display Name Override</label>
              <input 
                required
                type="text" 
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Brand</label>
              <input 
                required
                type="text" 
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Price (INR)</label>
              <input 
                required
                type="number" 
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Slug Link</label>
              <input 
                required
                readOnly
                type="text" 
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-secondary/30 text-muted-foreground cursor-not-allowed"
                value={formData.slug}
              />
              <p className="text-[10px] text-muted-foreground mt-1">Bound to the original product slug identifier.</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Short Hook/Description</label>
            <textarea 
              required
              rows="3"
              className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
              value={formData.shortDescription}
              onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
              placeholder="A catchy tagline for the new arrival..."
            />
          </div>

          <div className="border-t border-border pt-6">
            <label className="block text-sm font-medium mb-2">Feature Image Override</label>
            <p className="text-xs text-muted-foreground mb-4">Optional: Upload a different lifestyle shot for the homepage hero carousel.</p>
            <ImageUpload 
              onUploadComplete={(url) => setOverrideImage(url)}
              initialImage={overrideImage}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link 
              href="/admin/new-launches"
              className="px-6 py-2.5 border border-border bg-background hover:bg-secondary/40 text-foreground rounded-lg font-medium transition-colors text-center"
            >
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={saving}
              className="bg-primary text-primary-foreground px-8 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 font-medium shadow-sm"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
