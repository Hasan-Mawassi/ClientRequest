import { prisma } from "../../lib/prisma.js";
import type { IAuthRepository } from "./auth.repository.interface.js";

export class AuthRepository implements IAuthRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async create(name: string, email: string, passwordHash: string) {
    return prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });
  }
}
