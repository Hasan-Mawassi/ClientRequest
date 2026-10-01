export interface DashboardStats {
  totalRequests: number;
  newRequests: number;
  inProgressRequests: number;
  doneRequests: number;
}

export interface MonthlyRequestStats {
  month: string;
  count: number;
}
