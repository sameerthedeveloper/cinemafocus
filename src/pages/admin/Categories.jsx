import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { supabase, storageBucket } from '../../lib/supabase';
import { Loader2, Plus, Trash2, Upload, LayoutGrid, X } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => (a.order || 99) - (b.order || 99)); // Simple sort if order exists
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteDoc(doc(db, "categories", id));
        setCategories(categories.filter(c => c.id !== id));
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      let finalImageUrl = formData.imageUrl;

      if (imageFile) {
        const filePath = `categories/${Date.now()}_${imageFile.name}`;
        const { error } = await supabase.storage.from(storageBucket).upload(filePath, imageFile);
        if (error) throw error;

        const { data } = supabase.storage.from(storageBucket).getPublicUrl(filePath);
        finalImageUrl = data.publicUrl;
      } else if (!finalImageUrl) {
        finalImageUrl = "https://placehold.co/600x400?text=No+Image";
      }

      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      const newCategory = {
        name: formData.name,
        slug: slug,
        description: formData.description,
        imageUrl: finalImageUrl,
        productCount: 0, // Initial count
        createdAt: new Date().toISOString()
      };

      // Use slug as document ID
      await addDoc(collection(db, "categories"), newCategory); // Or setDoc with slug if we want strict ID
      
      // Refresh list
      fetchCategories();
      
      // Reset and close
      setFormData({ name: '', description: '', imageUrl: '' });
      setImageFile(null);
      setShowModal(false);

    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in relative">
      <header className="flex justify-between items-center mb-10">
        <div>
           <h1 className="text-3xl font-medium tracking-tight">Categories</h1>
           <p className="text-muted-foreground mt-1">Organize your product catalog.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={18} />
          Add Category
        </button>
      </header>

      {/* Categories Grid */}
      {loading ? (
        <div className="text-center py-20 text-muted-foreground">Loading categories...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-background group rounded-2xl border border-border overflow-hidden flex flex-col hover:border-primary/50 transition-colors">
              <div className="aspect-video bg-secondary relative overflow-hidden">
                <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleDelete(category.id)}
                    className="p-2 bg-white/90 text-red-500 rounded-lg hover:bg-red-50 shadow-sm"
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
                </div>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
             <div className="col-span-full py-20 text-center text-muted-foreground bg-secondary/30 rounded-2xl border-dashed border-2 border-border">
               No categories found. Add your first one above.
             </div>
          )}
        </div>
      )}

      {/* Add Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-background rounded-2xl w-full max-w-lg shadow-xl border border-border overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/30">
               <h2 className="text-xl font-medium">New Category</h2>
               <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                 <X size={20} />
               </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category Name</label>
                <input 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none" 
                  placeholder="e.g. Headphones"
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
                 <div className="flex items-center gap-4">
                   <div className="w-20 h-20 bg-secondary rounded-lg overflow-hidden border border-border flex-shrink-0">
                      {imageFile ? (
                        <img src={URL.createObjectURL(imageFile)} className="w-full h-full object-cover" />
                      ) : (
                        <LayoutGrid className="w-full h-full p-6 text-muted-foreground" />
                      )}
                   </div>
                   <input 
                     type="file" 
                     accept="image/*"
                     onChange={handleImageChange}
                     className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                   />
                 </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                 <button 
                   type="button" 
                   onClick={() => setShowModal(false)}
                   className="px-5 py-2.5 text-muted-foreground hover:bg-secondary rounded-lg font-medium transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit" 
                   disabled={saving}
                   className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
                 >
                   {saving ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                   {saving ? 'Creating...' : 'Create Category'}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
