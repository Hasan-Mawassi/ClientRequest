import type { IRequestDashboardRepository } from "./request.dashboard.repository.interface.js";
import type {
  DashboardStats,
  MonthlyRequestStats,
} from "./request.dashboard.types.js";

export class RequestDashboardService {
  constructor(private readonly repository: IRequestDashboardRepository) {}

  async getStats(userId: number): Promise<DashboardStats> {
    const stats = await this.repository.getStatusCounts(userId);

    return {
      totalRequests: stats.total,
      newRequests: stats.new,
      inProgressRequests: stats.inProgress,
      doneRequests: stats.done,
    };
  }

  async getMonthlyStats(userId: number): Promise<MonthlyRequestStats[]> {
    return this.repository.getMonthlyRequestCounts(userId);
  }
}
