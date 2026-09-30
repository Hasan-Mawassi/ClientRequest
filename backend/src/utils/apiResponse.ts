// src/utils/apiResponse.ts

import type { Response } from "express";

export interface ApiResponseSchema<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T | null;
  error?: any;
}

export class ApiResponse {
  /**
   * Standard Success Response object builder
   */
  static success<T>(
    statusCode: number,
    message: string,
    data: T = null as any,
  ): ApiResponseSchema<T> {
    return {
      success: true,
      statusCode,
      message,
      data,
    };
  }

  /**
   * Standard Error Response object builder
   */
  static error(
    statusCode: number,
    message: string,
    error: any = null,
  ): ApiResponseSchema {
    return {
      success: false,
      statusCode,
      message,
      error: error || undefined,
    };
  }

  /**
   * Send a standard success response through Express
   */
  static sendSuccess<T>(
    res: Response,
    statusCode: number,
    message: string,
    data: T = null as any,
  ) {
    return res
      .status(statusCode)
      .json(ApiResponse.success(statusCode, message, data));
  }

  /**
   * Send a standard error response through Express
   */
  static sendError(
    res: Response,
    statusCode: number,
    message: string,
    error: any = null,
  ) {
    return res
      .status(statusCode)
      .json(ApiResponse.error(statusCode, message, error));
  }
}
