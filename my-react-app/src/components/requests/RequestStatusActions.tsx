import { Check, Clock3 } from "lucide-react";
import type { RequestStatus } from "../../types/request";

interface RequestStatusActionsProps {
  status: RequestStatus;
  loading?: boolean;
  onChange: (status: RequestStatus) => void;
}

export default function RequestStatusActions({
  status,
  loading = false,
  onChange,
}: RequestStatusActionsProps) {
  if (status === "DONE") {
    return (
      <span className="text-xs font-medium text-emerald-600">Completed</span>
    );
  }

  if (status === "NEW") {
    return (
      <button
        type="button"
        disabled={loading}
        onClick={() => onChange("IN_PROGRESS")}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Clock3 className="h-3.5 w-3.5" />
        Start
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => onChange("DONE")}
      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Check className="h-3.5 w-3.5" />
      Complete
    </button>
  );
}
