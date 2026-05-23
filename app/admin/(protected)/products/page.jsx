"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Plus, Edit, Trash2, Upload, X, Check, Loader2, AlertCircle, CheckSquare, Square, Search } from 'lucide-react';
import { revalidateData } from '@/lib/actions';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  
  // Bulk Import States
  const [showImportModal, setShowImportModal] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0, status: '' });
  const [importLogs, setImportLogs] = useState([]);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Bulk Edit States
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [bulkEditing, setBulkEditing] = useState(false);
  const [bulkEditFields, setBulkEditFields] = useState({
    updateBrand: false,
    updateCategory: false,
    updatePrice: false,
  });
  const [bulkEditData, setBulkEditData] = useState({
    brand: '',
    category: '',
    price: '',
  });
  const [categories, setCategories] = useState([]);

  const supabase = createClient();

  const filteredProducts = products.filter(product => {
    const search = searchTerm.toLowerCase();
    return (
      product.name?.toLowerCase().includes(search) ||
      product.brand?.toLowerCase().includes(search) ||
      product.category?.toLowerCase().includes(search)
    );
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        setProducts(products.filter((p) => p.id !== id));
        
        try {
          await revalidateData('products');
        } catch (err) {
          console.warn("Revalidation skipped:", err);
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product: " + error.message);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.size} product${selectedIds.size > 1 ? 's' : ''}? This cannot be undone.`)) return;

    setBulkDeleting(true);
    try {
      const ids = Array.from(selectedIds);
      const { error } = await supabase
        .from('products')
        .delete()
        .in('id', ids);

      if (error) throw error;

      setProducts(prev => prev.filter(p => !selectedIds.has(p.id)));
      setSelectedIds(new Set());

      try {
        await revalidateData('products');
      } catch (err) {
        console.warn('Revalidation skipped:', err);
      }
    } catch (error) {
      console.error('Error bulk deleting products:', error);
      alert('Failed to delete products: ' + error.message);
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleBulkEdit = async (e) => {
    e.preventDefault();
    if (selectedIds.size === 0) return;
    
    if (!bulkEditFields.updateBrand && !bulkEditFields.updateCategory && !bulkEditFields.updatePrice) {
      alert("Please select at least one field to update.");
      return;
    }

    setBulkEditing(true);
    try {
      const payload = {};
      if (bulkEditFields.updateBrand) {
        payload.brand = bulkEditData.brand.trim();
      }
      if (bulkEditFields.updateCategory) {
        payload.category = bulkEditData.category.trim();
      }
      if (bulkEditFields.updatePrice) {
        payload.price = bulkEditData.price === '' ? null : Number(bulkEditData.price);
      }

      const ids = Array.from(selectedIds);
      const { error } = await supabase
        .from('products')
        .update(payload)
        .in('id', ids);

      if (error) throw error;

      // Update local state
      setProducts(prev => prev.map(p => {
        if (selectedIds.has(p.id)) {
          return {
            ...p,
            ...payload
          };
        }
        return p;
      }));

      setSelectedIds(new Set());
      setShowBulkEditModal(false);
      setBulkEditFields({ updateBrand: false, updateCategory: false, updatePrice: false });
      setBulkEditData({ brand: '', category: '', price: '' });
      alert("Successfully updated selected products.");

      try {
        await revalidateData('products');
      } catch (err) {
        console.warn('Revalidation skipped:', err);
      }
    } catch (error) {
      console.error('Error bulk updating products:', error);
      alert('Failed to update products: ' + error.message);
    } finally {
      setBulkEditing(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const allSelected = filteredProducts.length > 0 && selectedIds.size === filteredProducts.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  // Drag and Drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processJsonFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processJsonFile(e.target.files[0]);
    }
  };

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setImportLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const processJsonFile = async (file) => {
    if (file.type !== "application/json" && !file.name.endsWith('.json')) {
      setImportError("Please upload a valid JSON file (.json)");
      return;
    }

    setImportError('');
    setImporting(true);
    setImportSuccess(false);
    setImportLogs([]);
    addLog(`Reading file: ${file.name}`);

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!Array.isArray(data)) {
        throw new Error("Invalid format: The file must contain a JSON Array of products.");
      }

      addLog(`Loaded ${data.length} products to import. Validating schema...`);

      // Check required fields
      const sample = data[0];
      if (sample && (!sample.name && !sample.title)) {
        throw new Error("Invalid schema: Products must have a 'name' or 'title' field.");
      }

      // Start the batch insertion process
      await runImport(data);

    } catch (err) {
      console.error(err);
      setImportError(err.message || "Failed to parse JSON file.");
      setImporting(false);
    }
  };

  const runImport = async (importProducts) => {
    try {
      // 1. Ensure categories exist first to prevent foreign key errors
      addLog("Checking active database categories...");
      const { data: dbCategories, error: catFetchError } = await supabase
        .from('categories')
        .select('slug');
      
      if (catFetchError) throw catFetchError;

      const dbCategorySlugs = new Set((dbCategories || []).map(c => c.slug));
      const requiredCategories = new Set(importProducts.map(p => p.category).filter(Boolean));
      const missingCategories = Array.from(requiredCategories).filter(c => !dbCategorySlugs.has(c));

      if (missingCategories.length > 0) {
        addLog(`Found ${missingCategories.length} missing brands: ${missingCategories.join(', ')}`);
        addLog("Automatically seeding missing brands...");

        for (const catSlug of missingCategories) {
          const catName = catSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          const { error: catInsertError } = await supabase
            .from('categories')
            .upsert({
              id: catSlug,
              slug: catSlug,
              name: catName,
              description: `Premium ${catName} collections selected for the highest acoustic performance.`,
              image_url: 'https://placehold.co/600x400?text=' + encodeURIComponent(catName),
              featured: false
            });
          
          if (catInsertError) {
            addLog(`⚠️ Warning: Failed to seed category ${catSlug}: ${catInsertError.message}`);
          } else {
            addLog(`✔ Seeded category: ${catSlug}`);
          }
        }
      }

      // 2. Import Products
      const total = importProducts.length;
      setImportProgress({ current: 0, total, status: 'Starting import...' });

      // Import products one by one for beautiful live visual updates
      for (let i = 0; i < total; i++) {
        const prod = importProducts[i];
        
        // Map keys correctly to snake_case schema for Supabase
        const mappedProduct = {
          id: prod.id || prod.slug,
          name: prod.name || prod.title,
          slug: prod.slug,
          brand: prod.brand || 'Other',
          price: Number(prod.price || 0),
          category: prod.category || 'floorstanding-speakers',
          short_description: prod.shortDescription || prod.short_description || '',
          long_description: prod.longDescription || prod.long_description || '',
          featured: prod.featured || false,
          images: prod.images || [],
          specifications: prod.specifications || []
        };

        setImportProgress({
          current: i + 1,
          total,
          status: `Uploading: ${mappedProduct.name} (${i + 1}/${total})`
        });

        const { error: prodInsertError } = await supabase
          .from('products')
          .upsert(mappedProduct);

        if (prodInsertError) {
          addLog(`✘ Failed to import product: ${mappedProduct.name} - ${prodInsertError.message}`);
        } else {
          addLog(`✔ Imported: ${mappedProduct.name}`);
        }
      }

      // 3. Complete and Refresh
      addLog("Import process complete! Revalidating cache tags...");
      
      try {
        await revalidateData('products');
        await revalidateData('categories');
      } catch (err) {
        console.warn("Revalidation warning:", err);
      }

      addLog("Successfully synced database inventory.");
      setImportSuccess(true);
      fetchProducts();

    } catch (err) {
      console.error(err);
      setImportError(err.message || "An unexpected error occurred during import.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-fade-in pb-20 md:pb-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-8 md:mb-10">
        <div>
           <h1 className="text-2xl md:text-3xl font-medium tracking-tight">Products</h1>
           <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage your inventory.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button 
            onClick={() => {
              setImportError('');
              setImportSuccess(false);
              setImportLogs([]);
              setImporting(false);
              setShowImportModal(true);
            }} 
            className="flex items-center gap-2 px-6 py-2.5 border border-border bg-background hover:bg-secondary/30 text-foreground rounded-full font-medium transition-colors justify-center cursor-pointer"
          >
            <Upload size={18} className="text-primary" />
            Import JSON
          </button>
          <Link href="/admin/products/new" className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity justify-center">
            <Plus size={18} />
            Add Product
          </Link>
        </div>
      </header>

      {/* Bulk Action Toolbar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 px-6 py-3 bg-background border border-border rounded-2xl shadow-2xl animate-fade-in">
          <span className="text-sm font-medium text-foreground">
            <span className="text-primary font-semibold">{selectedIds.size}</span> product{selectedIds.size > 1 ? 's' : ''} selected
          </span>
          <div className="w-px h-5 bg-border" />
          <button
            onClick={() => setSelectedIds(new Set())}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer mr-1"
          >
            Deselect all
          </button>
          <button
            onClick={() => {
              setBulkEditFields({ updateBrand: false, updateCategory: false, updatePrice: false });
              setBulkEditData({ brand: '', category: '', price: '' });
              setShowBulkEditModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-full text-xs font-semibold transition-colors cursor-pointer"
          >
            <Edit size={12} className="text-primary" />
            Bulk Edit
          </button>
          <button
            onClick={handleBulkDelete}
            disabled={bulkDeleting}
            className="flex items-center gap-2 px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-medium transition-colors disabled:opacity-60 cursor-pointer"
          >
            {bulkDeleting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
            {bulkDeleting ? 'Deleting…' : `Delete ${selectedIds.size}`}
          </button>
        </div>
      )}

      <div className="mb-6 max-w-md relative">
        <Search className="absolute left-3.5 top-3 text-muted-foreground w-4 h-4" />
        <input
          type="text"
          placeholder="Search products by name, brand, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-border/80 bg-background/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60 shadow-sm"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-3 p-0.5 rounded-full hover:bg-secondary/85 text-muted-foreground transition-colors cursor-pointer"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">Loading products...</div>
      ) : (
        <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="p-4 w-10">
                    <button
                      onClick={toggleSelectAll}
                      className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                      title={allSelected ? 'Deselect all' : 'Select all'}
                    >
                      {allSelected ? (
                        <CheckSquare size={17} className="text-primary" />
                      ) : someSelected ? (
                        <div className="w-[17px] h-[17px] border-2 border-primary rounded-sm flex items-center justify-center">
                          <div className="w-2 h-0.5 bg-primary rounded-full" />
                        </div>
                      ) : (
                        <Square size={17} />
                      )}
                    </button>
                  </th>
                  <th className="p-4 font-medium text-sm text-muted-foreground">Image</th>
                  <th className="p-4 font-medium text-sm text-muted-foreground">Name</th>
                  <th className="p-4 font-medium text-sm text-muted-foreground">Brand</th>
                  <th className="p-4 font-medium text-sm text-muted-foreground">Brand Category</th>
                  <th className="p-4 font-medium text-sm text-muted-foreground">Price</th>
                  <th className="p-4 font-medium text-sm text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.map((product) => {
                  const isChecked = selectedIds.has(product.id);
                  return (
                    <tr
                      key={product.id}
                      className={`hover:bg-secondary/20 transition-colors ${isChecked ? 'bg-primary/5' : ''}`}
                    >
                      <td className="p-4">
                        <button
                          onClick={() => toggleSelect(product.id)}
                          className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                        >
                          {isChecked ? (
                            <CheckSquare size={17} className="text-primary" />
                          ) : (
                            <Square size={17} />
                          )}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="w-12 h-12 rounded-lg bg-secondary overflow-hidden">
                          {product.images && product.images[0] && (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-medium">{product.name}</td>
                      <td className="p-4 text-muted-foreground">{product.brand}</td>
                      <td className="p-4 text-muted-foreground text-sm capitalize">{product.category?.replace('-', ' ')}</td>
                      <td className="p-4 font-medium">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price || 0)}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/products/edit/${product.id}`} className="p-2 text-muted-foreground hover:text-primary hover:bg-secondary rounded-lg transition-colors">
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-12 text-center text-muted-foreground font-light italic">
                      {searchTerm ? 'No products match your search. Try adjusting your query.' : 'No products found. Add your first one to get started.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-background rounded-2xl w-full max-w-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/30">
               <div>
                 <h2 className="text-xl font-medium flex items-center gap-2">
                   <Upload className="text-primary" size={20} />
                   Bulk Product Import
                 </h2>
                 <p className="text-xs text-muted-foreground mt-0.5">Upload database-compatible JSON files in one click.</p>
               </div>
               <button 
                 onClick={() => {
                   if (!importing) setShowImportModal(false);
                 }} 
                 className="text-muted-foreground hover:text-foreground p-1 hover:bg-secondary rounded-full transition-colors cursor-pointer"
                 disabled={importing}
               >
                 <X size={20} />
               </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {!importing && !importSuccess && (
                <div 
                  className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ${
                    dragActive ? 'border-primary bg-primary/5 scale-[0.99]' : 'border-border bg-secondary/10 hover:border-primary/50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input 
                    type="file" 
                    accept=".json,application/json" 
                    onChange={handleFileChange} 
                    className="hidden" 
                    id="json-file-upload" 
                  />
                  <label htmlFor="json-file-upload" className="cursor-pointer flex flex-col items-center gap-4">
                     <div className="p-5 bg-background rounded-full shadow-md border border-border group-hover:scale-110 transition-transform">
                       <Upload size={32} className="text-primary animate-pulse" />
                     </div>
                     <div>
                       <span className="font-medium text-base block">Drag & drop your product JSON file here</span>
                       <span className="text-sm text-muted-foreground block mt-1">or click to browse from files</span>
                     </div>
                     <span className="text-xs px-3 py-1 bg-secondary rounded-full text-muted-foreground font-mono">supabase_products.json</span>
                  </label>
                </div>
              )}

              {/* Progress Panel */}
              {(importing || importProgress.current > 0) && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-primary animate-pulse font-medium">{importProgress.status}</span>
                    <span className="text-muted-foreground font-mono">
                      {Math.round((importProgress.current / importProgress.total) * 100)}% ({importProgress.current}/{importProgress.total})
                    </span>
                  </div>
                  
                  {/* Progress Bar Container */}
                  <div className="w-full bg-secondary h-3 rounded-full overflow-hidden border border-border/30 relative">
                    <div 
                      className="bg-primary h-full rounded-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(var(--color-primary),0.5)]"
                      style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Real-time Activity Log Terminal Console */}
              {importLogs.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Console Logs</span>
                  <div className="w-full bg-black/95 text-green-400 font-mono text-xs rounded-xl p-4 h-48 overflow-y-auto border border-border shadow-inner leading-relaxed">
                    {importLogs.map((log, idx) => (
                      <div key={idx} className="whitespace-pre-wrap">{log}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Success Panel */}
              {importSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-6 rounded-2xl flex flex-col items-center gap-3 text-center animate-fade-in">
                  <div className="p-3 bg-emerald-500/25 rounded-full text-emerald-400 animate-bounce">
                    <Check size={32} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Import Completed Successfully!</h3>
                    <p className="text-sm text-emerald-400/80 mt-1">All {importProgress.total} products and their brands are fully synced in the database.</p>
                  </div>
                </div>
              )}

              {/* Error Alert */}
              {importError && (
                <div className="bg-red-500/10 border border-red-500/25 text-red-400 p-4 rounded-xl flex gap-3 items-start animate-fade-in">
                  <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">Failed to import products</h4>
                    <p className="text-xs text-red-400/90 mt-1">{importError}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-border flex justify-end gap-3 bg-secondary/30">
               <button 
                 onClick={() => setShowImportModal(false)}
                 disabled={importing}
                 className="px-6 py-2.5 text-muted-foreground hover:bg-secondary rounded-full font-medium transition-colors cursor-pointer disabled:opacity-50"
               >
                 {importSuccess ? 'Close Panel' : 'Cancel'}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Product Edit Modal */}
      {showBulkEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <form 
            onSubmit={handleBulkEdit}
            className="bg-background rounded-2xl w-full max-w-lg shadow-2xl border border-border overflow-hidden flex flex-col max-h-[85vh] animate-scale-up"
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/30">
               <div>
                 <h2 className="text-xl font-medium flex items-center gap-2 text-foreground">
                   <Edit className="text-primary" size={20} />
                   Bulk Edit Products
                 </h2>
                 <p className="text-xs text-muted-foreground mt-0.5">
                   Applying changes to <span className="text-primary font-semibold">{selectedIds.size}</span> selected products.
                 </p>
               </div>
               <button 
                 type="button"
                 onClick={() => {
                   if (!bulkEditing) setShowBulkEditModal(false);
                 }} 
                 className="text-muted-foreground hover:text-foreground p-1 hover:bg-secondary rounded-full transition-colors cursor-pointer"
                 disabled={bulkEditing}
               >
                 <X size={20} />
               </button>
            </div>

            {/* Fields List */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              
              {/* Brand Upgrade */}
              <div className="p-4 border border-border rounded-2xl bg-secondary/15 space-y-3 transition-colors hover:border-border/80">
                <label className="flex items-center gap-2.5 font-medium text-sm text-foreground cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={bulkEditFields.updateBrand} 
                    onChange={e => setBulkEditFields(prev => ({ ...prev, updateBrand: e.target.checked }))} 
                    className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer" 
                  />
                  <span>Update Brand</span>
                </label>
                {bulkEditFields.updateBrand && (
                  <input 
                    type="text" 
                    required 
                    value={bulkEditData.brand} 
                    onChange={e => setBulkEditData(prev => ({ ...prev, brand: e.target.value }))} 
                    className="w-full p-2.5 bg-background border border-border rounded-xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60 shadow-sm animate-fade-in" 
                    placeholder="e.g. McIntosh" 
                  />
                )}
              </div>

              {/* Brand Category Upgrade */}
              <div className="p-4 border border-border rounded-2xl bg-secondary/15 space-y-3 transition-colors hover:border-border/80">
                <label className="flex items-center gap-2.5 font-medium text-sm text-foreground cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={bulkEditFields.updateCategory} 
                    onChange={e => setBulkEditFields(prev => ({ ...prev, updateCategory: e.target.checked }))} 
                    className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer" 
                  />
                  <span>Update Brand Category</span>
                </label>
                {bulkEditFields.updateCategory && (
                  <select 
                    required 
                    value={bulkEditData.category} 
                    onChange={e => setBulkEditData(prev => ({ ...prev, category: e.target.value }))} 
                    className="w-full p-2.5 bg-background border border-border rounded-xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-foreground cursor-pointer animate-fade-in"
                  >
                    <option value="">Select Brand Category</option>
                    {categories.map(cat => (
                      <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Price Upgrade */}
              <div className="p-4 border border-border rounded-2xl bg-secondary/15 space-y-3 transition-colors hover:border-border/80">
                <label className="flex items-center gap-2.5 font-medium text-sm text-foreground cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={bulkEditFields.updatePrice} 
                    onChange={e => setBulkEditFields(prev => ({ ...prev, updatePrice: e.target.checked }))} 
                    className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer" 
                  />
                  <span>
                    Update Price <span className="text-xs font-normal text-muted-foreground ml-1">(Optional - Keep blank for Call for Price)</span>
                  </span>
                </label>
                {bulkEditFields.updatePrice && (
                  <div className="relative animate-fade-in">
                    <span className="absolute left-3.5 top-2.5 text-xs text-muted-foreground font-mono">INR</span>
                    <input 
                      type="number" 
                      step="any"
                      value={bulkEditData.price} 
                      onChange={e => setBulkEditData(prev => ({ ...prev, price: e.target.value }))} 
                      className="w-full pl-14 pr-4 p-2.5 bg-background border border-border rounded-xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60 shadow-sm" 
                      placeholder="e.g. 1250" 
                    />
                  </div>
                )}
              </div>

            </div>

            {/* Actions Footer */}
            <div className="p-6 border-t border-border flex justify-end gap-3 bg-secondary/30">
               <button 
                 type="button"
                 onClick={() => setShowBulkEditModal(false)}
                 disabled={bulkEditing}
                 className="px-6 py-2.5 text-muted-foreground hover:bg-secondary rounded-full font-medium transition-colors cursor-pointer disabled:opacity-50 text-sm"
               >
                 Cancel
               </button>
               <button 
                 type="submit"
                 disabled={bulkEditing}
                 className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
               >
                 {bulkEditing && <Loader2 size={16} className="animate-spin" />}
                 {bulkEditing ? 'Updating...' : `Save Bulk Changes`}
               </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

