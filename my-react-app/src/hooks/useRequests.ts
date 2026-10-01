import { useCallback, useEffect, useState } from "react";

import {
  createRequestApi,
  deleteRequestApi,
  getRequestsApi,
  updateRequestStatusApi,
} from "../api/requests.api";

import type {
  ClientRequest,
  RequestPagination,
  RequestStatus,
} from "../types/request";

export function useRequests() {
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [pagination, setPagination] = useState<RequestPagination | null>(null);

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<RequestStatus | undefined>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /*
   * Fetch requests whenever page or status changes.
   *
   * The effect owns the initial/filter/pagination fetch.
   * This avoids calling a state-changing callback directly
   * from the effect.
   */
  useEffect(() => {
    let cancelled = false;

    const loadRequests = async () => {
      setIsLoading(true);
      setError(null);

      const result = await getRequestsApi({
        page,
        limit: 10,
        status,
      });

      if (cancelled) {
        return;
      }

      if (result.error) {
        setError(result.message);
        setIsLoading(false);
        return;
      }

      setRequests(result.data.data);
      setPagination(result.data.pagination);
      setIsLoading(false);
    };

    void loadRequests();

    return () => {
      cancelled = true;
    };
  }, [page, status]);

  /*
   * Explicit refetch.
   *
   * This is used after mutations such as create/delete.
   */
  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const result = await getRequestsApi({
      page,
      limit: 10,
      status,
    });

    if (result.error) {
      setError(result.message);
      setIsLoading(false);

      return {
        success: false,
        message: result.message,
      };
    }

    setRequests(result.data.data);
    setPagination(result.data.pagination);
    setIsLoading(false);

    return {
      success: true,
    };
  }, [page, status]);

  const createRequest = async (data: {
    clientName: string;
    title: string;
    description: string;
  }) => {
    const result = await createRequestApi(data);

    if (result.error) {
      return {
        success: false,
        message: result.message,
      };
    }

    await fetchRequests();

    return {
      success: true,
    };
  };


const updateStatus = async (id: number, nextStatus: RequestStatus) => {
  const result = await updateRequestStatusApi(id, nextStatus);

  if (result.error) {
    return {
      success: false,
      message: result.message,
    };
  }

  setRequests((current) => {
    if (status !== undefined && status !== nextStatus) {
      return current.filter((request) => request.id !== id);
    }

    return current.map((request) =>
      request.id === id
        ? {
            ...request,
            status: nextStatus,
            updatedAt: new Date().toISOString(),
          }
        : request,
    );
  });

  return {
    success: true,
  };
};
  const deleteRequest = async (id: number) => {
    const result = await deleteRequestApi(id);

    if (result.error) {
      return {
        success: false,
        message: result.message,
      };
    }

    /*
     * Remove it immediately from the current UI.
     */
    setRequests((current) => current.filter((request) => request.id !== id));

    /*
     * Refresh pagination/count information from the server.
     */
    await fetchRequests();

    return {
      success: true,
    };
  };

  const changeStatusFilter = (nextStatus?: RequestStatus) => {
    setPage(1);
    setStatus(nextStatus);
  };

  return {
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

    retry: fetchRequests,
  };
}