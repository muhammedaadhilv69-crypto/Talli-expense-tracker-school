import { z } from "zod";

export const signupSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.email("Email is required"),
    password: z.string().min(8, "Password must be at least 8 characters."),
  });
export const loginSchema = z.object({
  email: z.email("Email is required"),
  password: z.string().min(8, "Password is at least 8 characters"),
});

export type SignupFormValues = z.infer<typeof signupSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
