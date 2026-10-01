import Skeleton from "../ui/Skeleton";

export default function RequestsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-72" />
      </div>

      <Skeleton className="h-10 w-80" />

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="space-y-4 p-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="grid grid-cols-5 gap-4">
              <Skeleton className="h-5" />
              <Skeleton className="h-5" />
              <Skeleton className="h-5" />
              <Skeleton className="h-5" />
              <Skeleton className="h-5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
