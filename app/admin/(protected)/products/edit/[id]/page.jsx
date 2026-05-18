"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Save, X, Upload, ArrowLeft, Trash2, Plus } from 'lucide-react';

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
    specifications: [{ key: '', value: '' }]
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

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
          setFormData({
            name: product.name || '',
            brand: product.brand || '',
            price: (product.price !== null && product.price !== undefined) ? product.price : '',
            category: product.category || '',
            shortDescription: product.short_description || '',
            longDescription: product.long_description || '',
            featured: product.featured || false,
            images: product.images || [],
            specifications: product.specifications || [{ key: '', value: '' }]
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
      const productData = {
        name: formData.name,
        brand: formData.brand,
        price: formData.price === '' ? null : Number(formData.price),
        category: formData.category,
        short_description: formData.shortDescription,
        long_description: formData.longDescription,
        featured: formData.featured,
        images: finalImages.length > 0 ? finalImages : ['https://placehold.co/600x400?text=No+Image'],
        specifications: formData.specifications.filter(s => s.key && s.value),
        updated_at: new Date().toISOString()
      };

      // 3. Update Supabase
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id);
      
      if (error) throw error;
      
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
    <div className="p-8 max-w-4xl mx-auto animate-fade-in pb-20">
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
        <div className="bg-background p-6 rounded-2xl border border-border space-y-6">
          <h2 className="text-xl font-medium">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Name</label>
              <input required name="name" value={formData.name} onChange={handleChange} className="w-full p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Brand</label>
              <input required name="brand" value={formData.brand} onChange={handleChange} className="w-full p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price <span className="text-xs font-normal text-muted-foreground ml-1">(Optional - Keep blank for Call for Price)</span></label>
              <input type="number" step="any" name="price" value={formData.price} onChange={handleChange} className="w-full p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none" />
            </div>
             <div className="space-y-2 ">
              <label className="text-sm font-medium">Brand Category</label>
              <select required name="category" value={formData.category} onChange={handleChange} className="w-full p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none">
                <option value="">Select Brand Category</option>
                {categories.map(cat => (
                  <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Short Description</label>
            <input required name="shortDescription" value={formData.shortDescription} onChange={handleChange} className="w-full p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Description</label>
            <textarea required rows={4} name="longDescription" value={formData.longDescription} onChange={handleChange} className="w-full p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none" />
          </div>
          <div className="flex items-center gap-3">
             <input type="checkbox" id="featured" name="featured" checked={formData.featured} onChange={handleChange} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
             <label htmlFor="featured" className="text-sm font-medium">Mark as Featured Product</label>
          </div>
        </div>

        {/* Images */}
        <div className="bg-background p-6 rounded-2xl border border-border space-y-6">
          <h2 className="text-xl font-medium">Product Images</h2>
          
          {/* Existing Images */}
          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {formData.images.map((img, idx) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden border border-border aspect-square">
                        <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                        <button 
                            type="button" 
                            onClick={() => removeImage(idx)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
          )}

          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center transition-colors hover:border-primary/50 bg-secondary/10">
            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" id="images" />
            <label htmlFor="images" className="cursor-pointer flex flex-col items-center gap-3">
               <div className="p-4 bg-background rounded-full shadow-sm">
                 <Upload size={24} className="text-primary" />
               </div>
               <span className="font-medium">Click to upload new images</span>
               <span className="text-sm text-muted-foreground">{imageFiles.length} new file(s) selected</span>
            </label>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-background p-6 rounded-2xl border border-border space-y-6">
          <div className="flex justify-between items-center">
             <h2 className="text-xl font-medium">Specifications</h2>
             <button type="button" onClick={addSpec} className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
               <Plus size={16} /> Add Spec
             </button>
          </div>
          <div className="space-y-4">
            {formData.specifications.map((spec, index) => (
              <div key={index} className="flex gap-4 items-start">
                <input 
                  placeholder="Key (e.g. Frequency Response)" 
                  value={spec.key} 
                  onChange={(e) => handleSpecChange(index, 'key', e.target.value)} 
                  className="flex-1 p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none" 
                />
                <input 
                  placeholder="Value (e.g. 20Hz - 20kHz)" 
                  value={spec.value} 
                  onChange={(e) => handleSpecChange(index, 'value', e.target.value)} 
                  className="flex-1 p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none" 
                />
                <button type="button" onClick={() => removeSpec(index)} className="p-3 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4">
           <Link href="/admin/products" className="px-6 py-3 font-medium text-muted-foreground hover:bg-secondary rounded-lg transition-colors">
             Cancel
           </Link>
           <button 
             type="submit" 
             disabled={loading} 
             className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
           >
             {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
             {loading ? (uploading ? 'Uploading Images...' : 'Saving...') : 'Update Product'}
           </button>
        </div>

      </form>
    </div>
  );
}
