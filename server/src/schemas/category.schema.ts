import { z } from "zod";

const slugSchema = z
  .string()
  .trim()
  .min(2, "Slug must contain at least 2 characters.")
  .max(120, "Slug cannot exceed 120 characters.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must contain only lowercase letters, numbers and hyphens.",
  );

export const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Category name must contain at least 2 characters.")
      .max(100, "Category name cannot exceed 100 characters."),

    slug: slugSchema,

    description: z
      .string()
      .trim()
      .max(500, "Description cannot exceed 500 characters.")
      .optional()
      .or(z.literal("")),

    imageUrl: z
      .string()
      .trim()
      .url("Image URL must be valid.")
      .optional()
      .or(z.literal("")),

    isActive: z.boolean().optional(),

    sortOrder: z
      .number()
      .int("Sort order must be an integer.")
      .min(0, "Sort order cannot be negative.")
      .optional(),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().cuid("Invalid category ID."),
  }),

  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(2, "Category name must contain at least 2 characters.")
        .max(100, "Category name cannot exceed 100 characters.")
        .optional(),

      slug: slugSchema.optional(),

      description: z
        .string()
        .trim()
        .max(500, "Description cannot exceed 500 characters.")
        .optional()
        .or(z.literal("")),

      imageUrl: z
        .string()
        .trim()
        .url("Image URL must be valid.")
        .optional()
        .or(z.literal("")),

      isActive: z.boolean().optional(),

      sortOrder: z
        .number()
        .int("Sort order must be an integer.")
        .min(0, "Sort order cannot be negative.")
        .optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      "At least one field must be provided.",
    ),
});

export const categoryIdSchema = z.object({
  params: z.object({
    id: z.string().cuid("Invalid category ID."),
  }),
});

export const categoryQuerySchema = z.object({
  query: z.object({
    includeInactive: z
      .enum(["true", "false"])
      .optional()
      .transform((value) => value === "true"),

    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(100).default(20),

    search: z.string().trim().max(100).optional(),
  }),
});

export type CreateCategoryInput = z.infer<
  typeof createCategorySchema
>["body"];

export type UpdateCategoryInput = z.infer<
  typeof updateCategorySchema
>["body"];