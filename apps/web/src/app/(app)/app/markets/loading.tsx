import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <div className="space-y-3 xl:col-span-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-72" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-72" />
      </div>
      <div className="space-y-3 xl:col-span-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}
