import React from 'react';
import Button from './Button';
import Section from './Section';

const Hero = ({ title, subtitle, ctaText, ctaLink, imageUrl }) => {
  return (
    <div className="relative h-screen flex items-center bg-gray-50 overflow-hidden">
      {/* Background Image - Subtle Parallax or just static high quality */}
      <div className="absolute inset-0 z-0 opacity-60">
        <img 
          src={imageUrl} 
          alt="Hero Background" 
          className="w-full h-full object-cover"
        />
        {/* Subtle gradient overlay from bottom to blend */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
      </div>

      {/* Content - Centered for max impact */}
      <div className="container px-6 relative z-10 mx-auto text-center">
         <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
           <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-black leading-[1.1]">
             {title}
           </h1>
           <p className="text-xl md:text-2xl text-gray-700 font-light max-w-2xl mx-auto leading-relaxed">
             {subtitle}
           </p>
           <div className="pt-8 flex justify-center">
             {/* Apple-style button: rounded-full maybe? Or keep standard but pill shaped */}
             <Button to={ctaLink} size="lg" className="rounded-full px-10">
               {ctaText}
             </Button>
           </div>
         </div>
      </div>
    </div>
  );
};

export default Hero;
