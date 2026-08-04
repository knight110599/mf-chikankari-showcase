import { z } from "zod";

const userRoleSchema = z.enum([
  "CUSTOMER",
  "WHOLESALE",
  "ADMIN",
]);

const userStatusSchema = z.enum([
  "ACTIVE",
  "SUSPENDED",
  "DELETED",
]);

export const listUsersSchema = z.object({
  query: z.object({
    page: z.coerce
      .number()
      .int()
      .min(1)
      .default(1),

    limit: z.coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20),

    search: z
      .string()
      .trim()
      .optional(),

    role: userRoleSchema.optional(),

    status: userStatusSchema.optional(),
  }),
});

export const updateUserStatusSchema = z.object({
  params: z.object({
    userId: z
      .string()
      .trim()
      .min(1, "User ID is required."),
  }),

  body: z.object({
    status: userStatusSchema,
  }),
});

export const updateUserRoleSchema = z.object({
  params: z.object({
    userId: z
      .string()
      .trim()
      .min(1, "User ID is required."),
  }),

  body: z.object({
    role: userRoleSchema,
  }),
});

export type ListUsersQuery =
  z.infer<
    typeof listUsersSchema
  >["query"];

export type UpdateUserStatusInput =
  z.infer<
    typeof updateUserStatusSchema
  >["body"];

export type UpdateUserRoleInput =
  z.infer<
    typeof updateUserRoleSchema
  >["body"];