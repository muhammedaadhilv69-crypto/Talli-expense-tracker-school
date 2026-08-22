import {infer as z_infer, string, email, object } from "zod";

export const signupSchema = object({
    name: string().min(2, "Name is too short"),
    email: email("Enter a valid email address"),
    password: string().min(8, "Password must be at least 8 characters"),
    confirmPassword: string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginSchema = object({
    email: email("Email is required."),
    password: string().min(8, "Password is at least 8 digits.")
});


export type SignupFormValues = z_infer<typeof signupSchema>;

export type LoginFormValues = z_infer<typeof loginSchema>;