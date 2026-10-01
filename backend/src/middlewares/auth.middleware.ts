import type { Request, Response, NextFunction } from "express";

import { verifyAccessToken } from "../utils/token.js";
import { ApiError } from "../utils/apiError.js";

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(ApiError.unauthorized("Authentication required"));
  }

  const token = authHeader.substring(7);

  if (!token) {
    return next(ApiError.unauthorized("Authentication required"));
  }

  try {
    const decoded = verifyAccessToken(token);

    req.user = decoded;

    next();
  } catch {
    next(ApiError.unauthorized("Invalid or expired access token"));
  }
};
