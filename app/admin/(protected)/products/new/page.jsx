"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Plus, X, Upload, ArrowLeft } from 'lucide-react';

export default function AddProductPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
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
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('name, slug');
      
      if (data) {
        setCategories(data);
      }
    };
    fetchCategories();
  }, []);

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
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Upload Images to Supabase Storage
      let imageUrls = [];
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
        imageUrls = await Promise.all(uploadPromises);
        setUploading(false);
      }

      // 2. Prepare Data (mapping camelCase to snake_case for Supabase)
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const productData = {
        id: slug, // Using slug as ID for consistency with legacy links
        name: formData.name,
        slug: slug,
        brand: formData.brand,
        price: formData.price === '' ? null : Number(formData.price),
        category: formData.category,
        short_description: formData.shortDescription, 
        long_description: formData.longDescription,   
        featured: formData.featured,
        images: imageUrls.length > 0 ? imageUrls : ['https://placehold.co/600x400?text=No+Image'], 
        specifications: formData.specifications.filter(s => s.key && s.value),
      };

      // 3. Insert into Supabase
      const { error } = await supabase
        .from('products')
        .insert(productData);
      
      if (error) throw error;
      
      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      console.error("Error adding product: ", error);
      alert("Failed to add product: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto animate-fade-in pb-20 md:pb-8">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 hover:bg-secondary rounded-full transition-colors flex-shrink-0">
          <ArrowLeft size={20} />
        </Link>
        <div>
           <h1 className="text-2xl md:text-3xl font-medium tracking-tight">Add Product</h1>
           <p className="text-muted-foreground mt-1 text-sm md:text-base">Create a new item in your inventory.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Info */}
        <div className="bg-background p-6 rounded-2xl border border-border space-y-6">
          <h2 className="text-xl font-medium">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Name</label>
              <input required name="name" value={formData.name} onChange={handleChange} className="w-full p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none" placeholder="e.g. KEF LS50 Wireless II" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Brand</label>
              <input required name="brand" value={formData.brand} onChange={handleChange} className="w-full p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none" placeholder="e.g. KEF" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price <span className="text-xs font-normal text-muted-foreground ml-1">(Optional - Keep blank for Call for Price)</span></label>
              <input type="number" step="any" name="price" value={formData.price} onChange={handleChange} className="w-full p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none" placeholder="2499.99" />
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
            <input required name="shortDescription" value={formData.shortDescription} onChange={handleChange} className="w-full p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none" placeholder="Brief summary for cards..." />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Description</label>
            <textarea required rows={4} name="longDescription" value={formData.longDescription} onChange={handleChange} className="w-full p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none" placeholder="Detailed product description..." />
          </div>
          <div className="flex items-center gap-3">
             <input type="checkbox" id="featured" name="featured" checked={formData.featured} onChange={handleChange} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
             <label htmlFor="featured" className="text-sm font-medium">Mark as Featured Product</label>
          </div>
        </div>

        {/* Images */}
        <div className="bg-background p-6 rounded-2xl border border-border space-y-6">
          <h2 className="text-xl font-medium">Product Images</h2>
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center transition-colors hover:border-primary/50 bg-secondary/10">
            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" id="images" />
            <label htmlFor="images" className="cursor-pointer flex flex-col items-center gap-3">
               <div className="p-4 bg-background rounded-full shadow-sm">
                 <Upload size={24} className="text-primary" />
               </div>
               <span className="font-medium">Click to upload images</span>
               <span className="text-sm text-muted-foreground">{imageFiles.length} file(s) selected</span>
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
              <div key={index} className="flex flex-col md:flex-row gap-2 md:gap-4 items-stretch md:items-start p-2 bg-secondary/10 rounded-lg md:bg-transparent md:p-0">
                <input 
                  placeholder="Key (e.g. Frequency Response)" 
                  value={spec.key} 
                  onChange={(e) => handleSpecChange(index, 'key', e.target.value)} 
                  className="w-full flex-1 p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none" 
                />
                <input 
                  placeholder="Value (e.g. 20Hz - 20kHz)" 
                  value={spec.value} 
                  onChange={(e) => handleSpecChange(index, 'value', e.target.value)} 
                  className="w-full flex-1 p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none" 
                />
                <button type="button" onClick={() => removeSpec(index)} className="p-3 text-red-500 hover:bg-red-50 rounded-lg self-end md:self-auto">
                  <X size={20} />
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
             {loading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
             {loading ? (uploading ? 'Uploading Images...' : 'Saving...') : 'Create Product'}
           </button>
        </div>

      </form>
    </div>
  );
}
