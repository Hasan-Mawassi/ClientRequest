export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(
    statusCode: number,
    message: string,
    code = "INTERNAL_SERVER_ERROR",
    details?: unknown,
  ) {
    super(message);

    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = "Bad request", details?: unknown) {
    return new ApiError(400, message, "BAD_REQUEST", details);
  }

  static unauthorized(message = "Unauthorized", details?: unknown) {
    return new ApiError(401, message, "UNAUTHORIZED", details);
  }

  static forbidden(message = "Forbidden", details?: unknown) {
    return new ApiError(403, message, "FORBIDDEN", details);
  }

  static notFound(message = "Resource not found", details?: unknown) {
    return new ApiError(404, message, "NOT_FOUND", details);
  }

  static conflict(message = "Conflict", details?: unknown) {
    return new ApiError(409, message, "CONFLICT", details);
  }

  static internal(message = "Internal server error", details?: unknown) {
    return new ApiError(500, message, "INTERNAL_SERVER_ERROR", details);
  }
}
