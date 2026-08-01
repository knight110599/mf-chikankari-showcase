import { z } from "zod";

const optionalTrimmedString = z
  .string()
  .trim()
  .optional()
  .transform((value) =>
    value && value.length > 0 ? value : undefined,
  );

const optionalEmail = z
  .string()
  .trim()
  .email("Enter a valid business email address.")
  .optional()
  .or(z.literal(""))
  .transform((value) => value || undefined);

const optionalNonNegativeInteger = z
  .number()
  .int()
  .nonnegative()
  .optional();

export const createWholesaleApplicationSchema = z.object({
  body: z.object({
    businessName: z
      .string()
      .trim()
      .min(2, "Business name must be at least 2 characters.")
      .max(120, "Business name cannot exceed 120 characters."),

    businessType: optionalTrimmedString.pipe(
      z
        .string()
        .max(80, "Business type cannot exceed 80 characters.")
        .optional(),
    ),

    businessPhone: optionalTrimmedString.pipe(
      z
        .string()
        .max(20, "Business phone cannot exceed 20 characters.")
        .optional(),
    ),

    businessEmail: optionalEmail,

    gstNumber: optionalTrimmedString.pipe(
      z
        .string()
        .max(20, "GST number cannot exceed 20 characters.")
        .optional(),
    ),

    panNumber: optionalTrimmedString.pipe(
      z
        .string()
        .max(20, "PAN number cannot exceed 20 characters.")
        .optional(),
    ),

    addressLine1: z
      .string()
      .trim()
      .min(3, "Address line 1 is required.")
      .max(160, "Address line 1 cannot exceed 160 characters."),

    addressLine2: optionalTrimmedString.pipe(
      z
        .string()
        .max(160, "Address line 2 cannot exceed 160 characters.")
        .optional(),
    ),

    city: z
      .string()
      .trim()
      .min(2, "City is required.")
      .max(80, "City cannot exceed 80 characters."),

    state: z
      .string()
      .trim()
      .min(2, "State is required.")
      .max(80, "State cannot exceed 80 characters."),

    postalCode: z
      .string()
      .trim()
      .min(4, "Postal code is required.")
      .max(12, "Postal code cannot exceed 12 characters."),

    country: z
      .string()
      .trim()
      .min(2)
      .max(80)
      .optional()
      .default("India"),

    expectedMonthlyOrderValue:
      optionalNonNegativeInteger,

    notes: optionalTrimmedString.pipe(
      z
        .string()
        .max(1000, "Notes cannot exceed 1000 characters.")
        .optional(),
    ),
  }),
});

export const reviewWholesaleApplicationSchema = z.object({
  params: z.object({
    applicationId: z.string().cuid(),
  }),

  body: z
    .object({
      action: z.enum(["APPROVE", "REJECT"]),

      rejectionReason: optionalTrimmedString.pipe(
        z
          .string()
          .max(
            500,
            "Rejection reason cannot exceed 500 characters.",
          )
          .optional(),
      ),
    })
    .superRefine((value, context) => {
      if (
        value.action === "REJECT" &&
        !value.rejectionReason
      ) {
        context.addIssue({
          code: "custom",
          path: ["rejectionReason"],
          message:
            "Rejection reason is required when rejecting an application.",
        });
      }
    }),
});

export const listWholesaleApplicationsSchema = z.object({
  query: z.object({
    page: z.coerce
      .number()
      .int()
      .positive()
      .optional()
      .default(1),

    limit: z.coerce
      .number()
      .int()
      .positive()
      .max(100)
      .optional()
      .default(20),

    status: z
      .enum(["PENDING", "APPROVED", "REJECTED"])
      .optional(),

    search: z
      .string()
      .trim()
      .max(100)
      .optional(),
  }),
});

export type CreateWholesaleApplicationInput =
  z.infer<
    typeof createWholesaleApplicationSchema
  >["body"];

export type ReviewWholesaleApplicationInput =
  z.infer<
    typeof reviewWholesaleApplicationSchema
  >["body"];

export type ListWholesaleApplicationsQuery =
  z.infer<
    typeof listWholesaleApplicationsSchema
  >["query"];