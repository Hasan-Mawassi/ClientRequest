import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254),

  password: z
    .string()
    .min(8)
    .max(100)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/),
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string(),
});
export type RegisterDTO = z.infer<typeof registerSchema>;

export type LoginDTO = z.infer<typeof loginSchema>;
