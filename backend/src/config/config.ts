import dotenv from "dotenv";
import type { StringValue } from "ms";

dotenv.config();

function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getEnvNumber(name: string, defaultValue?: number): number {
  const value = process.env[name];

  if (!value && defaultValue !== undefined) {
    return defaultValue;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(`Environment variable ${name} must be a valid number`);
  }

  return parsed;
}

function getJwtSecret(name: string): string {
  const value = getEnv(name);

  if (value.length < 32) {
    throw new Error(`${name} must contain at least 32 characters`);
  }

  return value;
}

const requiredEnv = [
  "DATABASE_URL",
  // "DATABASE_USER",
  // "DATABASE_HOST",
  // "DATABASE_PORT",
  // "DATABASE_NAME",
  "JWT_ACCESS_SECRET",
  "JWT_ACCESS_EXPIRES",
  "JWT_REFRESH_SECRET",
  "JWT_REFRESH_EXPIRES",
] as const;

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const database = {
  // user: getEnv("DATABASE_USER"),
  // password: process.env.DATABASE_PASSWORD ?? "",
  // host: getEnv("DATABASE_HOST"),
  // port: getEnvNumber("DATABASE_PORT"),
  // name: getEnv("DATABASE_NAME"),
};

export const jwt = {
  JWT_ACCESS_SECRET: getJwtSecret("JWT_ACCESS_SECRET"),
  JWT_ACCESS_EXPIRES: getEnv("JWT_ACCESS_EXPIRES") as StringValue,

  JWT_REFRESH_SECRET: getJwtSecret("JWT_REFRESH_SECRET"),
  JWT_REFRESH_EXPIRES: getEnv("JWT_REFRESH_EXPIRES") as StringValue,

  BCRYPT_ROUNDS: getEnvNumber("BCRYPT_ROUNDS", 12),
};

export const config = {
  nodeEnv: process.env.NODE_ENV ?? "development",

  port: getEnvNumber("PORT", 4000),

  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:5173",

  database,

  databaseUrl: getEnv("DATABASE_URL"),

  jwt,

  auth: {
    refreshCookieName: "refreshToken",
  },
};
