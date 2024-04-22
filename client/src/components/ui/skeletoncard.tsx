import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonCard() {
  return (
    <div className="flex flex-col h-full space-y-3 items-center justify-center">
      <Skeleton className="h-3/4 w-3/4 rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-3/4 w-[500px]" />
        <Skeleton className="h-3/4 w-[500px]" />
      </div>
    </div>
  );
}
