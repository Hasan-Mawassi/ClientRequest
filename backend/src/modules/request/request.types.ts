import type { RequestStatus } from "../../../generated/prisma/client.js";

export interface CreateRequestDTO {
  clientName: string;
  title: string;
  description: string;
}

export interface UpdateRequestStatusDTO {
  status: RequestStatus;
}

export interface RequestQueryDTO {
  page: number;
  limit: number;
  status?: RequestStatus;
}

export interface PaginatedRequests {
  data: unknown[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
