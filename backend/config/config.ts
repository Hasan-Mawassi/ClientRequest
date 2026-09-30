import dotenv from "dotenv";
// import type { StringValue } from "ms";
dotenv.config();

function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const requiredEnv = ["DATABASE_URL"] as const;

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}


// export const jwt = {
//   JWT_ACCESS_SECRET: getEnv("JWT_ACCESS_SECRET"),
//   JWT_ACCESS_EXPIRES: getEnv("JWT_ACCESS_EXPIRES"),
//   JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET"),
//   JWT_REFRESH_EXPIRES: getEnv("JWT_REFRESH_EXPIRES"),
//   BCRYPT_ROUNDS: Number(process.env.BCRYPT_ROUNDS ?? 12),
// };
export const config = {
//   nodeEnv: process.env.NODE_ENV ?? "development",
//   port: Number(process.env.PORT),
//   jwt,
  databaseUrl: process.env.DATABASE_URL!,
//   jwtSecret: process.env.JWT_SECRET!,
  
};

console.log(config.databaseUrl);
