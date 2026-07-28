import { z } from "zod";

export const productIdSchema = z.object({
  params: z.object({
    productId: z.string().cuid(),
  }),
});

export const variantIdSchema = z.object({
  params: z.object({
    variantId: z.string().cuid(),
  }),
});

export const createVariantSchema = z.object({
  params: z.object({
    productId: z.string().cuid(),
  }),

  body: z.object({
    size: z
      .string()
      .trim()
      .min(1)
      .max(20),

    sku: z
      .string()
      .trim()
      .min(2)
      .max(100),

    barcode: z
      .string()
      .trim()
      .max(100)
      .optional(),

    stock: z
      .number()
      .int()
      .min(0)
      .default(0),

    reservedStock: z
      .number()
      .int()
      .min(0)
      .default(0),

    lowStockThreshold: z
      .number()
      .int()
      .min(0)
      .default(5),

    costPrice: z
      .number()
      .nonnegative()
      .optional(),

    weightGrams: z
      .number()
      .int()
      .nonnegative()
      .optional(),

    isDefault: z
      .boolean()
      .default(false),

    isActive: z
      .boolean()
      .default(true),

    sortOrder: z
      .number()
      .int()
      .default(0),
  }),
});

export const updateVariantSchema = z.object({
  params: z.object({
    variantId: z.string().cuid(),
  }),

  body: z.object({
    sku: z
      .string()
      .trim()
      .min(2)
      .max(100)
      .optional(),

    barcode: z
      .string()
      .trim()
      .max(100)
      .optional(),

    lowStockThreshold: z
      .number()
      .int()
      .min(0)
      .optional(),

    costPrice: z
      .number()
      .nonnegative()
      .optional(),

    weightGrams: z
      .number()
      .int()
      .nonnegative()
      .optional(),

    isDefault: z
      .boolean()
      .optional(),

    isActive: z
      .boolean()
      .optional(),

    sortOrder: z
      .number()
      .int()
      .optional(),
  }),
});

export const restockSchema = z.object({
  params: z.object({
    variantId: z.string().cuid(),
  }),

  body: z.object({
    quantity: z
      .number()
      .int()
      .positive(),

    note: z
      .string()
      .trim()
      .max(500)
      .optional(),
  }),
});

export const adjustStockSchema = z.object({
  params: z.object({
    variantId: z.string().cuid(),
  }),

  body: z.object({
    quantity: z
      .number()
      .int(),

    note: z
      .string()
      .trim()
      .max(500)
      .optional(),
  }),
});

export type CreateVariantInput =
  z.infer<typeof createVariantSchema>["body"];

export type UpdateVariantInput =
  z.infer<typeof updateVariantSchema>["body"];

export type RestockInput =
  z.infer<typeof restockSchema>["body"];

export type AdjustStockInput =
  z.infer<typeof adjustStockSchema>["body"];