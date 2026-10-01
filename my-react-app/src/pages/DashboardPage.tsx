// import {
//   CheckCircle2,
//   Clock3,
//   FileText,
//   Inbox,
// } from "lucide-react";

// import { useDashboard } from "../hooks/useDashboard";

// import DashboardSkeleton from "../components/dashboard/DashboardSkeleton";
// import StatCard from "../components/dashboard/StatCard";
// import RequestsChart from "../components/dashboard/RequestsChart";
// import RecentRequests from "../components/dashboard/RecentRequests";

// import ErrorState from "../components/ui/ErrorState";

// export default function DashboardPage() {
//   const {
//     stats,
//     monthlyStats,
//     recentRequests,
//     isLoading,
//     error,
//     retry,
//   } = useDashboard();

//   if (isLoading) {
//     return <DashboardSkeleton />;
//   }

//   if (error || !stats) {
//     return (
//       <ErrorState
//         message={error ?? "Unable to load dashboard"}
//         onRetry={retry}
//       />
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Page header */}
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight text-slate-900">
//             Dashboard
//           </h1>

//           <p className="mt-1 text-sm text-slate-500">
//             Overview of your client requests and activity.
//           </p>
//         </div>
//       </div>

//       {/* KPI cards */}
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//         <StatCard
//           title="Total Requests"
//           value={stats.totalRequests}
//           icon={FileText}
//           iconClassName="bg-slate-100 text-slate-700"
//         />

//         <StatCard
//           title="New Requests"
//           value={stats.newRequests}
//           icon={Inbox}
//           iconClassName="bg-blue-50 text-blue-600"
//         />

//         <StatCard
//           title="In Progress"
//           value={stats.inProgressRequests}
//           icon={Clock3}
//           iconClassName="bg-amber-50 text-amber-600"
//         />

//         <StatCard
//           title="Completed"
//           value={stats.doneRequests}
//           icon={CheckCircle2}
//           iconClassName="bg-emerald-50 text-emerald-600"
//         />
//       </div>

//       {/* Chart */}

//       <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
//         <div className="mb-5">
//           <h2 className="text-base font-semibold text-slate-900">
//             Request Activity
//           </h2>

//           <p className="mt-1 text-sm text-slate-500">
//             Requests created over time
//           </p>
//         </div>

//         {monthlyStats.length > 0 ? (
//           <RequestsChart data={monthlyStats} />
//         ) : (
//           <div className="flex h-64 items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-500 sm:h-72">
//             No request activity yet.
//           </div>
//         )}
//       </section>
//       {/* Recent requests */}
//       <RecentRequests requests={recentRequests} />
//     </div>
//   );
// }
import { CheckCircle2, Clock3, FileText, Inbox } from "lucide-react";

import { useDashboard } from "../hooks/useDashboard";

import {
  MonthlyChartSkeleton,
  RecentRequestsSkeleton,
  StatsSkeleton,
} from "../components/dashboard/DashboardSkeleton";
import StatCard from "../components/dashboard/StatCard";
import RequestsChart from "../components/dashboard/RequestsChart";
import RecentRequests from "../components/dashboard/RecentRequests";

import ErrorState from "../components/ui/ErrorState";

export default function DashboardPage() {
  const {
    stats,
    monthlyStats,
    recentRequests,
    isStatsLoading,
    isMonthlyLoading,
    isRecentRequestsLoading,
    statsError,
    monthlyError,
    recentRequestsError,
    retryStats,
    retryMonthlyStats,
    retryRecentRequests,
  } = useDashboard();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-5xl font-bold tracking-tight text-slate-900">
          Dashboard
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Overview of your client requests and activity.
        </p>
      </div>

      {/* KPI cards */}
      {isStatsLoading ? (
        <StatsSkeleton />
      ) : statsError || !stats ? (
        <ErrorState
          message={statsError ?? "Unable to load request statistics"}
          onRetry={retryStats}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Requests"
            value={stats.totalRequests}
            icon={FileText}
            iconClassName="bg-slate-100 text-slate-700"
          />

          <StatCard
            title="New Requests"
            value={stats.newRequests}
            icon={Inbox}
            iconClassName="bg-blue-50 text-blue-600"
          />

          <StatCard
            title="In Progress"
            value={stats.inProgressRequests}
            icon={Clock3}
            iconClassName="bg-amber-50 text-amber-600"
          />

          <StatCard
            title="Completed"
            value={stats.doneRequests}
            icon={CheckCircle2}
            iconClassName="bg-emerald-50 text-emerald-600"
          />
        </div>
      )}

      {/* Monthly chart */}
      {isMonthlyLoading ? (
        <MonthlyChartSkeleton />
      ) : monthlyError ? (
        <ErrorState message={monthlyError} onRetry={retryMonthlyStats} />
      ) : (
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-slate-900">
              Request Activity
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Requests created over time
            </p>
          </div>

          {monthlyStats.length > 0 ? (
            <RequestsChart data={monthlyStats} />
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-500 sm:h-72">
              No request activity yet.
            </div>
          )}
        </section>
      )}

      {/* Recent requests */}
      {isRecentRequestsLoading ? (
        <RecentRequestsSkeleton />
      ) : recentRequestsError ? (
        <ErrorState
          message={recentRequestsError}
          onRetry={retryRecentRequests}
        />
      ) : (
        <RecentRequests requests={recentRequests} />
      )}
    </div>
  );
}
