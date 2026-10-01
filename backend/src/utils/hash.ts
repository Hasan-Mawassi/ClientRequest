import bcrypt from "bcryptjs";
import { config } from "../config/config.js";

const SALT = config.jwt.BCRYPT_ROUNDS;

export const hashPassword = (password: string) => bcrypt.hash(password, SALT);

export const comparePassword = (password: string, hash: string) =>
  bcrypt.compare(password, hash);
