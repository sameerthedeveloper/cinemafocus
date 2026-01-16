import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles, Search } from 'lucide-react';
import ImageUpload from '../../components/ImageUpload';

const AddNewLaunch = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [selectedProductId, setSelectedProductId] = useState('');
  const [overrideImage, setOverrideImage] = useState('');
  
  // We keep this to store a snapshot or reference
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    slug: '',
    category: '',
    shortDescription: '',
    images: [''], 
    // We can add more fields if we want to fully override, 
    // but typically "New Launch" just highlights an existing product
    // plus maybe a custom image.
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, "products"));
      const productList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productList);
    } catch (error) {
       console.error("Error fetching products:", error);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductSelect = (productId) => {
    setSelectedProductId(productId);
    
    if (productId) {
       const product = products.find(p => p.id === productId);
       if (product) {
          // Pre-fill form with product data
          setFormData({
             name: product.name,
             brand: product.brand,
             price: product.price,
             slug: product.slug, // Keep original slug to link back
             category: product.category,
             shortDescription: product.shortDescription,
             images: product.images || ['']
          });
       }
    } else {
       // Reset
       setFormData({
        name: '',
        brand: '',
        price: '',
        slug: '',
        category: '',
        shortDescription: '',
        images: ['']
       });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        featured: true,
        // If override image is provided, use it as primary
        images: overrideImage ? [overrideImage, ...formData.images] : formData.images,
        // Link to original product
        originalProductId: selectedProductId
      };
      
      await addDoc(collection(db, "new_launches"), payload);
      navigate('/admin/new-launches');
    } catch (error) {
      console.error("Error adding new launch:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
       <Link to="/admin/new-launches" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft size={18} className="mr-2" />
        Back to New Launches
      </Link>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add New Launch</h1>
        <p className="text-muted-foreground mt-2">Select an existing product to feature as a new arrival.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl border border-border shadow-sm">
        
        {/* Product Selection */}
        <div className="bg-secondary/10 p-6 rounded-lg border border-border/50">
            <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                <Sparkles size={16} className="text-primary" />
                Select Product to Feature
            </label>
            
            {!selectedProductId ? (
              <div className="space-y-3">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-3 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search products by name or brand..." 
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="max-h-60 overflow-y-auto border border-border rounded-lg bg-white divide-y divide-border/50 shadow-sm">
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
                            <span className="text-sm text-muted-foreground ml-2">({p.brand})</span>
                         </div>
                         <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">Select</span>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground text-sm">No products found matching "{searchTerm}"</div>
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
                      <p className="text-sm text-muted-foreground">{formData.brand} • Original Price: ${formData.price}</p>
                    </div>
                 </div>
                 <button 
                   type="button" 
                   onClick={() => handleProductSelect('')}
                   className="text-sm text-red-500 hover:text-red-700 font-medium px-3 py-1 hover:bg-red-50 rounded transition-colors"
                 >
                   Change Product
                 </button>
              </div>
            )}
        </div>

        {selectedProductId && (
            <div className="space-y-6 animate-fade-in-up">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                    <label className="block text-sm font-medium mb-2">Display Name</label>
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
                    <label className="block text-sm font-medium mb-2">Price ($)</label>
                    <input 
                        required
                        type="number" 
                        className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                    />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Slug (URL)</label>
                        <input 
                            required
                            readOnly
                            type="text" 
                            className="w-full px-4 py-2 rounded-lg border border-border bg-secondary/30 text-muted-foreground cursor-not-allowed"
                            value={formData.slug}
                        />
                         <p className="text-xs text-muted-foreground mt-1">Linked to original product page</p>
                    </div>
                </div>

                <div>
                   <label className="block text-sm font-medium mb-2">Short Description</label>
                   <textarea 
                     required
                     rows="2"
                     className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                     value={formData.shortDescription}
                     onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                   />
                </div>

                <div className="border-t border-border pt-6">
                    <label className="block text-sm font-medium mb-2">Custom Feature Image (Optional)</label>
                    <p className="text-xs text-muted-foreground mb-4">Upload a new image to override the default product image for this listing.</p>
                     <ImageUpload 
                        onUploadComplete={(url) => setOverrideImage(url)}
                        initialImage={overrideImage}
                    />
                </div>

                <div className="pt-4 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-primary text-primary-foreground px-8 py-3 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 font-medium"
                    >
                        <Save size={18} />
                        {loading ? 'Saving...' : 'Feature as New Launch'}
                    </button>
                </div>
            </div>
        )}
      </form>
    </div>
  );
};

export default AddNewLaunch;
