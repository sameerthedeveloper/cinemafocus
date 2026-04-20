import React from 'react';

const AppleLoader = ({ className = "" }) => {
  return (
    <div className={`relative w-10 h-10 ${className}`}>
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute top-0 left-0 w-full h-full"
          style={{ 
            transform: `rotate(${i * 30}deg)`,
          }}
        >
          {/* Tick Mark */}
          <div 
            className="w-[10%] h-[28%] bg-white rounded-full mx-auto"
            style={{ 
              animation: `apple-spinner-fade 1.2s linear infinite`,
              animationDelay: `${-1.2 + (i * 0.1)}s`,
              opacity: 0
            }} 
          />
        </div>
      ))}
    </div>
  );
};

export default AppleLoader;
