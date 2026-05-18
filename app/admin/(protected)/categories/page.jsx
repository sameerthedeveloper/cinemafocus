"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Plus, Trash2, Tag, X, Edit, Check } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import { revalidateData } from '@/lib/actions';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const supabase = createClient();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      imageUrl: category.image_url || ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      imageUrl: ''
    });
  };

  const fetchCategories = async () => {
    try {
      // 1. Fetch Categories
      const { data: cats, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
      
      if (catError) throw catError;

      // 2. Fetch Product Counts
      const { data: products, error: prodError } = await supabase
        .from('products')
        .select('category');
      
      if (prodError) throw prodError;

      const counts = {};
      products.forEach(p => {
        if (p.category) {
          counts[p.category] = (counts[p.category] || 0) + 1;
        }
      });

      const categoriesWithCounts = (cats || []).map(cat => ({
        ...cat,
        productCount: counts[cat.slug] || 0
      }));

      setCategories(categoriesWithCounts);

    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      try {
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        try {
          await revalidateData('categories');
        } catch (err) {
          console.warn("Failed to revalidate brands:", err);
        }

        setCategories(categories.filter(c => c.id !== id));
      } catch (error) {
        console.error("Error deleting brand:", error);
        alert("Failed to delete brand: " + error.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (editingCategory) {
        // Edit Mode
        const updatedCategory = {
          id: editingCategory.id, // Keep the same ID
          name: formData.name,
          slug: editingCategory.slug, // Keep the same slug
          description: formData.description,
          image_url: formData.imageUrl || "https://placehold.co/600x400?text=No+Image",
          product_count: editingCategory.productCount || editingCategory.product_count || 0,
          featured: editingCategory.featured || false
        };

        const { error } = await supabase
          .from('categories')
          .upsert(updatedCategory);
        
        if (error) throw error;
      } else {
        // Create Mode
        const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        const newCategory = {
          id: slug, // Using slug as ID for consistency with legacy links
          name: formData.name,
          slug: slug,
          description: formData.description,
          image_url: formData.imageUrl || "https://placehold.co/600x400?text=No+Image",
          product_count: 0,
          featured: false
        };

        const { error } = await supabase
          .from('categories')
          .upsert(newCategory);
        
        if (error) throw error;
      }
      
      try {
        await revalidateData('categories');
      } catch (err) {
        console.warn("Failed to revalidate categories:", err);
      }
      
      fetchCategories();
      closeModal();

    } catch (error) {
      console.error("Error saving brand:", error);
      alert("Failed to save brand: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-fade-in relative pb-20 md:pb-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-8 md:mb-10">
        <div>
           <h1 className="text-2xl md:text-3xl font-medium tracking-tight">Brands</h1>
           <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage the brands in your catalog.</p>
        </div>
        <button 
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: '', description: '', imageUrl: '' });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity w-full md:w-auto justify-center"
        >
          <Plus size={18} />
          Add Brand
        </button>
      </header>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">Loading brands...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-background group rounded-2xl border border-border overflow-hidden flex flex-col hover:border-primary/50 transition-colors">
              <div className="aspect-video bg-secondary relative overflow-hidden">
                {category.image_url && (
                    <img src={category.image_url} alt={category.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                )}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button 
                    onClick={() => handleEditClick(category)}
                    className="p-2 bg-white/90 text-primary rounded-lg hover:bg-secondary shadow-sm transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(category.id)}
                    className="p-2 bg-white/90 text-red-500 rounded-lg hover:bg-red-50 shadow-sm transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-medium text-lg">{category.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2 flex-grow">{category.description}</p>
                <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-xs text-muted-foreground uppercase tracking-wider font-medium">
                   <span>/{category.slug}</span>
                   <span>{category.productCount || 0} Products</span>
                   <span className="text-[10px] uppercase tracking-widest font-semibold bg-secondary px-2 py-0.5 rounded-full">Brand</span>
                </div>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
             <div className="col-span-full py-20 text-center text-muted-foreground bg-secondary/30 rounded-2xl border-dashed border-2 border-border">
               No brands found. Add your first brand above.
             </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-background rounded-2xl w-full max-w-lg shadow-xl border border-border overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/30">
               <h2 className="text-xl font-medium">{editingCategory ? 'Edit Brand' : 'New Brand'}</h2>
               <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                 <X size={20} />
               </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Brand Name</label>
                <input 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none" 
                  placeholder="e.g. KEF, Bowers &amp; Wilkins"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none resize-none" 
                  placeholder="Short description for display cards..."
                />
              </div>

              <div className="space-y-4">
                 <label className="text-sm font-medium block">Cover Image</label>
                 <ImageUpload 
                   onUploadComplete={(url) => setFormData({...formData, imageUrl: url})}
                   initialImage={formData.imageUrl}
                 />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                 <button 
                   type="button" 
                   onClick={closeModal}
                   className="px-5 py-2.5 text-muted-foreground hover:bg-secondary rounded-lg font-medium transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit" 
                   disabled={saving}
                   className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
                 >
                   {saving ? (
                     <Loader2 className="animate-spin" size={18} />
                   ) : editingCategory ? (
                     <Check size={18} />
                   ) : (
                     <Plus size={18} />
                   )}
                   {saving ? (editingCategory ? 'Saving...' : 'Creating...') : editingCategory ? 'Save Changes' : 'Create Brand'}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
