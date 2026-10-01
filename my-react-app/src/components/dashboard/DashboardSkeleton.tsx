import Skeleton from "../ui/Skeleton";

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border border-slate-200 bg-white p-5"
        >
          <div className="flex justify-between">
            <div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-3 h-8 w-16" />
            </div>

            <Skeleton className="h-11 w-11 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MonthlyChartSkeleton() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <Skeleton className="h-5 w-48" />
      <Skeleton className="mt-2 h-4 w-64" />
      <Skeleton className="mt-6 h-72 w-full" />
    </section>
  );
}

export function RecentRequestsSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="mt-5 h-10 w-full" />

      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="mt-3 h-12 w-full" />
      ))}
    </div>
  );
}
