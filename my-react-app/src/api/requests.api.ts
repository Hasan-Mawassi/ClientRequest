// import { request } from "./request";

// import type { RequestListResponse, RequestStatus } from "../types/request";

// interface GetRequestsParams {
//   page?: number;
//   limit?: number;
//   status?: RequestStatus;
// }

// export const getRequestsApi = ({
//   page = 1,
//   limit = 10,
//   status,
// }: GetRequestsParams = {}) => {
//   const params = new URLSearchParams();

//   params.set("page", String(page));
//   params.set("limit", String(limit));

//   if (status) {
//     params.set("status", status);
//   }

//   return request<RequestListResponse>({
//     method: "GET",
//     route: `/requests?${params.toString()}`,
//     auth: true,
//   });
// };

import { request } from "./request";
import type {
  ClientRequest,
  RequestListResponse,
  RequestStatus,
} from "../types/request";

interface GetRequestsParams {
  page?: number;
  limit?: number;
  status?: RequestStatus;
}

export const getRequestsApi = ({
  page = 1,
  limit = 10,
  status,
}: GetRequestsParams = {}) => {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("limit", String(limit));

  if (status) {
    params.set("status", status);
  }

  return request<RequestListResponse>({
    method: "GET",
    route: `/requests?${params.toString()}`,
    auth: true,
  });
};

export interface CreateRequestPayload {
  clientName: string;
  title: string;
  description: string;
}

export const createRequestApi = (payload: CreateRequestPayload) =>
  request<ClientRequest>({
    method: "POST",
    route: "/requests",
    body: payload,
    auth: true,
  });

export const updateRequestStatusApi = (id: number, status: RequestStatus) =>
  request<ClientRequest>({
    method: "PATCH",
    route: `/requests/${id}/status`,
    body: { status },
    auth: true,
  });

export const deleteRequestApi = (id: number) =>
  request<void>({
    method: "DELETE",
    route: `/requests/${id}`,
    auth: true,
  });

export const getRequestByIdApi = (id: number) =>
  request<ClientRequest>({
    method: "GET",
    route: `/requests/${id}`,
    auth: true,
  });