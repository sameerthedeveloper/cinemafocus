import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Section from '../components/Section';
import { getProducts, getBrands } from '../lib/db';
import SEO from '../components/SEO';
import clsx from 'clsx';

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeBrand = searchParams.get('brand') || 'all';
  
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        let p, b;
        
        // Fetch Brands
        b = await getBrands();

        // Fetch Products based on brand
        // Note: passing null or 'all' results in all products
        if (activeBrand === 'all') {
             p = await getProducts();
        } else {
             p = await getProducts({ brand: activeBrand });
        }

        setProducts(p);
        setBrands(b);
      } catch (err) {
          console.error("Failed to fetch products", err);
      } finally {
          setLoading(false);
      }
    };
    fetchData();
  }, [activeBrand]);
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const filteredProducts = products;
  
  const pageTitle = activeBrand === 'all' ? 'Our Collection' : activeBrand;

  return (
    <Section className="py-32 min-h-screen">
       <SEO title={pageTitle} />
       <div className="space-y-6 mb-24 text-center">
          <h1 className="text-5xl md:text-6xl font-medium tracking-tight">Our Collection.</h1>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Discover our curated range of premium audio equipment.
          </p>
       </div>

       {/* Filters */}
       <div className="flex flex-wrap justify-center gap-4 mb-20">
          <button
             onClick={() => setSearchParams({})}
             className={clsx(
               "px-6 py-2 text-sm rounded-full transition-all duration-300 font-medium",
               activeBrand === 'all' ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-primary/5 hover:text-primary"
             )}
          >
            All
          </button>
          {brands.map((brand) => (
             <button
               key={brand}
               onClick={() => setSearchParams({ brand: brand })}
               className={clsx(
                 "px-6 py-2 text-sm rounded-full transition-all duration-300 font-medium",
                 activeBrand === brand ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-primary/5 hover:text-primary"
               )}
             >
               {brand}
             </button>
          ))}
       </div>

       {/* Grid */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-x-12 gap-y-24">
          {filteredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
       </div>
       
       {filteredProducts.length === 0 && (
         <div className="text-center py-20 text-muted-foreground">
           No products found for this brand.
         </div>
       )}
    </Section>
  );
};

export default ProductList;
