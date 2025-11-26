import { Skeleton } from "@/components/ui/skeleton";

export function RestaurantCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-border/50 shadow-sm">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-12" />
        </div>
        <Skeleton className="h-4 w-1/2" />
        <div className="flex justify-between pt-3 border-t border-border/50">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-3 min-w-[100px]">
      <Skeleton className="w-24 h-24 rounded-full" />
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-3 w-10" />
    </div>
  );
}
