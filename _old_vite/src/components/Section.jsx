import React from 'react';
import clsx from 'clsx';

const Section = ({ 
  children, 
  className, 
  id, 
  background = 'bg-transparent',
  container = true 
}) => {
  return (
    <section 
      id={id} 
      className={clsx(
        "py-16 md:py-24", // Standardized vertical rhythm
        background,
        className
      )}
    >
      {container ? (
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  );
};

export default Section;
