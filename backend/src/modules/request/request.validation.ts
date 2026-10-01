import { z } from "zod";

export const createRequestSchema = z.object({
  clientName: z
    .string()
    .trim()
    .min(2, "Client name must contain at least 2 characters")
    .max(100, "Client name cannot exceed 100 characters"),

  title: z
    .string()
    .trim()
    .min(2, "Title must contain at least 2 characters")
    .max(150, "Title cannot exceed 150 characters"),

  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(2000, "Description cannot exceed 2000 characters"),
});

export const updateRequestStatusSchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "DONE"]),
});

export const requestIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const requestQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce.number().int().positive().max(100).default(10),

  status: z.enum(["NEW", "IN_PROGRESS", "DONE"]).optional(),
});

export type CreateRequestDTO = z.infer<typeof createRequestSchema>;

export type UpdateRequestStatusDTO = z.infer<typeof updateRequestStatusSchema>;

export type RequestQueryDTO = z.infer<typeof requestQuerySchema>;
