import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import Badge from "../ui/Badge";

import type { ClientRequest, RequestStatus } from "../../types/request";

interface RecentRequestsProps {
  requests: ClientRequest[];
}

export default function RecentRequests({ requests }: RecentRequestsProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Recent Requests
          </h2>

          <p className="mt-0.5 text-sm text-slate-500">
            Your latest client requests
          </p>
        </div>

        <Link
          to="/requests"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 transition hover:text-slate-900"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="flex min-h-40 items-center justify-center px-5 text-sm text-slate-500">
          No requests yet.
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Client
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Request
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Created
                  </th>
                </tr>
              </thead>

              <tbody>
                {requests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="px-5 py-4 text-sm font-medium text-slate-900">
                      {request.clientName}
                    </td>

                    <td className="px-5 py-4">
                      <p className="max-w-xs truncate text-sm font-medium text-slate-900">
                        {request.title}
                      </p>

                      <p className="mt-0.5 max-w-xs truncate text-xs text-slate-500">
                        {request.description}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={request.status} />
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {formatDate(request.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="divide-y divide-slate-100 md:hidden">
            {requests.map((request) => (
              <div key={request.id} className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {request.title}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {request.clientName}
                    </p>
                  </div>

                  <StatusBadge status={request.status} />
                </div>

                <p className="line-clamp-2 text-sm text-slate-500">
                  {request.description}
                </p>

                <p className="text-xs text-slate-400">
                  {formatDate(request.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: RequestStatus }) {
  const config = {
    NEW: {
      label: "New",
      variant: "new" as const,
    },
    IN_PROGRESS: {
      label: "In Progress",
      variant: "progress" as const,
    },
    DONE: {
      label: "Done",
      variant: "done" as const,
    },
  };

  const current = config[status];

  return <Badge variant={current.variant}>{current.label}</Badge>;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
