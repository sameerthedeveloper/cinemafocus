export default function Loading() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Skeleton */}
        <div className="space-y-4 max-w-2xl">
          <div className="h-4 w-24 bg-white/5 animate-pulse rounded" />
          <div className="h-12 w-3/4 bg-white/5 animate-pulse rounded-lg" />
          <div className="h-4 w-1/2 bg-white/5 animate-pulse rounded" />
        </div>

        {/* Content Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[3/4] bg-white/5 animate-pulse rounded-2xl" />
              <div className="h-6 w-1/2 bg-white/5 animate-pulse rounded" />
              <div className="h-4 w-1/4 bg-white/5 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
