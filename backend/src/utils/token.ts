import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import type { AuthPayload } from "../modules/auth/auth.types.js";

export const generateAccessToken = (id: number) => {
  return jwt.sign(
    {
      id,
    },
    config.jwt.JWT_ACCESS_SECRET as string,
    {
      expiresIn: config.jwt.JWT_ACCESS_EXPIRES,
    },
  );
};

export const generateRefreshToken = (id: number) => {
  return jwt.sign(
    {
      id,
    },
    config.jwt.JWT_REFRESH_SECRET as string,
    {
      expiresIn: config.jwt.JWT_REFRESH_EXPIRES,
    },
  );
};

export const verifyAccessToken = (token: string): AuthPayload => {
  return jwt.verify(
    token,
    config.jwt.JWT_ACCESS_SECRET as string,
  ) as AuthPayload;
};

export const verifyRefreshToken = (token: string): AuthPayload => {
  return jwt.verify(
    token,
    config.jwt.JWT_REFRESH_SECRET as string,
  ) as AuthPayload;
};
