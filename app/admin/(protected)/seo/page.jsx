"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Loader2, Save, Globe, Search, Share2, 
  ArrowLeft, ArrowRight, Edit3, CheckCircle2, 
  AlertCircle, Sparkles, Filter, X, Eye 
} from 'lucide-react';
import clsx from 'clsx';
import { revalidateData } from '@/lib/actions';
import ImageUpload from '@/components/ImageUpload';

export default function AdminSEOPage() {
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [message, setMessage] = useState('');
  const supabase = createClient();
  
  // Segmented view state
  const [activeTab, setActiveTab] = useState('sitewide'); // 'sitewide' | 'products'
  
  // Site-wide SEO Settings
  const [seo, setSeo] = useState({
    siteTitle: 'Cinema Focus',
    titleSuffix: '| Premium Audio',
    defaultDescription: 'Experience the ultimate in home audio and cinema.',
    defaultKeywords: 'audio, hifi, speakers, home theater, cinema focus',
    ogImage: '',
    googleVerification: '',
    bingVerification: '',
    headScripts: ''
  });

  // Product SEO States
  const [products, setProducts] = useState([]);
  const [productSeo, setProductSeo] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [brands, setBrands] = useState([]);
  
  // Active product editor state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editKeywords, setEditKeywords] = useState('');
  const [savingProduct, setSavingProduct] = useState(null);

  useEffect(() => {
    fetchSeoData();
    fetchProducts();
  }, []);

  const fetchSeoData = async () => {
    setLoading(true);
    try {
      // 1. Fetch site-wide SEO
      const { data: sitewideData } = await supabase
        .from('site_settings')
        .select('data')
        .eq('id', 'seo')
        .single();
        
      if (sitewideData) {
        setSeo(prev => ({ ...prev, ...sitewideData.data }));
      }

      // 2. Fetch per-product SEO overrides
      const { data: productSeoData } = await supabase
        .from('site_settings')
        .select('data')
        .eq('id', 'product_seo')
        .single();
        
      if (productSeoData) {
        setProductSeo(productSeoData.data || {});
      }
    } catch (error) {
      console.error("Error fetching SEO data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, brand, category, slug, short_description, images')
        .order('name', { ascending: true });
        
      if (data) {
        setProducts(data);
        const uniqueBrands = [...new Set(data.map(p => p.brand))].filter(Boolean);
        setBrands(uniqueBrands.sort());
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ id: 'seo', data: seo });

      if (error && error.code === 'PGRST205') {
        await supabase.from('site_content').upsert({ id: 'seo', data: seo });
      }

      await revalidateData('settings');
      setMessage('SEO settings updated!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error saving SEO data:", error);
      setMessage('Failed to save settings: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProductSeo = async (slug) => {
    if (!selectedProduct) return;
    setSavingProduct(slug);
    try {
      const updatedOverrides = {
        ...productSeo,
        [slug]: {
          title: editTitle.trim(),
          description: editDescription.trim(),
          keywords: editKeywords.trim()
        }
      };

      // Clean up empty records to save database space
      if (!editTitle.trim() && !editDescription.trim() && !editKeywords.trim()) {
        delete updatedOverrides[slug];
      }

      let { error } = await supabase
        .from('site_settings')
        .upsert({ id: 'product_seo', data: updatedOverrides });

      if (error && error.code === 'PGRST205') {
        const fallback = await supabase
          .from('site_content')
          .upsert({ id: 'product_seo', data: updatedOverrides });
        error = fallback.error;
      }

      if (error) throw error;

      setProductSeo(updatedOverrides);
      await revalidateData('settings');
      setMessage('Product SEO updated!');
      setTimeout(() => setMessage(''), 3000);
      setSelectedProduct(null); // Close editor
    } catch (error) {
      console.error("Error saving product SEO:", error);
      setMessage('Failed to save: ' + error.message);
    } finally {
      setSavingProduct(null);
    }
  };

  const handleEditProductClick = (product) => {
    setSelectedProduct(product);
    const custom = productSeo[product.slug] || {};
    setEditTitle(custom.title || '');
    setEditDescription(custom.description || '');
    setEditKeywords(custom.keywords || '');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSeo(prev => ({ ...prev, [name]: value }));
  };

  // Filtered Products
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand;
    return matchesSearch && matchesBrand;
  });

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto animate-fade-in pb-20 md:pb-8">
      <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h1 className="text-2xl md:text-3xl font-medium tracking-tight">SEO Settings</h1>
            <p className="text-muted-foreground mt-1 text-sm">Manage search engine optimization preferences.</p>
         </div>
      </header>

      {/* Tabs Menu */}
      <div className="flex border-b border-border mb-8 gap-2">
        <button
          onClick={() => setActiveTab('sitewide')}
          className={clsx(
            "px-6 py-3 font-medium text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2",
            activeTab === 'sitewide'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <Globe size={16} />
          Site-wide SEO
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={clsx(
            "px-6 py-3 font-medium text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2",
            activeTab === 'products'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <Sparkles size={16} />
          Per-Product SEO
        </button>
      </div>

      {/* SITE WIDE TAB */}
      {activeTab === 'sitewide' && (
        <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
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

          {/* Open Graph / Social Media */}
          <div className="bg-background border border-border rounded-2xl p-4 md:p-8 space-y-6">
             <h2 className="text-lg md:text-xl font-medium flex items-center gap-2">
               <Share2 size={20} className="text-primary"/> 
               Social Media (Open Graph)
             </h2>
             
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium mb-1 block">Default Share Image (OG Image)</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-secondary/10 p-4 rounded-xl border border-border/50">
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Image URL</label>
                        <input 
                          name="ogImage"
                          value={seo.ogImage} 
                          onChange={handleChange} 
                          className="w-full p-3 bg-background rounded-lg border border-border focus:border-primary outline-none text-sm" 
                          placeholder="https://cinemafocus.in/images/og-default.jpg" 
                        />
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        The absolute URL of the image displayed when sharing the site link on social media. 
                        You can paste an absolute URL here, or upload an image directly.
                      </p>
                      
                      {seo.ogImage && (
                        <div className="space-y-1.5">
                          <span className="text-xs font-semibold text-muted-foreground block">Preview</span>
                          <div className="aspect-[1.91/1] w-full bg-background rounded-lg overflow-hidden border border-border relative group">
                            <img src={seo.ogImage} alt="OG Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col justify-center">
                      <span className="text-xs font-semibold text-muted-foreground block mb-2">Upload Share Image</span>
                      <ImageUpload 
                        initialImage={seo.ogImage}
                        onUploadComplete={(url) => setSeo(prev => ({ ...prev, ogImage: url }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
          </div>

          {/* Advanced & Custom Ops */}
          <div className="bg-background border border-border rounded-2xl p-4 md:p-8 space-y-6">
             <h2 className="text-lg md:text-xl font-medium flex items-center gap-2">
               <Search size={20} className="text-primary"/> 
               Advanced & Custom Verification
             </h2>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-sm font-medium">Google Site Verification</label>
                 <input 
                   name="googleVerification"
                   value={seo.googleVerification || ''} 
                   onChange={handleChange} 
                   className="w-full p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none font-mono text-sm" 
                   placeholder="verification_code_here" 
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium">Bing Webmaster Verification</label>
                 <input 
                   name="bingVerification"
                   value={seo.bingVerification || ''} 
                   onChange={handleChange} 
                   className="w-full p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none font-mono text-sm" 
                   placeholder="verification_code_here" 
                 />
               </div>
             </div>

             <div className="space-y-2">
               <label className="text-sm font-medium">Custom Head Scripts</label>
               <textarea 
                 name="headScripts"
                 rows={4}
                 value={seo.headScripts || ''} 
                 onChange={handleChange} 
                 className="w-full p-3 bg-secondary/30 rounded-lg border border-border focus:border-primary outline-none font-mono text-xs" 
                 placeholder={`<script>\n  // Google Analytics or custom tracking\n</script>`}
               />
               <p className="text-xs text-muted-foreground">Scripts to inject into the {`<head>`} tag.</p>
             </div>
          </div>

          {/* Action Bar */}
          <div className="flex justify-end pt-4">
             <button 
               type="submit" 
               disabled={loading}
               className="w-full md:w-auto px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
             >
               {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
               Save SEO Settings
             </button>
          </div>
        </form>
      )}

      {/* PER PRODUCT SEO TAB */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* LEFT: Product Catalog Directory (3/5 cols if editing, 5/5 cols if idle) */}
          <div className={clsx(
            "space-y-6 transition-all duration-300",
            selectedProduct ? "lg:col-span-3" : "lg:col-span-5"
          )}>
            
            {/* Search & Filter Bar */}
            <div className="bg-background border border-border p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-center shadow-sm">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <input
                  type="text"
                  placeholder="Search products by name, brand or slug..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-secondary/20 rounded-lg border border-border text-sm outline-none focus:border-primary transition-all text-foreground"
                />
              </div>

              <div className="flex gap-2 w-full sm:w-auto flex-shrink-0">
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full sm:w-44 px-3 py-2.5 bg-secondary/20 border border-border rounded-lg text-sm outline-none focus:border-primary cursor-pointer text-foreground"
                >
                  <option value="all">All Brands</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>

                {searchQuery || selectedBrand !== 'all' ? (
                  <button 
                    onClick={() => { setSearchQuery(''); setSelectedBrand('all'); }}
                    className="p-2.5 border border-border bg-secondary/20 hover:bg-secondary/40 rounded-lg text-muted-foreground transition-colors cursor-pointer"
                    title="Clear Filters"
                  >
                    <X size={18} />
                  </button>
                ) : null}
              </div>
            </div>

            {/* Catalog Grid / List */}
            {loadingProducts ? (
              <div className="min-h-[200px] flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-background border border-border rounded-2xl p-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-3">
                <AlertCircle size={40} className="text-muted-foreground/60" />
                <p className="font-medium text-sm">No products match your search filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map(product => {
                  const hasCustomSeo = 
                    productSeo[product.slug]?.title || 
                    productSeo[product.slug]?.description || 
                    productSeo[product.slug]?.keywords;

                  const isSelected = selectedProduct?.slug === product.slug;

                  return (
                    <div 
                      key={product.id}
                      onClick={() => handleEditProductClick(product)}
                      className={clsx(
                        "bg-background border rounded-xl p-4 transition-all hover:border-primary cursor-pointer relative group flex flex-col justify-between h-44 shadow-sm",
                        isSelected ? "border-primary ring-1 ring-primary" : "border-border",
                        hasCustomSeo ? "bg-emerald-950/5 hover:bg-emerald-950/10" : ""
                      )}
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground bg-secondary/60 px-2 py-0.5 rounded border border-border/40 truncate max-w-[120px]">
                            {product.brand}
                          </span>
                          
                          {hasCustomSeo ? (
                            <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                              <CheckCircle2 size={10} /> Custom SEO
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full border border-border">
                              Default
                            </span>
                          )}
                        </div>

                        <h3 className="font-medium text-sm line-clamp-2 text-foreground group-hover:text-primary transition-colors leading-snug">
                          {product.name}
                        </h3>
                        <p className="text-[11px] text-muted-foreground mt-1 truncate">
                          slug: {product.slug}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-border/40 pt-2.5 mt-auto text-xs font-semibold text-muted-foreground">
                        <span className="truncate max-w-[130px] font-normal">{product.category}</span>
                        <span className="text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1">
                          Edit SEO <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: Live Google Preview & SEO Editor Panel (2/5 cols) */}
          {selectedProduct && (
            <div className="lg:col-span-2 space-y-6 animate-fade-in-up">
              
              {/* Sticky container for editor */}
              <div className="bg-background border border-border rounded-2xl p-4 md:p-6 space-y-6 sticky top-6 shadow-xl border-t-2 border-t-primary">
                
                {/* Header info */}
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="space-y-0.5">
                    <h2 className="text-md font-bold truncate max-w-[200px] text-foreground">{selectedProduct.name}</h2>
                    <p className="text-xs text-muted-foreground">Configure per-product meta tags</p>
                  </div>
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="p-1.5 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* yoast-style search snippet preview simulator */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Eye size={12} /> Google Search Simulator
                    </label>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl font-sans text-left space-y-1.5 shadow-inner">
                    <div className="text-[11px] text-neutral-400 flex items-center gap-1 truncate select-none">
                      <span>https://cinemafocus.in</span>
                      <span>›</span>
                      <span>products</span>
                      <span>›</span>
                      <span className="text-neutral-500 font-medium">{selectedProduct.slug}</span>
                    </div>
                    <div className="text-md text-blue-400 font-medium hover:underline cursor-pointer leading-tight truncate">
                      {editTitle.trim() || selectedProduct.name} {seo.titleSuffix}
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2 select-none">
                      {editDescription.trim() || selectedProduct.shortDescription || 'Please write a custom meta description for search engines.'}
                    </p>
                  </div>
                </div>

                {/* Form edit controls */}
                <div className="space-y-4 pt-2">
                  
                  {/* SEO TITLE INPUT */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-muted-foreground">SEO Title Override</span>
                    </div>
                    <input 
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder={selectedProduct.name}
                      className="w-full p-2.5 bg-secondary/30 border border-border rounded-lg outline-none focus:border-primary text-sm text-foreground"
                    />
                    
                    {/* Character recommendation meter */}
                    <div className="flex justify-between items-center text-[10px] mt-1 select-none">
                      <span className={clsx(
                        "font-medium",
                        editTitle.length >= 40 && editTitle.length <= 60 ? "text-emerald-400" : editTitle.length > 60 ? "text-amber-500" : "text-muted-foreground"
                      )}>
                        {editTitle.length} chars {editTitle.length >= 40 && editTitle.length <= 60 ? "(Excellent)" : editTitle.length > 60 ? "(Too Long)" : "(Recommended: 40-60)"}
                      </span>
                    </div>
                    <div className="w-full h-1 bg-secondary/50 rounded-full overflow-hidden mt-1 select-none">
                      <div 
                        className={clsx(
                          "h-full transition-all duration-300",
                          editTitle.length >= 40 && editTitle.length <= 60 ? "bg-emerald-500" : editTitle.length > 60 ? "bg-amber-500" : "bg-primary"
                        )}
                        style={{ width: `${Math.min(100, (editTitle.length / 60) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* META DESCRIPTION TEXTAREA */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-muted-foreground">Meta Description Override</span>
                    </div>
                    <textarea 
                      rows={3}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder={selectedProduct.shortDescription || 'Enter a short summary...'}
                      className="w-full p-2.5 bg-secondary/30 border border-border rounded-lg outline-none focus:border-primary text-sm text-foreground resize-none leading-relaxed"
                    />

                    {/* Character recommendation meter */}
                    <div className="flex justify-between items-center text-[10px] mt-1 select-none">
                      <span className={clsx(
                        "font-medium",
                        editDescription.length >= 120 && editDescription.length <= 160 ? "text-emerald-400" : editDescription.length > 160 ? "text-amber-500" : "text-muted-foreground"
                      )}>
                        {editDescription.length} chars {editDescription.length >= 120 && editDescription.length <= 160 ? "(Excellent)" : editDescription.length > 160 ? "(Too Long)" : "(Recommended: 120-160)"}
                      </span>
                    </div>
                    <div className="w-full h-1 bg-secondary/50 rounded-full overflow-hidden mt-1 select-none">
                      <div 
                        className={clsx(
                          "h-full transition-all duration-300",
                          editDescription.length >= 120 && editDescription.length <= 160 ? "bg-emerald-500" : editDescription.length > 160 ? "bg-amber-500" : "bg-primary"
                        )}
                        style={{ width: `${Math.min(100, (editDescription.length / 160) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* KEYWORDS INPUT */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Focus Keywords</label>
                    <input 
                      type="text"
                      value={editKeywords}
                      onChange={(e) => setEditKeywords(e.target.value)}
                      placeholder="e.g. speakers, premium, hi-fi, reference"
                      className="w-full p-2.5 bg-secondary/30 border border-border rounded-lg outline-none focus:border-primary text-sm text-foreground"
                    />
                    <p className="text-[10px] text-muted-foreground">Comma-separated tags indicating focus keywords.</p>
                  </div>
                </div>

                {/* Save/Cancel Operations */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
                    className="w-full py-2.5 border border-border hover:bg-secondary/40 text-sm font-semibold rounded-full cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveProductSeo(selectedProduct.slug)}
                    disabled={savingProduct === selectedProduct.slug}
                    className="w-full py-2.5 bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 text-sm font-semibold rounded-full flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    {savingProduct === selectedProduct.slug ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    Save SEO
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

      {/* Success Toast Notice */}
      {message && (
        <div className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg animate-fade-in-up flex items-center gap-2 z-50 select-none">
          <CheckCircle2 size={18} />
          {message}
        </div>
      )}
    </div>
  );
}
