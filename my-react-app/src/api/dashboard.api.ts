import { request } from "./request";

import type { DashboardStats, MonthlyRequestStats } from "../types/dashboard";

export const getDashboardStatsApi = () =>
  request<DashboardStats>({
    method: "GET",
    route: "/requests/dashboard/stats",
    auth: true,
  });

export const getMonthlyDashboardStatsApi = () =>
  request<MonthlyRequestStats[]>({
    method: "GET",
    route: "/requests/dashboard/monthly",
    auth: true,
  });
