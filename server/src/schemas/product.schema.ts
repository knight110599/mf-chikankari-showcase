import { z } from "zod";

const slugSchema = z
  .string()
  .trim()
  .min(2, "Slug must contain at least 2 characters.")
  .max(160, "Slug cannot exceed 160 characters.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must contain only lowercase letters, numbers and hyphens.",
  );

const skuSchema = z
  .string()
  .trim()
  .min(2, "SKU must contain at least 2 characters.")
  .max(80, "SKU cannot exceed 80 characters.")
  .regex(
    /^[A-Z0-9-_]+$/,
    "SKU must contain only uppercase letters, numbers, hyphens and underscores.",
  );

const productImageSchema = z.object({
  url: z.string().trim().url("Image URL must be valid."),

  altText: z
    .string()
    .trim()
    .max(160, "Alt text cannot exceed 160 characters.")
    .optional()
    .or(z.literal("")),

  sortOrder: z
    .number()
    .int("Sort order must be an integer.")
    .min(0, "Sort order cannot be negative.")
    .optional(),

  isPrimary: z.boolean().optional(),
});

export const createProductSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Product name must contain at least 2 characters.")
      .max(160, "Product name cannot exceed 160 characters."),

    slug: slugSchema,

    sku: skuSchema,

    shortDescription: z
      .string()
      .trim()
      .max(300, "Short description cannot exceed 300 characters.")
      .optional()
      .or(z.literal("")),

    description: z
      .string()
      .trim()
      .max(5000, "Description cannot exceed 5000 characters.")
      .optional()
      .or(z.literal("")),

    price: z.coerce
      .number()
      .positive("Price must be greater than zero."),

    wholesalePrice: z.coerce
      .number()
      .positive("Wholesale price must be greater than zero.")
      .optional(),

    stock: z.coerce
      .number()
      .int("Stock must be an integer.")
      .min(0, "Stock cannot be negative.")
      .optional(),

    minimumWholesaleQuantity: z.coerce
      .number()
      .int("Minimum wholesale quantity must be an integer.")
      .min(1, "Minimum wholesale quantity must be at least 1.")
      .optional(),

    fabric: z
      .string()
      .trim()
      .max(120, "Fabric cannot exceed 120 characters.")
      .optional()
      .or(z.literal("")),

    sizes: z
      .array(
        z
          .string()
          .trim()
          .min(1, "Size cannot be empty.")
          .max(20, "Size cannot exceed 20 characters."),
      )
      .max(20, "A product cannot have more than 20 sizes.")
      .default([]),

    status: z
  .enum(["DRAFT", "ACTIVE", "ARCHIVED"])
  .optional(),

isFeatured: z.boolean().optional(),

isNewArrival: z.boolean().optional(),

categoryId: z
  .string()
  .cuid("Invalid category ID."),

    images: z
      .array(productImageSchema)
      .max(12, "A product cannot have more than 12 images.")
      .optional(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().cuid("Invalid product ID."),
  }),

  body: createProductSchema.shape.body
    .partial()
    .refine(
      (data) => Object.keys(data).length > 0,
      "At least one field must be provided.",
    ),
});

export const productIdSchema = z.object({
  params: z.object({
    id: z.string().cuid("Invalid product ID."),
  }),
});

export const productSlugSchema = z.object({
  params: z.object({
    slug: slugSchema,
  }),
});

export const productQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(100).default(20),

    search: z.string().trim().max(160).optional(),

    categoryId: z
      .string()
      .cuid("Invalid category ID.")
      .optional(),

    status: z
      .enum(["DRAFT", "ACTIVE", "ARCHIVED"])
      .optional(),

    featured: z
  .enum(["true", "false"])
  .optional()
  .transform((value) =>
    value === undefined ? undefined : value === "true",
  ),

newArrival: z
  .enum(["true", "false"])
  .optional()
  .transform((value) =>
    value === undefined ? undefined : value === "true",
  ),

minPrice: z.coerce
  .number()
  .min(0, "Minimum price cannot be negative.")
  .optional(),

    maxPrice: z.coerce
      .number()
      .min(0, "Maximum price cannot be negative.")
      .optional(),

    inStock: z
      .enum(["true", "false"])
      .optional()
      .transform((value) =>
        value === undefined ? undefined : value === "true",
      ),

    sortBy: z
      .enum([
        "createdAt",
        "name",
        "price",
        "stock",
      ])
      .default("createdAt"),

    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  })
  .refine(
    (data) =>
      data.minPrice === undefined ||
      data.maxPrice === undefined ||
      data.minPrice <= data.maxPrice,
    {
      message:
        "Minimum price cannot be greater than maximum price.",
      path: ["maxPrice"],
    },
  ),
});

export type CreateProductInput = z.infer<
  typeof createProductSchema
>["body"];

export type UpdateProductInput = z.infer<
  typeof updateProductSchema
>["body"];