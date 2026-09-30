import { prisma } from "../../lib/prisma.js";

import type { RequestStatus } from "../../../generated/prisma/client.js";

import type {
  FindRequestsParams,
  FindRequestsResult,
  IRequestRepository,
} from "./request.repository.interface.js";

export class RequestRepository implements IRequestRepository {
  async create(
    clientName: string,
    title: string,
    description: string,
    createdById: number,
  ) {
    return prisma.clientRequest.create({
      data: {
        clientName,
        title,
        description,
        createdById,
      },
    });
  }

  async findAll(params: FindRequestsParams): Promise<FindRequestsResult> {
    const { skip, take, status } = params;

    const where = status ? { status } : {};

    const [requests, total] = await prisma.$transaction([
      prisma.clientRequest.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.clientRequest.count({
        where,
      }),
    ]);

    return {
      requests,
      total,
    };
  }

  async findById(id: number) {
    return prisma.clientRequest.findUnique({
      where: { id },
    });
  }

  async updateStatus(id: number, status: RequestStatus) {
    return prisma.clientRequest.update({
      where: { id },
      data: {
        status,
      },
    });
  }

  async delete(id: number) {
    return prisma.clientRequest.delete({
      where: { id },
    });
  }
}
