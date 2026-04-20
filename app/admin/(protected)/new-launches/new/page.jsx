"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Sparkles, Search, Loader2 } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

export default function AddNewLaunchPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedProductId, setSelectedProductId] = useState('');
  const [overrideImage, setOverrideImage] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    slug: '',
    category: '',
    shortDescription: '',
    images: [], 
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*");
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
       console.error("Error fetching products:", error);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductSelect = (productId) => {
    setSelectedProductId(productId);
    
    if (productId) {
       const product = products.find(p => p.id === productId);
       if (product) {
          setFormData({
             name: product.name || '',
             brand: product.brand || '',
             price: product.price || '',
             slug: product.slug || '', 
             category: product.category || '',
             shortDescription: product.short_description || '',
             images: product.images || []
          });
       }
    } else {
       setFormData({
        name: '',
        brand: '',
        price: '',
        slug: '',
        category: '',
        shortDescription: '',
        images: []
       });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        brand: formData.brand,
        price: Number(formData.price),
        slug: formData.slug,
        category: formData.category,
        short_description: formData.shortDescription,
        images: overrideImage ? [overrideImage, ...formData.images] : formData.images,
        featured: true,
        original_product_id: selectedProductId === '' ? null : selectedProductId
      };
      
      const { error } = await supabase
        .from("new_launches")
        .insert(payload);

      if (error) throw error;

      router.push('/admin/site-control'); // Redirecting back to site control where launches are managed usually, or a specific page
    } catch (error) {
      console.error("Error adding new launch:", error);
      alert("Failed to feature product: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto animate-fade-in pb-20">
       <Link href="/admin/site-control" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft size={18} className="mr-2" />
        Back to Site Control
      </Link>
      
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-medium tracking-tight">Feature New Arrival</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">Select a product to highlight as a 'New Launch' on the homepage.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 md:p-8 rounded-xl border border-border shadow-sm">
        
        {/* Product Selection */}
        <div className="bg-secondary/10 p-5 rounded-lg border border-border/50">
            <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                <Sparkles size={16} className="text-primary" />
                Select Product
            </label>
            
            {!selectedProductId ? (
              <div className="space-y-3">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-3 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="max-h-60 overflow-y-auto border border-border rounded-lg bg-white divide-y divide-border/50 shadow-sm scrollbar-hide">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleProductSelect(p.id)}
                        className="w-full text-left px-4 py-3 hover:bg-secondary/20 transition-colors flex items-center justify-between group"
                      >
                         <div>
                            <span className="font-medium text-foreground">{p.name}</span>
                            {p.brand && <span className="text-sm text-muted-foreground ml-2">({p.brand})</span>}
                         </div>
                         <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">Select</span>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground text-sm italic">No products found for "{searchTerm}"</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-primary/20 shadow-sm">
                 <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{formData.name}</h3>
                      <p className="text-xs text-muted-foreground">{formData.brand} • Original Price: ₹{formData.price?.toLocaleString() || 0}</p>
                    </div>
                 </div>
                 <button 
                   type="button" 
                   onClick={() => handleProductSelect('')}
                   className="text-xs uppercase tracking-widest text-red-500 hover:text-red-700 font-bold px-3 py-1 hover:bg-red-50 rounded transition-colors"
                 >
                   Change
                 </button>
              </div>
            )}
        </div>

        {selectedProductId && (
            <div className="space-y-6 animate-fade-in-up">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                    <label className="block text-sm font-medium mb-2">Display Name Override</label>
                    <input 
                        required
                        type="text" 
                        className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-medium mb-2">Brand</label>
                    <input 
                        required
                        type="text" 
                        className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
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
                        className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
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
                            className="w-full px-4 py-2 rounded-lg border border-border bg-secondary/30 text-muted-foreground cursor-not-allowed"
                            value={formData.slug}
                        />
                         <p className="text-[10px] text-muted-foreground mt-1">Bound to the original product identifier.</p>
                    </div>
                </div>

                <div>
                   <label className="block text-sm font-medium mb-2">Short Hook/Description</label>
                   <textarea 
                     required
                     rows="3"
                     className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
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

                <div className="pt-4 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full md:w-auto bg-primary text-primary-foreground px-8 py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 font-medium shadow-sm"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {loading ? 'Processing...' : 'Feature Launch'}
                    </button>
                </div>
            </div>
        )}
      </form>
    </div>
  );
}
