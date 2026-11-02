"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/aws/queryClient';
import { revalidateData } from '@/lib/actions';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Save, X, Upload, ArrowLeft, Trash2, Plus } from 'lucide-react';
import Reveal from '@/components/Reveal';
import ImageZoomButton from '@/components/admin/ImageZoom';

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    category: '',
    shortDescription: '',
    longDescription: '',
    featured: false,
    images: [],
    specifications: [{ key: '', value: '' }],
    seoTitle: '',
    seoDescription: '',
    canonicalSlug: '',
    seoNoindex: false,
    priceVerified: false
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  // The full record as loaded: the update replaces the whole item, so anything the form does not edit must be sent back
  const [original, setOriginal] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Categories
        const { data: catData } = await supabase
          .from('categories')
          .select('name, slug');
        
        if (catData) setCategories(catData);

        // Fetch Product Data
        const { data: product, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (product) {
          setOriginal(product);
          setFormData({
            name: product.name || '',
            brand: product.brand || '',
            price: (product.price !== null && product.price !== undefined) ? product.price : '',
            category: product.category || '',
            shortDescription: product.short_description || '',
            longDescription: product.long_description || '',
            featured: product.featured || false,
            images: product.images || [],
            specifications: product.specifications || [{ key: '', value: '' }],
            seoTitle: product.seo_title || '',
            seoDescription: product.seo_description || '',
            canonicalSlug: product.canonical_slug || '',
            seoNoindex: product.seo_noindex === true,
            priceVerified: product.price_verified === true
          });
        } else {
          console.error("Product fetch error:", error);
          alert("Product not found!");
          router.push('/admin/products');
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setInitialLoading(false);
      }
    };
    if (id) {
        fetchData();
    }
  }, [id, router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index][field] = value;
    setFormData(prev => ({ ...prev, specifications: newSpecs }));
  };

  const addSpec = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }]
    }));
  };

  const removeSpec = (index) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImageFiles(prev => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const removeImage = (indexToRemove) => {
    setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Upload New Images to Supabase Storage
      let newImageUrls = [];
      if (imageFiles.length > 0) {
        setUploading(true);
        const uploadPromises = imageFiles.map(async (file) => {
          const fileName = `products/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
          const { data, error } = await supabase.storage
            .from('images')
            .upload(fileName, file);
          
          if (error) throw error;
          
          const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(fileName);
          
          return publicUrl;
        });
        newImageUrls = await Promise.all(uploadPromises);
        setUploading(false);
      }

      // Combine existing images (that weren't removed) with new ones
      const finalImages = [...formData.images, ...newImageUrls];

      // 2. Prepare Data (mapping camelCase to snake_case for Supabase)
      // Keep the slug; if an earlier save already lost it, restore it from the id ("pl-<slug>" for imported products)
      const slug = original?.slug || (String(id).startsWith('pl-') ? String(id).slice(3) : undefined);
      const productData = {
        ...(original || {}),
        ...(slug ? { slug } : {}),
        name: formData.name,
        brand: formData.brand,
        price: formData.price === '' ? null : Number(formData.price),
        category: formData.category,
        short_description: formData.shortDescription,
        long_description: formData.longDescription,
        featured: formData.featured,
        images: finalImages.length > 0 ? finalImages : ['https://placehold.co/600x400?text=No+Image'],
        specifications: formData.specifications.filter(s => s.key && s.value),
        seo_title: formData.seoTitle.trim() || null,
        seo_description: formData.seoDescription.trim() || null,
        canonical_slug: formData.canonicalSlug.trim() || null,
        seo_noindex: formData.seoNoindex,
        price_verified: formData.priceVerified,
        updated_at: new Date().toISOString()
      };

      // 3. Update Supabase
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id);
      
      if (error) throw error;

      await revalidateData('products');

      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      console.error("Error updating product: ", error);
      alert("Failed to update product: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">
        <Loader2 className="animate-spin mr-2" /> Loading product details...
      </div>
    );
  }

  return (
    <Reveal className="p-8 max-w-4xl mx-auto animate-fade-in pb-20">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 hover:bg-secondary rounded-full transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
           <h1 className="text-3xl font-medium tracking-tight">Edit Product</h1>
           <p className="text-muted-foreground mt-1">Update product details.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Info */}
        <div className="bg-background p-6 md:p-8 rounded-card border border-border space-y-6">
          <h2 className="text-xl font-medium tracking-tight">Basic information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Product name</label>
              <input required name="name" value={formData.name} onChange={handleChange} className="w-full h-12 px-4 bg-background rounded-control border border-input focus:border-foreground outline-none transition-colors placeholder:text-muted-foreground/60" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Brand</label>
              <input required name="brand" value={formData.brand} onChange={handleChange} className="w-full h-12 px-4 bg-background rounded-control border border-input focus:border-foreground outline-none transition-colors placeholder:text-muted-foreground/60" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price <span className="text-xs font-normal text-muted-foreground ml-1">(Optional - Keep blank for Call for Price)</span></label>
              <input type="number" step="any" name="price" value={formData.price} onChange={handleChange} className="w-full h-12 px-4 bg-background rounded-control border border-input focus:border-foreground outline-none transition-colors placeholder:text-muted-foreground/60" />
            </div>
             <div className="space-y-2 ">
              <label className="text-sm font-medium">Brand category</label>
              <select required name="category" value={formData.category} onChange={handleChange} className="w-full h-12 px-4 bg-background rounded-control border border-input focus:border-foreground outline-none transition-colors placeholder:text-muted-foreground/60">
                <option value="">Select Brand Category</option>
                {categories.map(cat => (
                  <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Short description</label>
            <input required name="shortDescription" value={formData.shortDescription} onChange={handleChange} className="w-full h-12 px-4 bg-background rounded-control border border-input focus:border-foreground outline-none transition-colors placeholder:text-muted-foreground/60" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Full description</label>
            <textarea required rows={4} name="longDescription" value={formData.longDescription} onChange={handleChange} className="w-full min-h-28 px-4 py-3 bg-background rounded-control border border-input focus:border-foreground outline-none transition-colors placeholder:text-muted-foreground/60" />
          </div>
          <div className="flex items-center gap-3">
             <input type="checkbox" id="featured" name="featured" checked={formData.featured} onChange={handleChange} className="w-5 h-5 rounded border-border accent-foreground" />
             <label htmlFor="featured" className="text-sm font-medium">Mark as featured product</label>
          </div>
        </div>

        {/* Images */}
        <div className="bg-background p-6 md:p-8 rounded-card border border-border space-y-6">
          <h2 className="text-xl font-medium tracking-tight">Product images</h2>
          
          {/* Existing Images */}
          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {formData.images.map((img, idx) => (
                    <div key={idx} className="relative group rounded-media overflow-hidden bg-secondary border border-border aspect-square">
                        <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                        <ImageZoomButton src={img} alt={`Product image ${idx + 1}`} className="bottom-2 right-2 md:opacity-0 md:group-hover:opacity-100" />
                        <button 
                            type="button" 
                            onClick={() => removeImage(idx)}
                            className="absolute top-2 right-2 bg-danger text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
          )}

          <div className="border-2 border-dashed border-border rounded-card p-8 text-center transition-colors hover:border-foreground/40">
            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" id="images" />
            <label htmlFor="images" className="cursor-pointer flex flex-col items-center gap-3">
               <div className="p-4 bg-secondary rounded-full">
                 <Upload size={24} />
               </div>
               <span className="font-medium">Click to upload new images</span>
               <span className="text-sm text-muted-foreground">{imageFiles.length} new file(s) selected</span>
            </label>
          </div>
        </div>

        {/* Search & indexing (SEO) */}
        <div className="bg-background p-6 md:p-8 rounded-card border border-border space-y-6">
          <h2 className="text-xl font-medium tracking-tight">Search &amp; Indexing</h2>
          <div className="space-y-2">
            <label className="text-sm font-medium">SEO Title <span className="text-xs font-normal text-muted-foreground ml-1">(Optional - max 60 characters)</span></label>
            <input name="seoTitle" maxLength={70}value={formData.seoTitle} onChange={handleChange} className="w-full h-12 px-4 bg-background rounded-control border border-input focus:border-foreground outline-none transition-colors placeholder:text-muted-foreground/60" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">SEO Description <span className="text-xs font-normal text-muted-foreground ml-1">(Optional - 120 to 160 characters)</span></label>
            <textarea rows={2} name="seoDescription" maxLength={200} value={formData.seoDescription} onChange={handleChange} className="w-full min-h-28 px-4 py-3 bg-background rounded-control border border-input focus:border-foreground outline-none transition-colors placeholder:text-muted-foreground/60" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Canonical Product Slug <span className="text-xs font-normal text-muted-foreground ml-1">(Only for duplicates: visitors and search engines are redirected to this product)</span></label>
            <input name="canonicalSlug" value={formData.canonicalSlug} onChange={handleChange} className="w-full h-12 px-4 bg-background rounded-control border border-input focus:border-foreground outline-none transition-colors placeholder:text-muted-foreground/60" />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="seoNoindex" name="seoNoindex" checked={formData.seoNoindex} onChange={handleChange} className="w-5 h-5 rounded border-border accent-foreground" />
            <label htmlFor="seoNoindex" className="text-sm font-medium">Hide from search engines (noindex)</label>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="priceVerified" name="priceVerified" checked={formData.priceVerified} onChange={handleChange} className="w-5 h-5 rounded border-border accent-foreground" />
            <label htmlFor="priceVerified" className="text-sm font-medium">Price is verified INR (allow price in Google rich results)</label>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-background p-6 md:p-8 rounded-card border border-border space-y-6">
          <div className="flex justify-between items-center">
             <h2 className="text-xl font-medium tracking-tight">Specifications</h2>
             <button type="button" onClick={addSpec} className="h-9 px-4 rounded-full bg-secondary hover:bg-accent text-sm font-medium flex items-center gap-1.5 transition-colors">
               <Plus size={16} /> Add spec
             </button>
          </div>
          <div className="space-y-4">
            {formData.specifications.map((spec, index) => (
              <div key={index} className="flex gap-4 items-start">
                <input 
                  placeholder="Key (e.g. Frequency Response)" 
                  value={spec.key} 
                  onChange={(e) => handleSpecChange(index, 'key', e.target.value)} 
                  className="flex-1 h-12 px-4 bg-background rounded-control border border-input focus:border-foreground outline-none transition-colors" 
                />
                <input 
                  placeholder="Value (e.g. 20Hz - 20kHz)" 
                  value={spec.value} 
                  onChange={(e) => handleSpecChange(index, 'value', e.target.value)} 
                  className="flex-1 h-12 px-4 bg-background rounded-control border border-input focus:border-foreground outline-none transition-colors" 
                />
                <button type="button" onClick={() => removeSpec(index)} className="p-3 text-muted-foreground hover:text-danger hover:bg-secondary rounded-full">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4">
           <Link href="/admin/products" className="h-12 px-6 inline-flex items-center font-medium text-muted-foreground hover:bg-secondary rounded-full transition-colors">
             Cancel
           </Link>
           <button 
             type="submit" 
             disabled={loading} 
             className="h-12 px-8 bg-primary text-primary-foreground rounded-full font-medium tracking-tight hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
           >
             {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
             {loading ? (uploading ? 'Uploading images…' : 'Saving…') : 'Update Product'}
           </button>
        </div>

      </form>
    </Reveal>
  );
}
