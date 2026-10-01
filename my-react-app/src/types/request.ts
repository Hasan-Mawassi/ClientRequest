export type RequestStatus = "NEW" | "IN_PROGRESS" | "DONE";

export interface ClientRequest {
  id: number;
  clientName: string;
  title: string;
  description: string;
  status: RequestStatus;
  createdById: number;
  createdAt: string;
  updatedAt: string;
}

export interface RequestPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface RequestListResponse {
  data: ClientRequest[];
  pagination: RequestPagination;
}
