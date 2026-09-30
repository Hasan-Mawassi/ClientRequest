import type { RequestHandler } from "express";

import { ApiError } from "../utils/apiError.js";

export const notFoundMiddleware: RequestHandler = (req, _res, next) => {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};
