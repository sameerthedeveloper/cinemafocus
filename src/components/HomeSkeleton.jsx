import React from 'react';

const HomeSkeleton = () => {
  return (
    <div className="w-full min-h-screen bg-zinc-950 animate-pulse">
      {/* Hero / New Launches Skeleton */}
      <div className="relative w-full h-[100dvh] flex flex-col md:flex-row items-center justify-center px-6 md:px-20 overflow-hidden">
        
        {/* Left Side: Text */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-start h-full pt-20 md:pt-0 space-y-8 z-10">
           {/* Eyebrow */}
           <div className="w-32 h-6 bg-zinc-800 rounded-full" />
           
           {/* Title */}
           <div className="space-y-4">
             <div className="w-3/4 h-12 md:h-20 bg-zinc-800 rounded-lg" />
             <div className="w-1/2 h-12 md:h-20 bg-zinc-800 rounded-lg" />
           </div>
           
           {/* Description */}
           <div className="space-y-3 w-full max-w-md">
             <div className="w-full h-4 bg-zinc-800 rounded" />
             <div className="w-5/6 h-4 bg-zinc-800 rounded" />
             <div className="w-4/6 h-4 bg-zinc-800 rounded" />
           </div>
           
           {/* Button */}
           <div className="w-40 h-14 bg-zinc-800 rounded-full mt-4" />
        </div>

        {/* Right Side: Image */}
        <div className="w-full md:w-1/2 h-full flex items-center justify-center relative z-10">
           <div className="w-64 h-64 md:w-96 md:h-96 bg-zinc-800 rounded-full opacity-50" />
        </div>

        {/* Background blobs for ambience */}
        <div className="absolute top-[-20%] right-[-10%] w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] bg-white/5 rounded-full blur-[100px] pointer-events-none" />
      </div>

      {/* Sections structure hint */}
      <div className="container mx-auto px-6 py-24 space-y-24">
         {/* Categories Grid Skeleton */}
         <div className="space-y-8">
            <div className="mx-auto w-48 h-10 bg-zinc-100 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               {[...Array(4)].map((_, i) => (
                 <div key={i} className="aspect-[3/4] bg-zinc-100 rounded-2xl" />
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default HomeSkeleton;
