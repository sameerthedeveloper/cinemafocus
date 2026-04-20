export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header Skeleton */}
        <div className="space-y-6 text-center max-w-3xl mx-auto">
          <div className="h-4 w-24 bg-white/10 animate-pulse rounded-full mx-auto" />
          <div className="h-16 w-3/4 bg-white/5 animate-pulse rounded-2xl mx-auto" />
          <div className="h-6 w-1/2 bg-white/5 animate-pulse rounded-lg mx-auto" />
        </div>

        {/* Filter/Sort Row Skeleton */}
        <div className="flex justify-between items-center py-6 border-y border-white/5">
          <div className="h-6 w-32 bg-white/5 animate-pulse rounded" />
          <div className="h-10 w-48 bg-white/10 animate-pulse rounded-full" />
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[4/5] bg-white/5 animate-pulse rounded-2xl" />
              <div className="space-y-2">
                <div className="h-6 w-3/4 bg-white/5 animate-pulse rounded" />
                <div className="h-4 w-1/4 bg-white/10 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
