import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must not exceed 50 characters"),

    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must not exceed 50 characters"),

    email: z
      .string()
      .trim()
      .email("Please enter a valid email address")
      .toLowerCase(),

    phone: z
      .string()
      .trim()
      .regex(
        /^\+?[0-9]{10,15}$/,
        "Please enter a valid phone number",
      )
      .optional()
      .or(z.literal("")),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password must not exceed 72 characters")
      .regex(
        /[A-Z]/,
        "Password must contain an uppercase letter",
      )
      .regex(
        /[a-z]/,
        "Password must contain a lowercase letter",
      )
      .regex(/[0-9]/, "Password must contain a number"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address")
      .toLowerCase(),

    password: z.string().min(1, "Password is required"),
  }),
});

export type RegisterInput = z.infer<
  typeof registerSchema
>["body"];

export type LoginInput = z.infer<
  typeof loginSchema
>["body"];