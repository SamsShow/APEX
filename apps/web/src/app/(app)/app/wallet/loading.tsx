import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-56" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-56" />
      </div>
    </div>
  );
}
