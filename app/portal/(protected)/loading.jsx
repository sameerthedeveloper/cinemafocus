import { Skeleton, LoadingCue } from '@/components/panel/ui';

// Generic list-page skeleton (messages, products, brands, gallery, press): shown while the page's data loads.
export default function PortalLoading() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto pb-20 md:pb-8" aria-busy="true">
      <LoadingCue />
      <div className="mb-8 md:mb-10 space-y-3">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="flex gap-3 mb-6">
        <Skeleton className="h-10 w-full max-w-md !rounded-full" />
        <Skeleton className="h-10 w-28 !rounded-full hidden sm:block" />
      </div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-24 !rounded-[20px]" />)}
      </div>
    </div>
  );
}
