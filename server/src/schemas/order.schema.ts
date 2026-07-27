import { z } from "zod";

const orderItemSchema = z.object({
  productId: z
    .string()
    .trim()
    .min(1, "Product ID is required."),

  quantity: z.coerce
    .number()
    .int("Quantity must be a whole number.")
    .min(1, "Quantity must be at least 1.")
    .max(100, "Quantity cannot exceed 100."),

  selectedSize: z
    .string()
    .trim()
    .max(30, "Selected size is too long.")
    .optional(),
});

export const createOrderSchema = z.object({
  body: z.object({
    customerFirstName: z
      .string()
      .trim()
      .min(2, "First name must contain at least 2 characters.")
      .max(50, "First name cannot exceed 50 characters."),

    customerLastName: z
      .string()
      .trim()
      .min(1, "Last name is required.")
      .max(50, "Last name cannot exceed 50 characters."),

    customerEmail: z
      .string()
      .trim()
      .email("Please enter a valid email address.")
      .transform((value) => value.toLowerCase()),

    customerPhone: z
      .string()
      .trim()
      .min(10, "Please enter a valid phone number.")
      .max(20, "Phone number cannot exceed 20 characters."),

    addressLine1: z
      .string()
      .trim()
      .min(5, "Address must contain at least 5 characters.")
      .max(200, "Address cannot exceed 200 characters."),

    addressLine2: z
      .string()
      .trim()
      .max(200, "Address cannot exceed 200 characters.")
      .optional(),

    city: z
      .string()
      .trim()
      .min(2, "City is required.")
      .max(100, "City cannot exceed 100 characters."),

    state: z
      .string()
      .trim()
      .min(2, "State is required.")
      .max(100, "State cannot exceed 100 characters."),

    postalCode: z
      .string()
      .trim()
      .min(4, "Please enter a valid postal code.")
      .max(12, "Postal code cannot exceed 12 characters."),

    country: z
      .string()
      .trim()
      .min(2, "Country is required.")
      .max(100, "Country cannot exceed 100 characters.")
      .default("India"),

    orderNotes: z
      .string()
      .trim()
      .max(500, "Order notes cannot exceed 500 characters.")
      .optional(),

    items: z
      .array(orderItemSchema)
      .min(1, "At least one product is required.")
      .max(50, "An order cannot contain more than 50 items."),
  }),
});

export const orderIdSchema = z.object({
  params: z.object({
    id: z.string().trim().min(1, "Order ID is required."),
  }),
});

export const orderQuerySchema = z.object({
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

    status: z
      .enum([
        "PENDING_CONFIRMATION",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ])
      .optional(),

    paymentStatus: z
      .enum([
        "UNPAID",
        "PAYMENT_PENDING",
        "PAID",
        "FAILED",
        "REFUNDED",
      ])
      .optional(),

    source: z
      .enum([
        "WEBSITE",
        "WHATSAPP",
        "ADMIN",
      ])
      .optional(),

    sortOrder: z
      .enum(["asc", "desc"])
      .default("desc"),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().trim().min(1, "Order ID is required."),
  }),

  body: z
    .object({
      status: z
        .enum([
          "PENDING_CONFIRMATION",
          "CONFIRMED",
          "PROCESSING",
          "SHIPPED",
          "DELIVERED",
          "CANCELLED",
        ])
        .optional(),

      paymentStatus: z
        .enum([
          "UNPAID",
          "PAYMENT_PENDING",
          "PAID",
          "FAILED",
          "REFUNDED",
        ])
        .optional(),
    })
    .refine(
      (data) =>
        data.status !== undefined ||
        data.paymentStatus !== undefined,
      {
        message:
          "Order status or payment status is required.",
      },
    ),
});