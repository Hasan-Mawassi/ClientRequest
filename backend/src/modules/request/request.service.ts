// import type { RequestStatus } from "../../../generated/prisma/client.js";

// import { ApiError } from "../../utils/apiError.js";

// import type { IRequestRepository } from "./request.repository.interface.js";

// import type {
//   CreateRequestDTO,
//   RequestQueryDTO,
//   UpdateRequestStatusDTO,
// } from "./request.validation.js";

// export class RequestService {
//   constructor(private readonly repository: IRequestRepository) {}

//   async create(data: CreateRequestDTO, createdById: number) {
//     return this.repository.create(
//       data.clientName,
//       data.title,
//       data.description,
//       createdById,
//     );
//   }

//   async getAll(query: RequestQueryDTO) {
//     const { page, limit, status } = query;

//     const skip = (page - 1) * limit;

//     const { requests, total } = await this.repository.findAll({
//       skip,
//       take: limit,
//       ...(status !== undefined && { status }),
//     });

//     const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

//     return {
//       data: requests,
//       pagination: {
//         page,
//         limit,
//         total,
//         totalPages,
//         hasNextPage: page < totalPages,
//         hasPreviousPage: page > 1 && totalPages > 0,
//       },
//     };
//   }

//   async getById(id: number) {
//     const request = await this.repository.findById(id);

//     if (!request) {
//       throw ApiError.notFound("Request not found");
//     }

//     return request;
//   }

//   async updateStatus(id: number, data: UpdateRequestStatusDTO) {
//     const request = await this.repository.findById(id);

//     if (!request) {
//       throw ApiError.notFound("Request not found");
//     }

//     this.validateStatusTransition(request.status, data.status);

//     return this.repository.updateStatus(id, data.status);
//   }

//   async delete(id: number) {
//     await this.getById(id);

//     return this.repository.delete(id);
//   }

//   private validateStatusTransition(
//     currentStatus: RequestStatus,
//     nextStatus: RequestStatus,
//   ) {
//     if (currentStatus === nextStatus) {
//       throw ApiError.badRequest("Request already has this status");
//     }

//     const allowedTransitions: Record<RequestStatus, RequestStatus[]> = {
//       NEW: ["IN_PROGRESS"],
//       IN_PROGRESS: ["DONE"],
//       DONE: [],
//     };

//     if (!allowedTransitions[currentStatus].includes(nextStatus)) {
//       throw ApiError.badRequest(
//         `Invalid status transition: ${currentStatus} -> ${nextStatus}`,
//       );
//     }
//   }
// }

import type { RequestStatus } from "../../../generated/prisma/client.js";

import { ApiError } from "../../utils/apiError.js";

import type {
  CreateRequestDTO,
  RequestQueryDTO,
  UpdateRequestStatusDTO,
} from "./request.validation.js";

import type { IRequestRepository } from "./request.repository.interface.js";

export class RequestService {
  constructor(private readonly repository: IRequestRepository) {}

  async create(data: CreateRequestDTO, createdById: number) {
    return this.repository.create(
      data.clientName,
      data.title,
      data.description,
      createdById,
    );
  }

  async getAll(query: RequestQueryDTO, userId: number) {
    const { page, limit, status } = query;

    const skip = (page - 1) * limit;

    const { requests, total } = await this.repository.findAll({
      userId,
      skip,
      take: limit,
      ...(status !== undefined && { status }),
    });

    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

    return {
      data: requests,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1 && totalPages > 0,
      },
    };
  }

  async getById(id: number, userId: number) {
    const request = await this.repository.findById(id, userId);

    if (!request) {
      throw ApiError.notFound("Request not found");
    }

    return request;
  }

  async updateStatus(id: number, userId: number, data: UpdateRequestStatusDTO) {
    const request = await this.repository.findById(id, userId);

    if (!request) {
      throw ApiError.notFound("Request not found");
    }

    this.validateStatusTransition(request.status, data.status);

    return this.repository.updateStatus(id, userId, data.status);
  }

  async delete(id: number, userId: number) {
    const request = await this.repository.findById(id, userId);

    if (!request) {
      throw ApiError.notFound("Request not found");
    }

    await this.repository.delete(id, userId);

    return request;
  }

  private validateStatusTransition(
    currentStatus: RequestStatus,
    nextStatus: RequestStatus,
  ) {
    if (currentStatus === nextStatus) {
      throw ApiError.badRequest("Request already has this status");
    }

    const allowedTransitions: Record<RequestStatus, RequestStatus[]> = {
      NEW: ["IN_PROGRESS"],
      IN_PROGRESS: ["DONE"],
      DONE: [],
    };

    if (!allowedTransitions[currentStatus].includes(nextStatus)) {
      throw ApiError.badRequest(
        `Invalid status transition: ${currentStatus} -> ${nextStatus}`,
      );
    }
  }
}
