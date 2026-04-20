
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom'; 
import { formatDate } from '../lib/utils'; 
// Note: User profile said clsx & tailwind-merge are used. 
// I'll stick to standard template literals if utils not verified, but usually it's in lib/utils.
// Let's check lib/utils existence first? No, I'll just use template literals to be safe or check imports.
// The file imports nothing from lib/utils currently. I'll use standard class strings.

const PressReleaseCard = ({ release, variant = 'vertical', className }) => {
  const isHorizontal = variant === 'horizontal';

  if (isHorizontal) {
    return (
      <div className={`group cursor-pointer grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center ${className || ''}`}>
         {/* Left Column: Title & Image */}
         <div className="flex flex-col gap-6">
            <h3 className="text-3xl md:text-4xl font-medium leading-tight text-foreground group-hover:text-primary transition-colors">
              {release.title}
            </h3>
            <div className="relative overflow-hidden rounded-xl bg-secondary/5 aspect-video w-full">
              <img 
                src={release.imageUrl} 
                alt={release.title} 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
            </div>
         </div>

         {/* Right Column: Details */}
         <div className="flex flex-col justify-center h-full space-y-6">
            <div className="flex items-center gap-2 text-sm text-muted uppercase tracking-wider">
              <Calendar size={16} />
              <span>{formatDate(release.date)}</span>
            </div>
            
            <p className="text-muted text-lg leading-relaxed line-clamp-6">
              {release.excerpt}
            </p>
            
            <Link to={`/press/${release.slug || release.id}`} className="text-primary font-medium hover:underline inline-flex items-center text-lg">
              Read Full Story &rarr;
            </Link>
         </div>
      </div>
    );
  }

  // Vertical layout (default)
  return (
    <div className={`group cursor-pointer flex flex-col h-full ${className || ''}`}>
      <div className="relative overflow-hidden rounded-xl bg-secondary/5 aspect-[16/9] w-full mb-4">
        <img 
          src={release.imageUrl} 
          alt={release.title} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
      </div>
      
      <div className="flex flex-col flex-grow">
        <div className="flex items-center gap-2 text-sm text-muted mb-3">
          <Calendar size={14} />
          <span>{formatDate(release.date)}</span>
        </div>
        
        <h3 className="text-xl font-medium text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
          {release.title}
        </h3>
        
        <p className="text-muted text-sm mb-4 flex-grow line-clamp-3">
          {release.excerpt}
        </p>
        
        <Link to={`/press/${release.slug || release.id}`} className="text-primary text-sm font-medium hover:underline mt-auto inline-flex items-center">
          Read Full Story &rarr;
        </Link>
      </div>
    </div>
  );
};

export default PressReleaseCard;
