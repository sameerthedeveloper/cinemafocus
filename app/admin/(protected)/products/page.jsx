"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/aws/queryClient';
import Link from 'next/link';
import { Plus, Edit, Trash2, Upload, X, Check, Loader2, AlertCircle, CheckSquare, Square, Search, Eye, EyeOff } from 'lucide-react';
import { revalidateData } from '@/lib/actions';
import Reveal from '@/components/Reveal';
import { readZip } from '@/lib/zipReader';
import { baseName, isImageFile, mimeFor, pickProductsFile, productsFromJson, normalizeProduct, matchImages } from '@/lib/productImport';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [bulkToggling, setBulkToggling] = useState(false);
  
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
    updateNewArrival: false,
  });
  const [bulkEditData, setBulkEditData] = useState({
    brand: '',
    category: '',
    price: '',
    newArrival: 'add',
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
    
    if (!bulkEditFields.updateBrand && !bulkEditFields.updateCategory && !bulkEditFields.updatePrice && !bulkEditFields.updateNewArrival) {
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
      if (Object.keys(payload).length > 0) {
        const { error } = await supabase
          .from('products')
          .update(payload)
          .in('id', ids);

        if (error) throw error;
      }

      // New arrival: add the selected products to, or remove them from, the New Arrivals list
      let arrivalNote = '';
      if (bulkEditFields.updateNewArrival) {
        const chosen = products.filter((p) => selectedIds.has(p.id));
        if (bulkEditData.newArrival === 'add') {
          const eligible = chosen.filter((p) => p.slug);
          const rows = eligible.map((p) => ({
            id: p.slug, // same slug = same entry, so adding twice never duplicates
            name: p.name,
            brand: p.brand,
            price: Number(p.price) || 0,
            slug: p.slug,
            category: p.category,
            short_description: p.short_description || '',
            images: p.images || [],
            featured: true,
            original_product_id: p.id,
            originalProductId: p.id,
            created_at: new Date().toISOString(),
          }));
          if (rows.length > 0) {
            const { error: addError } = await supabase.from('new_launches').upsert(rows);
            if (addError) throw addError;
          }
          arrivalNote = `${rows.length} added to new arrivals` + (chosen.length > rows.length ? `, ${chosen.length - rows.length} skipped (no slug: open the product and Save once)` : '');
        } else {
          const slugs = new Set(chosen.map((p) => p.slug).filter(Boolean));
          const { data: launches, error: listError } = await supabase.from('new_launches').select('*');
          if (listError) throw listError;
          const launchIds = (launches || []).filter((l) => slugs.has(l.slug) || chosen.some((p) => p.id === l.original_product_id)).map((l) => l.id);
          if (launchIds.length > 0) {
            const { error: delError } = await supabase.from('new_launches').delete().in('id', launchIds);
            if (delError) throw delError;
          }
          arrivalNote = `${launchIds.length} removed from new arrivals`;
        }
      }

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
      setBulkEditFields({ updateBrand: false, updateCategory: false, updatePrice: false, updateNewArrival: false });
      setBulkEditData({ brand: '', category: '', price: '', newArrival: 'add' });
      alert("Successfully updated selected products." + (arrivalNote ? `\n${arrivalNote}.` : ''));

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

  const handleToggleActive = async (id, currentValue) => {
    const newValue = currentValue === false ? true : false;
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: newValue })
        .eq('id', id);
      if (error) throw error;
      setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: newValue } : p));
      try { await revalidateData('products'); } catch (e) { console.warn('Revalidation skipped:', e); }
    } catch (error) {
      alert('Failed to update product: ' + error.message);
    }
  };

  const handleBulkToggleActive = async (targetValue) => {
    if (selectedIds.size === 0) return;
    setBulkToggling(true);
    try {
      const ids = Array.from(selectedIds);
      const { error } = await supabase
        .from('products')
        .update({ is_active: targetValue })
        .in('id', ids);
      if (error) throw error;
      setProducts(prev => prev.map(p => selectedIds.has(p.id) ? { ...p, is_active: targetValue } : p));
      setSelectedIds(new Set());
      try { await revalidateData('products'); } catch (e) { console.warn('Revalidation skipped:', e); }
    } catch (error) {
      alert('Failed to update products: ' + error.message);
    } finally {
      setBulkToggling(false);
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
      processImportFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processImportFile(e.target.files[0]);
      e.target.value = ''; // allow choosing the same file again
    }
  };

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setImportLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const processImportFile = (file) => {
    if (/\.zip$/i.test(file.name) || file.type === 'application/zip' || file.type === 'application/x-zip-compressed') {
      return processZipFile(file);
    }
    return processJsonFile(file);
  };

  // ZIP import: a products .json plus the product images. Each image is uploaded through the
  // same optimizing upload route as the product editor, then the products are imported with
  // their new image URLs.
  const processZipFile = async (file) => {
    setImportError('');
    setImporting(true);
    setImportSuccess(false);
    setImportLogs([]);
    setImportProgress({ current: 0, total: 0, status: 'Reading ZIP...' });
    addLog(`Reading file: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB)`);

    try {
      const entries = await readZip(await file.arrayBuffer());
      const jsonEntry = pickProductsFile(entries);
      if (!jsonEntry) throw new Error('No .json file found in the ZIP. Add a products.json next to an images folder.');

      const rawProducts = productsFromJson(JSON.parse(new TextDecoder().decode(await jsonEntry.read())));
      const zipImages = entries.filter((e) => isImageFile(e.name));
      addLog(`Found ${rawProducts.length} products in ${jsonEntry.name} and ${zipImages.length} images.`);

      // Work out which images each product needs
      const plan = rawProducts.map((raw) => {
        const product = normalizeProduct(raw);
        return { product, ...matchImages(product, zipImages) };
      });
      plan.forEach(({ product, missing, files }) => {
        if (missing.length && files.length === 0) addLog(`⚠️ ${product.name}: no image file found in the ZIP (looked for ${missing.map(baseName).join(', ')}).`);
      });

      const toUpload = [...new Map(plan.flatMap((p) => p.files).map((f) => [f.name, f])).values()];
      const urlByFile = new Map();
      const usedNames = new Set();

      for (let i = 0; i < toUpload.length; i++) {
        const entry = toUpload[i];
        setImportProgress({ current: i, total: toUpload.length, status: `Uploading image ${i + 1}/${toUpload.length}: ${baseName(entry.name)}` });
        try {
          let name = baseName(entry.name);
          while (usedNames.has(name.toLowerCase())) name = `${i}-${name}`; // same file name in two folders
          usedNames.add(name.toLowerCase());
          const bytes = await entry.read();
          const upload = new File([bytes], name, { type: mimeFor(name) });
          const path = `products/${name}`;
          const { error: upErr } = await supabase.storage.from('images').upload(path, upload);
          if (upErr) throw new Error(upErr.message || 'upload failed');
          const { data: pub } = supabase.storage.from('images').getPublicUrl(path);
          urlByFile.set(entry.name, pub.publicUrl);
          addLog(`✔ Uploaded ${name}`);
        } catch (err) {
          addLog(`✘ Could not upload ${baseName(entry.name)}: ${err.message}`);
        }
      }

      const products = plan.map(({ product, urls, files }) => ({
        ...product,
        images: [...urls, ...files.map((f) => urlByFile.get(f.name)).filter(Boolean)],
      }));

      addLog(`Uploaded ${urlByFile.size} of ${toUpload.length} images. Importing products...`);
      await runImport(products);
    } catch (err) {
      console.error(err);
      setImportError(err.message || 'Failed to read the ZIP file.');
      setImporting(false);
    }
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
          specifications: prod.specifications || [],
          // Keep these when the file is a backup/export, so restoring does not un-hide hidden
          // products or reset dates (only copied when present)
          ...Object.fromEntries(
            ['is_active', 'created_at', 'updated_at', 'seo_title', 'seo_description', 'canonical_slug', 'seo_noindex', 'price_verified']
              .filter((k) => prod[k] !== undefined)
              .map((k) => [k, prod[k]])
          ),
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
    <Reveal className="p-4 md:p-8 max-w-7xl mx-auto animate-fade-in pb-20 md:pb-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-8 md:mb-10">
        <div>
           <h1 className="text-2xl md:text-3xl font-medium tracking-tight">Products</h1>
           <p className="text-muted-foreground mt-1 text-sm md:text-base">{loading ? 'Manage your inventory.' : `${products.length} product${products.length === 1 ? '' : 's'} in your inventory.`}</p>
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
            className="flex h-11 items-center gap-2 px-6 bg-secondary hover:bg-accent text-foreground rounded-full text-sm font-medium tracking-tight transition-colors justify-center cursor-pointer"
          >
            <Upload size={16} />
            Import products
          </button>
          <Link href="/admin/products/new" className="flex h-11 items-center gap-2 px-6 bg-primary text-primary-foreground rounded-full text-sm font-medium tracking-tight hover:bg-primary/90 transition-colors justify-center">
            <Plus size={16} />
            Add product
          </Link>
        </div>
      </header>

      {/* Bulk Action Toolbar */}
      {selectedIds.size > 0 && (
        <Reveal className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 px-6 py-3 bg-background border border-border rounded-full shadow-float animate-fade-in max-w-[calc(100vw-2rem)] flex-wrap justify-center">
          <span className="text-sm font-medium text-foreground">
            <span className="font-semibold">{selectedIds.size}</span> product{selectedIds.size > 1 ? 's' : ''} selected
          </span>
          <div className="w-px h-5 bg-border" />
          <button
            onClick={() => setSelectedIds(new Set())}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer mr-1"
          >
            Deselect all
          </button>
          <button
            onClick={() => handleBulkToggleActive(false)}
            disabled={bulkToggling}
            className="flex items-center gap-1.5 px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-full text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            {bulkToggling ? <Loader2 size={12} className="animate-spin" /> : <EyeOff size={12} />}
            Disable
          </button>
          <button
            onClick={() => handleBulkToggleActive(true)}
            disabled={bulkToggling}
            className="flex items-center gap-1.5 px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-full text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            {bulkToggling ? <Loader2 size={12} className="animate-spin" /> : <Eye size={12} />}
            Enable
          </button>
          <button
            onClick={() => {
              setBulkEditFields({ updateBrand: false, updateCategory: false, updatePrice: false, updateNewArrival: false });
              setBulkEditData({ brand: '', category: '', price: '' });
              setShowBulkEditModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-full text-xs font-semibold transition-colors cursor-pointer"
          >
            <Edit size={12} />
            Bulk edit
          </button>
          <button
            onClick={handleBulkDelete}
            disabled={bulkDeleting}
            className="flex items-center gap-2 px-5 py-2 bg-danger hover:bg-danger/90 text-white rounded-full text-sm font-medium transition-colors disabled:opacity-60 cursor-pointer"
          >
            {bulkDeleting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
            {bulkDeleting ? 'Deleting…' : `Delete ${selectedIds.size}`}
          </button>
        </Reveal>
      )}

      <div className="mb-6 max-w-md relative">
        <Search className="absolute left-4 top-3.5 text-muted-foreground w-4 h-4" />
        <input
          type="text"
          placeholder="Search by name, brand or category"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-11 w-full pl-11 pr-10 text-sm rounded-full border border-transparent bg-secondary outline-none focus:border-foreground focus:bg-background transition-colors placeholder:text-muted-foreground"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3.5 top-3.5 p-0.5 rounded-full hover:bg-secondary/85 text-muted-foreground transition-colors cursor-pointer"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {loading ? (
        <div className="rounded-card border border-border py-20 text-center text-muted-foreground">Loading products…</div>
      ) : (
        <div className="bg-background rounded-card border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-secondary">
                  <th className="px-4 py-3.5 w-10">
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
                  <th className="px-4 py-3.5 font-medium text-xs text-muted-foreground">Image</th>
                  <th className="px-4 py-3.5 font-medium text-xs text-muted-foreground">Name</th>
                  <th className="px-4 py-3.5 font-medium text-xs text-muted-foreground">Brand</th>
                  <th className="px-4 py-3.5 font-medium text-xs text-muted-foreground">Brand category</th>
                  <th className="px-4 py-3.5 font-medium text-xs text-muted-foreground">Price</th>
                  <th className="px-4 py-3.5 font-medium text-xs text-muted-foreground">Status</th>
                  <th className="px-4 py-3.5 font-medium text-xs text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.map((product) => {
                  const isChecked = selectedIds.has(product.id);
                  return (
                    <tr
                      key={product.id}
                      className={`hover:bg-secondary/50 transition-colors ${isChecked ? 'bg-secondary' : ''}`}
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
                        <div className="w-14 h-14 rounded-media bg-secondary overflow-hidden">
                          {product.images && product.images[0] && (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain mix-blend-multiply p-1" />
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-medium tracking-tight">{product.name}</td>
                      <td className="p-4 text-muted-foreground">{product.brand}</td>
                      <td className="p-4 text-muted-foreground text-sm capitalize">{product.category?.replace('-', ' ')}</td>
                      <td className="p-4 font-medium">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price || 0)}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleActive(product.id, product.is_active)}
                          title={product.is_active === false ? 'Enable product' : 'Disable product'}
                          className="cursor-pointer"
                        >
                          {product.is_active === false ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-border text-muted-foreground hover:bg-secondary transition-colors">
                              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" aria-hidden="true" /> Disabled
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-secondary text-foreground hover:bg-accent transition-colors">
                              <span className="h-1.5 w-1.5 rounded-full bg-foreground" aria-hidden="true" /> Active
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/products/edit/${product.id}`} className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors" aria-label={`Edit ${product.name}`}>
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2.5 text-muted-foreground hover:text-danger hover:bg-secondary rounded-full transition-colors" aria-label={`Delete ${product.name}`}
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
                    <td colSpan="8" className="p-12 text-center text-muted-foreground ">
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
        <Reveal className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
          <div className="bg-background rounded-card w-full max-w-2xl shadow-float border border-border overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-border flex justify-between items-center">
               <div>
                 <h2 className="text-xl font-medium flex items-center gap-2">
                   Import products
                 </h2>
                 <p className="text-xs text-muted-foreground mt-0.5">Import a JSON file, or a ZIP with the JSON and its product images.</p>
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
                  className={`border-2 border-dashed rounded-card p-10 text-center transition-all duration-300 ${
                    dragActive ? 'border-foreground bg-secondary' : 'border-border bg-background hover:border-foreground/40'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input 
                    type="file" 
                    accept=".json,.zip,application/json,application/zip" 
                    onChange={handleFileChange} 
                    className="hidden" 
                    id="json-file-upload" 
                  />
                  <label htmlFor="json-file-upload" className="cursor-pointer flex flex-col items-center gap-4">
                     <div className="p-5 bg-secondary rounded-full">
                       <Upload size={28} />
                     </div>
                     <div>
                       <span className="font-medium text-base block">Drag & drop a product JSON or ZIP file here</span>
                       <span className="text-sm text-muted-foreground block mt-1">or click to browse from files</span>
                     </div>
                     <span className="text-xs px-3 py-1 bg-secondary rounded-full text-muted-foreground">products.json &middot; products.zip</span>
                  </label>
                </div>
              )}

              {!importing && !importSuccess && (
                <details className="rounded-media border border-border p-4 text-sm">
                  <summary className="cursor-pointer font-medium">How to prepare a ZIP with images</summary>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-xs text-muted-foreground">
                    <li>Put a <code>products.json</code> and your pictures in one ZIP (folders are fine, e.g. an <code>images</code> folder).</li>
                    <li>In the JSON, list file names under <code>images</code>, for example <code>&quot;images&quot;: [&quot;s18evo-1.jpg&quot;]</code>.</li>
                    <li>Or leave <code>images</code> empty and name the files after the product slug: <code>my-slug.jpg</code>, <code>my-slug-1.jpg</code>, <code>my-slug-2.jpg</code>.</li>
                    <li>Links that start with <code>https://</code> are kept as they are and not uploaded.</li>
                    <li>Each image is resized and converted to WebP on upload, and added to the product. The first image is shown on cards.</li>
                    <li>Importing the same ZIP again updates the products but uploads the images again.</li>
                  </ul>
                </details>
              )}

              {/* Progress Panel */}
              {(importing || importProgress.current > 0) && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="font-medium">{importProgress.status}</span>
                    <span className="text-muted-foreground tabular-nums">
                      {Math.round((importProgress.current / importProgress.total) * 100)}% ({importProgress.current}/{importProgress.total})
                    </span>
                  </div>
                  
                  {/* Progress Bar Container */}
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden relative">
                    <div 
                      className="bg-foreground h-full rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Real-time Activity Log Terminal Console */}
              {importLogs.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">Import log</span>
                  <div className="w-full bg-stage text-white/85 font-mono text-xs rounded-media p-4 h-48 overflow-y-auto leading-relaxed">
                    {importLogs.map((log, idx) => (
                      <div key={idx} className="whitespace-pre-wrap">{log}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Success Panel */}
              {importSuccess && (
                <Reveal className="bg-secondary text-foreground p-6 rounded-media flex flex-col items-center gap-3 text-center animate-fade-in">
                  <div className="p-3 bg-foreground rounded-full text-background">
                    <Check size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg tracking-tight">Import complete</h3>
                    <p className="text-sm text-muted-foreground mt-1">{importProgress.total} products and their brands are now in your inventory.</p>
                  </div>
                </Reveal>
              )}

              {/* Error Alert */}
              {importError && (
                <Reveal className="bg-secondary border border-danger/30 text-danger p-4 rounded-media flex gap-3 items-start animate-fade-in">
                  <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">Could not import products</h4>
                    <p className="text-xs mt-1">{importError}</p>
                  </div>
                </Reveal>
              )}
            </div>

            <div className="p-6 border-t border-border flex justify-end gap-3">
               <button 
                 onClick={() => setShowImportModal(false)}
                 disabled={importing}
                 className="h-11 px-6 text-muted-foreground hover:bg-secondary rounded-full font-medium transition-colors cursor-pointer disabled:opacity-50"
               >
                 {importSuccess ? 'Close' : 'Cancel'}
               </button>
            </div>
          </div>
        </Reveal>
      )}

      {/* Bulk Product Edit Modal */}
      {showBulkEditModal && (
        <Reveal className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
          <form 
            onSubmit={handleBulkEdit}
            className="bg-background rounded-card w-full max-w-lg shadow-float border border-border overflow-hidden flex flex-col max-h-[85vh] animate-scale-up"
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex justify-between items-center">
               <div>
                 <h2 className="text-xl font-medium flex items-center gap-2 text-foreground">
                   Bulk edit products
                 </h2>
                 <p className="text-xs text-muted-foreground mt-0.5">
                   Applying changes to <span className="font-semibold text-foreground">{selectedIds.size}</span> selected products.
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
              <div className="p-4 border border-border rounded-media space-y-3 transition-colors hover:border-foreground/30">
                <label className="flex items-center gap-2.5 font-medium text-sm text-foreground cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={bulkEditFields.updateBrand} 
                    onChange={e => setBulkEditFields(prev => ({ ...prev, updateBrand: e.target.checked }))} 
                    className="rounded border-border accent-foreground w-4 h-4 cursor-pointer" 
                  />
                  <span>Update brand</span>
                </label>
                {bulkEditFields.updateBrand && (
                  <input 
                    type="text" 
                    required 
                    value={bulkEditData.brand} 
                    onChange={e => setBulkEditData(prev => ({ ...prev, brand: e.target.value }))} 
                    className="w-full h-11 px-3.5 bg-background border border-input rounded-control text-sm outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/60 animate-fade-in" 
                    placeholder="e.g. McIntosh" 
                  />
                )}
              </div>

              {/* Brand Category Upgrade */}
              <div className="p-4 border border-border rounded-media space-y-3 transition-colors hover:border-foreground/30">
                <label className="flex items-center gap-2.5 font-medium text-sm text-foreground cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={bulkEditFields.updateCategory} 
                    onChange={e => setBulkEditFields(prev => ({ ...prev, updateCategory: e.target.checked }))} 
                    className="rounded border-border accent-foreground w-4 h-4 cursor-pointer" 
                  />
                  <span>Update brand category</span>
                </label>
                {bulkEditFields.updateCategory && (
                  <select 
                    required 
                    value={bulkEditData.category} 
                    onChange={e => setBulkEditData(prev => ({ ...prev, category: e.target.value }))} 
                    className="w-full h-11 px-3.5 bg-background border border-input rounded-control text-sm outline-none focus:border-foreground transition-colors text-foreground cursor-pointer animate-fade-in"
                  >
                    <option value="">Select brand category</option>
                    {categories.map(cat => (
                      <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Price Upgrade */}
              <div className="p-4 border border-border rounded-media space-y-3 transition-colors hover:border-foreground/30">
                <label className="flex items-center gap-2.5 font-medium text-sm text-foreground cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={bulkEditFields.updatePrice} 
                    onChange={e => setBulkEditFields(prev => ({ ...prev, updatePrice: e.target.checked }))} 
                    className="rounded border-border accent-foreground w-4 h-4 cursor-pointer" 
                  />
                  <span>
                    Update Price <span className="text-xs font-normal text-muted-foreground ml-1">(Optional - Keep blank for Call for Price)</span>
                  </span>
                </label>
                {bulkEditFields.updatePrice && (
                  <Reveal className="relative animate-fade-in">
                    <span className="absolute left-3.5 top-3 text-xs text-muted-foreground">INR</span>
                    <input 
                      type="number" 
                      step="any"
                      value={bulkEditData.price} 
                      onChange={e => setBulkEditData(prev => ({ ...prev, price: e.target.value }))} 
                      className="w-full h-11 pl-14 pr-4 bg-background border border-input rounded-control text-sm outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/60" 
                      placeholder="e.g. 1250" 
                    />
                  </Reveal>
                )}
              </div>

              {/* New Arrival */}
              <div className="p-4 border border-border rounded-media space-y-3 transition-colors hover:border-foreground/30">
                <label className="flex items-center gap-2.5 font-medium text-sm text-foreground cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={bulkEditFields.updateNewArrival}
                    onChange={e => setBulkEditFields(prev => ({ ...prev, updateNewArrival: e.target.checked }))}
                    className="rounded border-border accent-foreground w-4 h-4 cursor-pointer"
                  />
                  <span>
                    New Arrival <span className="text-xs font-normal text-muted-foreground ml-1">(shows in &quot;The latest&quot; and the New Arrivals tab)</span>
                  </span>
                </label>
                {bulkEditFields.updateNewArrival && (
                  <div className="grid grid-cols-2 gap-2 animate-fade-in" role="radiogroup" aria-label="New arrival action">
                    {[
                      { value: 'add', label: 'Add to new arrivals' },
                      { value: 'remove', label: 'Remove from new arrivals' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        role="radio"
                        aria-checked={bulkEditData.newArrival === opt.value}
                        onClick={() => setBulkEditData(prev => ({ ...prev, newArrival: opt.value }))}
                        className={`rounded-full border h-11 px-3 text-sm font-medium transition-colors cursor-pointer ${
                          bulkEditData.newArrival === opt.value
                            ? 'border-foreground bg-foreground text-background'
                            : 'border-border bg-background text-muted-foreground hover:text-foreground hover:bg-secondary'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Actions Footer */}
            <div className="p-6 border-t border-border flex justify-end gap-3">
               <button 
                 type="button"
                 onClick={() => setShowBulkEditModal(false)}
                 disabled={bulkEditing}
                 className="h-11 px-6 text-muted-foreground hover:bg-secondary rounded-full font-medium transition-colors cursor-pointer disabled:opacity-50 text-sm"
               >
                 Cancel
               </button>
               <button 
                 type="submit"
                 disabled={bulkEditing}
                 className="h-11 px-6 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
               >
                 {bulkEditing && <Loader2 size={16} className="animate-spin" />}
                 {bulkEditing ? 'Saving…' : 'Save changes'}
               </button>
            </div>
          </form>
        </Reveal>
      )}
    </Reveal>
  );
}

