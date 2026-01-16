
import Section from './Section';
import ProductCard from './ProductCard';
import Button from './Button';

const NewLaunches = ({ products }) => {
  const hasProducts = products && products.length > 0;

  return (
    <Section id="new-launches" background="bg-secondary/5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
           <span className="text-primary font-medium tracking-wider uppercase text-sm mb-2 block">Just Arrived</span>
           <h2 className="text-3xl md:text-4xl font-medium tracking-tight">New Launches.</h2>
        </div>
        {hasProducts && (
            <Button to="/products?sort=newest" variant="outline">View All New Arrivals</Button>
        )}
      </div>
      
      {hasProducts ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
            ))}
        </div>
      ) : (
        <div className="text-center py-16 space-y-6 bg-white/50 rounded-2xl border border-dashed border-border/50">
          <h3 className="text-xl font-medium text-muted-foreground">No New Launches for Now.</h3>
          <Button to="/products" variant="primary">Discover Products</Button>
        </div>
      )}
    </Section>
  );
};

export default NewLaunches;
