// import type {
//   ClientRequest,
//   RequestStatus,
// } from "../../../generated/prisma/client.js";

// export interface FindRequestsParams {
//   skip: number;
//   take: number;
//   status?: RequestStatus;
// }

// export interface FindRequestsResult {
//   requests: ClientRequest[];
//   total: number;
// }

// export interface IRequestRepository {
//   create(
//     clientName: string,
//     title: string,
//     description: string,
//     createdById: number,
//   ): Promise<ClientRequest>;

//   findAll(params: FindRequestsParams): Promise<FindRequestsResult>;

//   findById(id: number): Promise<ClientRequest | null>;

//   updateStatus(id: number, status: RequestStatus): Promise<ClientRequest>;

//   delete(id: number): Promise<ClientRequest>;
// }
import type {
  ClientRequest,
  RequestStatus,
} from "../../../generated/prisma/client.js";

export interface FindRequestsParams {
  userId: number;
  skip: number;
  take: number;
  status?: RequestStatus;
}

export interface FindRequestsResult {
  requests: ClientRequest[];
  total: number;
}

export interface IRequestRepository {
  create(
    clientName: string,
    title: string,
    description: string,
    createdById: number,
  ): Promise<ClientRequest>;

  findAll(params: FindRequestsParams): Promise<FindRequestsResult>;

  findById(id: number, userId: number): Promise<ClientRequest | null>;

  updateStatus(
    id: number,
    userId: number,
    status: RequestStatus,
  ): Promise<ClientRequest>;

  delete(id: number, userId: number): Promise<void>;
}