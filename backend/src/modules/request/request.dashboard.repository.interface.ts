import type { RequestStatus } from "../../../generated/prisma/client.js";

export interface RequestStatusCounts {
  total: number;
  new: number;
  inProgress: number;
  done: number;
}

export interface MonthlyRequestCount {
  month: string;
  count: number;
}

export interface IRequestDashboardRepository {
  getStatusCounts(userId: number): Promise<RequestStatusCounts>;

  getMonthlyRequestCounts(userId: number): Promise<MonthlyRequestCount[]>;
}
