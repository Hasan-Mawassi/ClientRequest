// import { useCallback, useEffect, useState } from "react";

// import {
//   getDashboardStatsApi,
//   getMonthlyDashboardStatsApi,
// } from "../api/dashboard.api";

// import { getRequestsApi } from "../api/requests.api";

// import type { DashboardStats, MonthlyRequestStats } from "../types/dashboard";

// import type { ClientRequest } from "../types/request";

// interface DashboardData {
//   stats: DashboardStats | null;
//   monthlyStats: MonthlyRequestStats[];
//   recentRequests: ClientRequest[];
// }

// export function useDashboard() {
//   const [data, setData] = useState<DashboardData>({
//     stats: null,
//     monthlyStats: [],
//     recentRequests: [],
//   });

//   const [isStatsLoading, setIsStatsLoading] = useState(true);
//   const [isMonthlyLoading, setIsMonthlyLoading] = useState(true);
//   const [isRecentRequestsLoading, setIsRecentRequestsLoading] = useState(true);
//   const [statsError, setStatsError] = useState<string | null>(null);
//   const [monthlyError, setMonthlyError] = useState<string | null>(null);
//   const [recentRequestsError, setRecentRequestsError] = useState<string | null>(
//     null,
//   );

//   const fetchStats = useCallback(async () => {
//     setIsStatsLoading(true);
//     setStatsError(null);

//     const result = await getDashboardStatsApi();

//     if (result.error) {
//       setStatsError(result.message);
//     } else {
//       setData((current) => ({ ...current, stats: result.data }));
//     }

//     setIsStatsLoading(false);
//   }, []);

//   const fetchMonthlyStats = useCallback(async () => {
//     setIsMonthlyLoading(true);
//     setMonthlyError(null);

//     const result = await getMonthlyDashboardStatsApi();

//     if (result.error) {
//       setMonthlyError(result.message);
//     } else {
//       setData((current) => ({ ...current, monthlyStats: result.data }));
//     }
//     setIsMonthlyLoading(false);
//   }, []);

//   const fetchRecentRequests = useCallback(async () => {
//     setIsRecentRequestsLoading(true);
//     setRecentRequestsError(null);

//     const result = await getRequestsApi({
//       page: 1,
//       limit: 10,
//     });

//     if (result.error) {
//       setRecentRequestsError(result.message);
//     } else {
//       setData((current) => ({
//         ...current,
//         recentRequests: result.data.data,
//       }));
//     }
//     setIsRecentRequestsLoading(false);
//   }, []);

//   const fetchDashboard = useCallback(async () => {
//     await Promise.all([
//       fetchStats(),
//       fetchMonthlyStats(),
//       fetchRecentRequests(),
//     ]);
//   }, []);

//   useEffect(() => {
//     void fetchDashboard();
//   }, [fetchDashboard]);

//   return {
//     ...data,
//     isStatsLoading,
//     isMonthlyLoading,
//     isRecentRequestsLoading,
//     statsError,
//     monthlyError,
//     recentRequestsError,
//     retryStats: fetchStats,
//     retryMonthlyStats: fetchMonthlyStats,
//     retryRecentRequests: fetchRecentRequests,
//     retry: fetchDashboard,
//   };
// }
import { useCallback, useEffect, useState } from "react";

import {
  getDashboardStatsApi,
  getMonthlyDashboardStatsApi,
} from "../api/dashboard.api";

import { getRequestsApi } from "../api/requests.api";

import type { DashboardStats, MonthlyRequestStats } from "../types/dashboard";

import type { ClientRequest } from "../types/request";

interface DashboardData {
  stats: DashboardStats | null;
  monthlyStats: MonthlyRequestStats[];
  recentRequests: ClientRequest[];
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData>({
    stats: null,
    monthlyStats: [],
    recentRequests: [],
  });

  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [isMonthlyLoading, setIsMonthlyLoading] = useState(true);
  const [isRecentRequestsLoading, setIsRecentRequestsLoading] = useState(true);

  const [statsError, setStatsError] = useState<string | null>(null);
  const [monthlyError, setMonthlyError] = useState<string | null>(null);
  const [recentRequestsError, setRecentRequestsError] = useState<string | null>(
    null,
  );

  const fetchStats = useCallback(async () => {
    setIsStatsLoading(true);
    setStatsError(null);

    const result = await getDashboardStatsApi();

    if (result.error) {
      setStatsError(result.message);
    } else {
      setData((current) => ({
        ...current,
        stats: result.data,
      }));
    }

    setIsStatsLoading(false);
  }, []);

  const fetchMonthlyStats = useCallback(async () => {
    setIsMonthlyLoading(true);
    setMonthlyError(null);

    const result = await getMonthlyDashboardStatsApi();

    if (result.error) {
      setMonthlyError(result.message);
    } else {
      setData((current) => ({
        ...current,
        monthlyStats: result.data,
      }));
    }

    setIsMonthlyLoading(false);
  }, []);

  const fetchRecentRequests = useCallback(async () => {
    setIsRecentRequestsLoading(true);
    setRecentRequestsError(null);

    const result = await getRequestsApi({
      page: 1,
      limit: 10,
    });

    if (result.error) {
      setRecentRequestsError(result.message);
    } else {
      setData((current) => ({
        ...current,
        recentRequests: result.data.data,
      }));
    }

    setIsRecentRequestsLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      const [statsResult, monthlyResult, requestsResult] = await Promise.all([
        getDashboardStatsApi(),
        getMonthlyDashboardStatsApi(),
        getRequestsApi({
          page: 1,
          limit: 10,
        }),
      ]);

      if (cancelled) {
        return;
      }

      if (statsResult.error) {
        setStatsError(statsResult.message);
      } else {
        setData((current) => ({
          ...current,
          stats: statsResult.data,
        }));
      }

      setIsStatsLoading(false);

      if (monthlyResult.error) {
        setMonthlyError(monthlyResult.message);
      } else {
        setData((current) => ({
          ...current,
          monthlyStats: monthlyResult.data,
        }));
      }

      setIsMonthlyLoading(false);

      if (requestsResult.error) {
        setRecentRequestsError(requestsResult.message);
      } else {
        setData((current) => ({
          ...current,
          recentRequests: requestsResult.data.data,
        }));
      }

      setIsRecentRequestsLoading(false);
    };

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  const retry = useCallback(async () => {
    await Promise.all([
      fetchStats(),
      fetchMonthlyStats(),
      fetchRecentRequests(),
    ]);
  }, [fetchStats, fetchMonthlyStats, fetchRecentRequests]);

  return {
    ...data,

    isStatsLoading,
    isMonthlyLoading,
    isRecentRequestsLoading,

    statsError,
    monthlyError,
    recentRequestsError,

    retryStats: fetchStats,
    retryMonthlyStats: fetchMonthlyStats,
    retryRecentRequests: fetchRecentRequests,

    retry,
  };
}