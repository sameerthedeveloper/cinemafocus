import { Skeleton, LoadingCue } from '@/components/panel/ui';

// Dashboard skeleton: same grid as the real page so nothing jumps when data arrives.
export default function DashboardLoading() {
  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto pb-20 md:pb-10" aria-busy="true">
      <LoadingCue label="Loading your dashboard" />
      <div className="mb-8 md:mb-10 space-y-3">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[136px] !rounded-[20px]" />)}
      </div>
      <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        <Skeleton className="h-[380px] xl:col-span-2 !rounded-[20px]" />
        <Skeleton className="h-[380px] !rounded-[20px]" />
      </div>
      <Skeleton className="mt-6 h-72 !rounded-[20px]" />
    </div>
  );
}
