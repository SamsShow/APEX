import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-6 w-80" />
      <Skeleton className="h-6 w-72" />
      <Skeleton className="h-6 w-60" />
    </div>
  );
}
