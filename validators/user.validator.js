import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["owner", "client"], {
    errorMap: () => ({ message: "Role must be user or admin" }),
  }),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});