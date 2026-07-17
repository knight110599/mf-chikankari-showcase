import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters"),

    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters"),

    email: z
      .string()
      .trim()
      .email("Please enter a valid email address")
      .toLowerCase(),

    phone: z
      .string()
      .trim()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must not exceed 15 digits"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
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