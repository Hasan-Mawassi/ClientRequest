import { prisma } from "../../lib/prisma.js";
import type {
  IRequestDashboardRepository,
  MonthlyRequestCount,
  RequestStatusCounts,
} from "./request.dashboard.repository.interface.js";

export class RequestDashboardRepository implements IRequestDashboardRepository {
  async getStatusCounts(userId: number): Promise<RequestStatusCounts> {
    const where = {
      createdById: userId,
    };

    const [total, newRequests, inProgress, done] = await Promise.all([
      prisma.clientRequest.count({
        where,
      }),

      prisma.clientRequest.count({
        where: {
          ...where,
          status: "NEW",
        },
      }),

      prisma.clientRequest.count({
        where: {
          ...where,
          status: "IN_PROGRESS",
        },
      }),

      prisma.clientRequest.count({
        where: {
          ...where,
          status: "DONE",
        },
      }),
    ]);

    return {
      total,
      new: newRequests,
      inProgress,
      done,
    };
  }

  async getMonthlyRequestCounts(
    userId: number,
  ): Promise<MonthlyRequestCount[]> {
    const result = await prisma.$queryRaw<{ month: Date; count: bigint }[]>`
      SELECT
        DATE_TRUNC('month', "createdAt") AS month,
        COUNT(*) AS count
      FROM "ClientRequest"
      WHERE "createdById" = ${userId}
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month ASC
    `;

    return result.map((item) => ({
      month: item.month.toISOString().slice(0, 7),
      count: Number(item.count),
    }));
  }
}
