import type { RequestHandler } from "express";
import type { ZodType } from "zod";

import { ApiError } from "../utils/apiError.js";

interface ValidationSchemas {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
}

export function validate(schemas: ValidationSchemas): RequestHandler {
  return (req, _res, next) => {
    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);

      if (!result.success) {
        return next(
          ApiError.badRequest("Validation failed", result.error.flatten()),
        );
      }

      req.body = result.data;
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);

      if (!result.success) {
        return next(
          ApiError.badRequest(
            "Invalid route parameters",
            result.error.flatten(),
          ),
        );
      }

      req.params = result.data as typeof req.params;
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);

      if (!result.success) {
        return next(
          ApiError.badRequest(
            "Invalid query parameters",
            result.error.flatten(),
          ),
        );
      }

      req.query = result.data as typeof req.query;
    }

    next();
  };
}
