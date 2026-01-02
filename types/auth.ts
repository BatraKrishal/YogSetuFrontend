// types/auth.ts
import { z } from "zod";

/**
 * LOGIN
 * Matches POST /auth/login
 */
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * SIGNUP
 * Matches POST /auth/register
 */
export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export type SignupInput = z.infer<typeof signupSchema>;

/**
 * FORGOT PASSWORD
 * Matches POST /auth/forgot-password
 */
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type ForgotPasswordInput = z.infer<
  typeof forgotPasswordSchema
>;

/**
 * RESET PASSWORD
 * Matches POST /auth/reset-password
 */
export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Invalid token"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export type ResetPasswordInput = z.infer<
  typeof resetPasswordSchema
>;
