import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Section from '../components/Section';
import { getProducts, getCategories } from '../lib/db';
import { Helmet } from 'react-helmet-async';
import clsx from 'clsx';

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [p, c] = await Promise.all([
        getProducts(activeCategory === 'all' ? null : activeCategory),
        getCategories()
      ]);
      setProducts(p);
      setCategories(c);
      setLoading(false);
    };
    fetchData();
  }, [activeCategory]);
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  // Filtered logic is now handled by getProducts(slug) or we filter locally if getProducts returned all.
  // In our db.js getProducts(slug) handles filtering.
  const filteredProducts = products;
  
  const pageTitle = activeCategory === 'all' ? 'Our Collection' : categories.find(c => c.slug === activeCategory)?.name || 'Products';

  return (
    <Section className="py-32 min-h-screen">
       <Helmet>
         <title>{pageTitle} | Cinema Focus</title>
       </Helmet>
       <div className="space-y-6 mb-24 text-center">
          <h1 className="text-5xl md:text-6xl font-medium tracking-tight">Our Collection.</h1>
          <p className="text-xl text-muted font-light max-w-2xl mx-auto">
            Discover our curated range of premium audio equipment.
          </p>
       </div>

       {/* Filters */}
       <div className="flex flex-wrap justify-center gap-6 mb-20">
          <button
             onClick={() => setSearchParams({})}
             className={clsx(
               "px-6 py-2 text-sm rounded-full transition-all duration-300 font-medium",
               activeCategory === 'all' ? "bg-black text-white" : "bg-secondary text-muted-foreground hover:bg-black/5 hover:text-black"
             )}
          >
            All
          </button>
          {categories.map((cat) => (
             <button
               key={cat.slug}
               onClick={() => setSearchParams({ category: cat.slug })}
               className={clsx(
                 "px-6 py-2 text-sm rounded-full transition-all duration-300 font-medium",
                 activeCategory === cat.slug ? "bg-black text-white" : "bg-secondary text-muted-foreground hover:bg-black/5 hover:text-black"
               )}
             >
               {cat.name}
             </button>
          ))}
       </div>

       {/* Grid */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          {filteredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
       </div>
       
       {filteredProducts.length === 0 && (
         <div className="text-center py-20 text-muted-foreground">
           No products found in this category.
         </div>
       )}
    </Section>
  );
};

export default ProductList;
