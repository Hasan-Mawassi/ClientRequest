import type { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";

import { RequestService } from "./request.service.js";
import { RequestRepository } from "./request.repository.js";

import { RequestDashboardRepository } from "./request.dashboard.repository.js";
import { RequestDashboardService } from "./request.dashboard.service.js";
import type { RequestQueryDTO } from "./request.validation.js";

const service = new RequestService(new RequestRepository());
const dashboardService = new RequestDashboardService(
  new RequestDashboardRepository(),
);

export const createRequest = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw ApiError.unauthorized("Authentication required");
  }

  const request = await service.create(req.body, req.user.id);

  return ApiResponse.sendSuccess(res, 201,"Request created successfully", request);
});

export const getRequests = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw ApiError.unauthorized("Authentication required");
  }

  const result = await service.getAll(req.query as any, req.user.id);

  return ApiResponse.sendSuccess(
    res,
    200,
    "Requests retrieved successfully",
    result,
  );
});

export const getRequestById = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw ApiError.unauthorized("Authentication required");
  }

  const request = await service.getById(Number(req.params.id), req.user.id);

  return ApiResponse.sendSuccess(
    res,
    200,
    "Request retrieved successfully",
    request,
  );
});

export const updateRequestStatus = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw ApiError.unauthorized("Authentication required");
  }

  const request = await service.updateStatus(
    Number(req.params.id),
    req.user.id,
    req.body,
  );

  return ApiResponse.sendSuccess(
    res,
    200,
    "Request status updated successfully",
    request,
  );
});

export const deleteRequest = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw ApiError.unauthorized("Authentication required");
  }

  await service.delete(Number(req.params.id), req.user.id);

  return res.status(204).send();
});

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
