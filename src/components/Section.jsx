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
        "py-24 md:py-32", // Increased vertical rhythm
        background,
        className
      )}
    >
      {container ? (
        <div className="container px-6 mx-auto">
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  );
};

export default Section;
