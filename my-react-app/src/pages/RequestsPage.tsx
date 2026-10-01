import { Plus, RefreshCw } from "lucide-react";
import { useState } from "react";

import Button from "../components/ui/Button";
import ErrorState from "../components/ui/ErrorState";
import Modal from "../components/ui/Modal";
import Pagination from "../components/ui/Pagination";

import RequestFilters from "../components/requests/RequestFilters";
import RequestTable from "../components/requests/RequestTable";
import CreateRequestModal from "../components/requests/CreateRequestModal";
import RequestsSkeleton from "../components/requests/RequestsSkeleton";

import { useRequests } from "../hooks/useRequests";

import type { ClientRequest, RequestStatus } from "../types/request";

export default function RequestsPage() {
  const {
    requests,
    pagination,
    page,
    status,
    isLoading,
    error,
    setPage,
    changeStatusFilter,
    createRequest,
    updateStatus,
    deleteRequest,
    retry,
  } = useRequests();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<ClientRequest | null>(null);

  const [actionError, setActionError] = useState<string | null>(null);

  const handleStatusChange = async (id: number, nextStatus: RequestStatus) => {
    setUpdatingId(id);
    setActionError(null);

    const result = await updateStatus(id, nextStatus);

    setUpdatingId(null);

    if (!result.success) {
      setActionError(result.message ?? "Unable to update request");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setDeletingId(deleteTarget.id);
    setActionError(null);

    const result = await deleteRequest(deleteTarget.id);

    setDeletingId(null);

    if (!result.success) {
      setActionError(result.message ?? "Unable to delete request");
      return;
    }

    setDeleteTarget(null);
  };

  if (isLoading && requests.length === 0) {
    return <RequestsSkeleton />;
  }

  if (error && requests.length === 0) {
    return <ErrorState message={error} onRetry={retry} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3">
          <p className="text-5xl mb-2 font-bold tracking-tight text-slate-900">
            Requests
          </p>

          <p className="mt-3 text-sm text-slate-500">
            Manage and track your client requests.
          </p>
        </div>

        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Create Request
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <RequestFilters value={status} onChange={changeStatusFilter} />

        <button
          type="button"
          onClick={retry}
          disabled={isLoading}
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Action error */}
      {actionError && (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-600">{actionError}</p>

          <button
            type="button"
            onClick={() => setActionError(null)}
            className="text-xs font-medium text-red-600 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Table */}
      <RequestTable
        requests={requests}
        updatingId={updatingId}
        deletingId={deletingId}
        onStatusChange={handleStatusChange}
        onDelete={setDeleteTarget}
      />

      {/* Pagination */}
      {pagination && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          hasNextPage={pagination.hasNextPage}
          hasPreviousPage={pagination.hasPreviousPage}
          onPrevious={() => setPage(page - 1)}
          onNext={() => setPage(page + 1)}
        />
      )}

      {/* Create */}
      <CreateRequestModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={createRequest}
      />

      {/* Delete confirmation */}
      {deleteTarget && (
        <DeleteRequestModal
          request={deleteTarget}
          loading={deletingId === deleteTarget.id}
          onCancel={() => {
            if (!deletingId) {
              setDeleteTarget(null);
            }
          }}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

interface DeleteRequestModalProps {
  request: ClientRequest;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function DeleteRequestModal({
  request,
  loading,
  onCancel,
  onConfirm,
}: DeleteRequestModalProps) {
  return (
    <Modal isOpen onClose={onCancel} title="Delete Request">
      <div className="space-y-5">
        <p className="text-sm leading-6 text-slate-600">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-900">{request.title}</span>?
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="danger"
            loading={loading}
            onClick={onConfirm}
          >
            Delete Request
          </Button>
        </div>
      </div>
    </Modal>
  );
}
