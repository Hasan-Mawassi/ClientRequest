import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export default function ErrorState({
  message = "Something went wrong. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-60 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6 text-center">
      <div className="mb-3 rounded-full bg-red-50 p-3">
        <AlertCircle className="h-6 w-6 text-red-500" />
      </div>

      <h3 className="text-sm font-semibold text-slate-900">
        Unable to load data
      </h3>

      <p className="mt-1 max-w-sm text-sm text-slate-500">{message}</p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        <RefreshCw className="h-4 w-4" />
        Retry
      </button>
    </div>
  );
}
