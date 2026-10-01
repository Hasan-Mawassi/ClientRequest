import type { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";

import { RequestService } from "./request.service.js";
import { RequestRepository } from "./request.repository.js";

import { RequestDashboardRepository } from "./request.dashboard.repository.js";
import { RequestDashboardService } from "./request.dashboard.service.js";

const service = new RequestService(new RequestRepository());
const dashboardService = new RequestDashboardService(
  new RequestDashboardRepository(),
);

export const createRequest = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw ApiError.unauthorized("Authentication required");
    }

    const request = await service.create(req.body, req.user.id);

    return ApiResponse.sendSuccess(
      res,
      201,
      "Request created successfully",
      request,
    );
  },
);

export const getRequests = asyncHandler(async (req: Request, res: Response) => {
  const query = {
    page: Number(req.query.page),
    limit: Number(req.query.limit),
    status: typeof req.query.status === "string" ? req.query.status : undefined,
  };

  const result = await service.getAll(query as any);

  return ApiResponse.sendSuccess(
    res,
    200,
    "Requests retrieved successfully",
    result,
  );
});

export const getRequestById = asyncHandler(
  async (req: Request, res: Response) => {
    const request = await service.getById(Number(req.params.id));

    return ApiResponse.sendSuccess(
      res,
      200,
      "Request retrieved successfully",
      request,
    );
  },
);

export const updateRequestStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const request = await service.updateStatus(Number(req.params.id), req.body);

    return ApiResponse.sendSuccess(
      res,
      200,
      "Request status updated successfully",
      request,
    );
  },
);

export const deleteRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const request = await service.delete(Number(req.params.id));

    return ApiResponse.sendSuccess(
      res,
      200,
      "Request deleted successfully",
      request,
    );
  },
);

export const getDashboardStats = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw ApiError.unauthorized("Authentication required");
    }

    const stats = await dashboardService.getStats(req.user.id);

    return ApiResponse.sendSuccess(
      res,
      200,
      "Dashboard statistics retrieved successfully",
      stats,
    );
  },
);

export const getMonthlyDashboardStats = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw ApiError.unauthorized("Authentication required");
    }

    const stats = await dashboardService.getMonthlyStats(req.user.id);

    return ApiResponse.sendSuccess(
      res,
      200,
      "Monthly request statistics retrieved successfully",
      stats,
    );
  },
);