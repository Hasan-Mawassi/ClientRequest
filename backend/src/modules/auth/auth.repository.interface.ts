import type { User } from "../../../generated/prisma/client.js";

export interface IAuthRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  create(name: string, email: string, passwordHash: string): Promise<User>;
}
