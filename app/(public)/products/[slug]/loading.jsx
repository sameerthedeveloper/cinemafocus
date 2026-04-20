export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Image Skeleton */}
          <div className="space-y-6">
            <div className="aspect-square bg-white/5 animate-pulse rounded-3xl" />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-white/5 animate-pulse rounded-xl" />
              ))}
            </div>
          </div>

          {/* Details Skeleton */}
          <div className="space-y-8 py-10">
            <div className="space-y-4">
              <div className="h-4 w-32 bg-white/10 animate-pulse rounded" />
              <div className="h-16 w-full bg-white/5 animate-pulse rounded-xl" />
              <div className="h-20 w-3/4 bg-white/5 animate-pulse rounded-lg" />
            </div>

            <div className="h-8 w-40 bg-white/10 animate-pulse rounded" />

            <div className="space-y-6 pt-12 border-t border-white/5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center py-4 border-b border-white/5">
                   <div className="h-6 w-32 bg-white/5 animate-pulse rounded" />
                   <div className="h-6 w-48 bg-white/5 animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
