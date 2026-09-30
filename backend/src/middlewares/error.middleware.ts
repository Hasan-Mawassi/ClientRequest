import type { ErrorRequestHandler } from "express";

import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const errorMiddleware: ErrorRequestHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof ApiError) {
    return ApiResponse.sendError(
      res,
      error.statusCode,
      error.message,
      error.details ?? error.code,
    );
  }

  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    error.code === "P2002"
  ) {
    return ApiResponse.sendError(
      res,
      409,
      "A record with this value already exists",
      "CONFLICT",
    );
  }

  console.error(`[${req.method}] ${req.originalUrl}`, error);

  return ApiResponse.sendError(
    res,
    500,
    "Internal server error",
    "INTERNAL_SERVER_ERROR",
  );
};
