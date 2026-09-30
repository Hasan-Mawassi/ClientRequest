import type { Request, Response } from "express";
import { ApiResponse } from "../../utils/apiResponse.js";
import { AuthService } from "./auth.service.js";
import { AuthRepository } from "./auth.repository.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { verifyAccessToken, verifyRefreshToken } from "../../utils/token.js";

const service = new AuthService(new AuthRepository());

const refreshCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure:
    process.env.COOKIE_SECURE === undefined
      ? process.env.NODE_ENV === "production"
      : process.env.COOKIE_SECURE === "true",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/api/auth/refresh",
};

const setRefreshCookie = (res: Response, refreshToken: string) => {
  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
};

export const register = asyncHandler(async (req: Request, res: Response) => {
 
    const result = await service.register(req.body);

    setRefreshCookie(res, result.refreshToken);

    ApiResponse.sendSuccess(res, 201, "Registered successfully", {
      accessToken: result.accessToken,
      user: result.user,
    });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.login(req.body);

  setRefreshCookie(res, result.refreshToken);

  ApiResponse.sendSuccess(res, 200, "Logged in successfully", {
    accessToken: result.accessToken,
    user: result.user,
  });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    path: "/api/auth/refresh",
  });

  ApiResponse.sendSuccess(res, 200, "Logged out successfully", undefined);
});

export const check = asyncHandler(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    ApiResponse.sendError(res, 401, "No access token provided");
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    ApiResponse.sendError(res, 401, "No access token provided");
    return;
  }

  try {
    const decoded = verifyAccessToken(token);

    ApiResponse.sendSuccess(res, 200, "Access token is valid", {
      valid: true,
      user: {
        id: decoded.id,
      },
    });
  } catch {
    ApiResponse.sendError(res, 401, "Invalid or expired access token");
  }
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    ApiResponse.sendError(res, 401, "No refresh token provided");
    return;
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);

    const user = await service.getUserById(decoded.id);

    if (!user) {
      ApiResponse.sendError(res, 401, "User not found");
      return;
    }

    const accessToken = service.generateAccessToken(user.id);
    const newRefreshToken = service.generateRefreshToken(user.id);

    setRefreshCookie(res, newRefreshToken);

    ApiResponse.sendSuccess(res, 200, "Token refreshed successfully", {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch {
    ApiResponse.sendError(res, 401, "Invalid or expired refresh token");
  }
});
