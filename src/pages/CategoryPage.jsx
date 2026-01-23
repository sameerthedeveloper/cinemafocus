import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Section from '../components/Section';
import { getProducts, getCategories } from '../lib/db';
import SEO from '../components/SEO';

const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      const [cats, prods] = await Promise.all([
        getCategories(),
        getProducts(slug)
      ]);
      const activeCat = cats.find(c => c.slug === slug);
      setCategory(activeCat);
      setCategoryProducts(prods);
      setLoading(false);
    };
    fetchCategoryData();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!category) {
    return <Navigate to="/products" replace />;
  }

  return (
    <Section className="py-20 min-h-screen">
       <div className="space-y-4 mb-12 text-center">
          <SEO 
            title={category.name} 
            description={`Explore our premium selection of ${category.name.toLowerCase()}.`}
            path={`/category/${slug}`}
          />
          <h1 className="text-4xl md:text-5xl font-serif font-medium">{category.name}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
             Explore our premium selection of {category.name.toLowerCase()}.
          </p>
       </div>

       {/* Grid */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-x-6 gap-y-12">
          {categoryProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
       </div>
       
       {categoryProducts.length === 0 && (
         <div className="text-center py-20 text-muted-foreground">
           No products found in this category.
         </div>
       )}
    </Section>
  );
};

export default CategoryPage;
