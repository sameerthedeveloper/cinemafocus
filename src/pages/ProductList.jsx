import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Section from '../components/Section';
import { getProducts, getCategories, getNewLaunches } from '../lib/db';
import SEO from '../components/SEO';
import clsx from 'clsx';

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newLaunches, setNewLaunches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        const [cats, nl] = await Promise.all([
          getCategories(),
          getNewLaunches()
        ]);

        setCategories(cats);
        setNewLaunches(nl);

        let p = [];

        if (activeCategory === 'all') {
             p = await getProducts();
        } else if (activeCategory === 'new-arrivals') {
             // Use new launches data, ensure they match product structure
             p = nl;
        } else {
             // Filter by category slug
             p = await getProducts({ category: activeCategory });
        }

        setProducts(p);
      } catch (err) {
          console.error("Failed to fetch products", err);
      } finally {
          setLoading(false);
      }
    };
    fetchData();
  }, [activeCategory]);
  
  const filteredProducts = products;

  const getPageTitle = () => {
    if (activeCategory === 'all') return 'Our Collection';
    if (activeCategory === 'new-arrivals') return 'New Arrivals';
    const cat = categories.find(c => c.slug === activeCategory);
    return cat ? cat.name : activeCategory;
  };

  return (
    <Section className="py-32 min-h-screen">
       <SEO title={getPageTitle()} />
       <div className="space-y-6 mb-24 text-center">
          <h1 className="text-5xl md:text-6xl font-medium tracking-tight">Our Collection.</h1>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Discover our curated range of premium audio equipment.
          </p>
       </div>

       {/* Filters */}
       <div className="flex overflow-x-auto md:flex-wrap md:justify-center gap-3 md:gap-4 mb-16 md:mb-20 px-4 pb-4 md:pb-0 scrollbar-hide touch-pan-x">
          <button
             onClick={() => setSearchParams({})}
             className={clsx(
               "px-6 py-2 text-sm rounded-full transition-all duration-300 font-medium whitespace-nowrap flex-shrink-0",
               activeCategory === 'all' ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-primary/5 hover:text-primary"
             )}
          >
            All
          </button>
          
          <button
             onClick={() => setSearchParams({ category: 'new-arrivals' })}
             className={clsx(
               "px-6 py-2 text-sm rounded-full transition-all duration-300 font-medium whitespace-nowrap flex-shrink-0",
               activeCategory === 'new-arrivals' ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-primary/5 hover:text-primary"
             )}
          >
            New Arrivals
          </button>

          {categories.map((category) => (
             <button
               key={category.slug}
               onClick={() => setSearchParams({ category: category.slug })}
               className={clsx(
                 "px-6 py-2 text-sm rounded-full transition-all duration-300 font-medium whitespace-nowrap flex-shrink-0",
                 activeCategory === category.slug ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-primary/5 hover:text-primary"
               )}
             >
               {category.name}
             </button>
          ))}
       </div>

       {/* Grid */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-x-12 gap-y-24">
          {loading ? (
            // Skeleton Loading State
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="aspect-[4/3] bg-secondary/50 rounded-2xl" />
                <div className="space-y-2">
                  <div className="h-4 w-2/3 bg-secondary/50 rounded" />
                  <div className="h-4 w-1/3 bg-secondary/50 rounded" />
                </div>
              </div>
            ))
          ) : (
            filteredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))
          )}
       </div>
       
       {!loading && filteredProducts.length === 0 && (
         <div className="text-center py-20 text-muted-foreground">
           No products found in this category.
         </div>
       )}
    </Section>
  );
};

export default ProductList;
