import React, { useState, useEffect } from 'react';
import { getNewLaunches } from '../../lib/db';
import { Rocket, Tag, DollarSign } from 'lucide-react';

const PortalNewLaunches = () => {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getNewLaunches();
        setLaunches(data);
      } catch (error) {
        console.error('Error fetching new launches:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto animate-fade-in">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-medium tracking-tight flex items-center gap-3">
          <Rocket className="text-primary" />
          New Product Launches
        </h1>
        <p className="text-muted-foreground mt-1">Discover the latest products</p>
      </header>

      {launches.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Rocket size={48} className="mx-auto mb-4 opacity-50" />
          <p>No new launches available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {launches.map((product) => (
            <div 
              key={product.id || product.slug}
              className="bg-background border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all group"
            >
              {product.images?.[0] && (
                <div className="aspect-square overflow-hidden bg-secondary/10">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Tag size={12} />
                  {product.brand}
                </div>
                <h3 className="font-medium leading-tight">{product.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{product.shortDescription}</p>
                
                {product.price && (
                  <div className="flex items-center gap-1 text-primary font-medium">
                    <DollarSign size={14} />
                    {product.price.toLocaleString()}
                  </div>
                )}
                
                <div className="pt-2">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                    {product.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortalNewLaunches;
