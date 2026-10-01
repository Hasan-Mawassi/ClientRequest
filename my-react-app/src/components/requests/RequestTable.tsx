import { Trash2 } from "lucide-react";
import Badge from "../ui/Badge";
import RequestStatusActions from "./RequestStatusActions";
import type { ClientRequest, RequestStatus } from "../../types/request";

interface RequestTableProps {
  requests: ClientRequest[];
  updatingId: number | null;
  deletingId: number | null;
  onStatusChange: (id: number, status: RequestStatus) => void;
  onDelete: (request: ClientRequest) => void;
}

function getBadgeVariant(status: RequestStatus) {
  switch (status) {
    case "NEW":
      return "new" as const;
    case "IN_PROGRESS":
      return "progress" as const;
    case "DONE":
      return "done" as const;
  }
}

function getStatusLabel(status: RequestStatus) {
  switch (status) {
    case "NEW":
      return "New";
    case "IN_PROGRESS":
      return "In Progress";
    case "DONE":
      return "Done";
  }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default function RequestTable({
  requests,
  updatingId,
  deletingId,
  onStatusChange,
  onDelete,
}: RequestTableProps) {
  if (requests.length === 0) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-center">
        <div>
          <p className="font-medium text-slate-900">No requests found</p>
          <p className="mt-1 text-sm text-slate-500">
            Try another filter or create a new request.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-212.5">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Client
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Request
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Created
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {requests.map((request) => (
              <tr key={request.id} className="transition hover:bg-slate-50/70">
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-900">
                    {request.clientName}
                  </p>
                </td>

                <td className="max-w-[320px] px-5 py-4">
                  <p className="font-medium text-slate-900">{request.title}</p>

                  <p className="mt-1 truncate text-sm text-slate-500">
                    {request.description}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <Badge variant={getBadgeVariant(request.status)}>
                    {getStatusLabel(request.status)}
                  </Badge>
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                  {formatDate(request.createdAt)}
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <RequestStatusActions
                      status={request.status}
                      loading={updatingId === request.id}
                      onChange={(status) => onStatusChange(request.id, status)}
                    />

                    <button
                      type="button"
                      disabled={deletingId === request.id}
                      onClick={() => onDelete(request)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      title="Delete request"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="divide-y divide-slate-200 md:hidden">
        {requests.map((request) => (
          <div key={request.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-slate-900">
                  {request.clientName}
                </p>

                <p className="mt-1 font-medium text-slate-700">
                  {request.title}
                </p>
              </div>

              <Badge variant={getBadgeVariant(request.status)}>
                {getStatusLabel(request.status)}
              </Badge>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {request.description}
            </p>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {formatDate(request.createdAt)}
              </span>

              <div className="flex items-center gap-2">
                <RequestStatusActions
                  status={request.status}
                  loading={updatingId === request.id}
                  onChange={(status) => onStatusChange(request.id, status)}
                />

                <button
                  type="button"
                  disabled={deletingId === request.id}
                  onClick={() => onDelete(request)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
