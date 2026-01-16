
import Section from './Section';
import ProductCard from './ProductCard';
import Button from './Button';

const NewLaunches = ({ products }) => {
  if (!products || products.length === 0) return null;

  return (
    <Section id="new-launches" background="bg-secondary/5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
           <span className="text-primary font-medium tracking-wider uppercase text-sm mb-2 block">Just Arrived</span>
           <h2 className="text-3xl md:text-4xl font-medium tracking-tight">New Launches.</h2>
        </div>
        <Button to="/products?sort=newest" variant="outline">View All New Arrivals</Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </Section>
  );
};

export default NewLaunches;
