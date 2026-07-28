import type { Request, Response } from "express";
import {
  adjustProductVariantStock,
  createProductVariant,
  getInventory,
  getProductInventory,
  getProductInventoryHistory,
  restockProductVariant,
  updateProductVariant,
} from "../services/inventory.service.js";

type InventoryHistoryType =
  | "INITIAL_STOCK"
  | "RESTOCK"
  | "ORDER_DEDUCTION"
  | "ORDER_RESTORATION"
  | "MANUAL_INCREASE"
  | "MANUAL_DECREASE"
  | "CUSTOMER_RETURN"
  | "DAMAGED"
  | "LOST"
  | "CORRECTION";

const inventoryHistoryTypes: InventoryHistoryType[] = [
  "INITIAL_STOCK",
  "RESTOCK",
  "ORDER_DEDUCTION",
  "ORDER_RESTORATION",
  "MANUAL_INCREASE",
  "MANUAL_DECREASE",
  "CUSTOMER_RETURN",
  "DAMAGED",
  "LOST",
  "CORRECTION",
];

function getStringParam(
  value: string | string[] | undefined,
): string | null {
  return typeof value === "string" ? value : null;
}

function getQueryString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim()
    ? value.trim()
    : undefined;
}

function getPositiveInteger(
  value: unknown,
  fallback: number,
  maximum?: number,
): number {
  if (typeof value !== "string") {
    return fallback;
  }

  const parsedValue = Number(value);

  if (
    !Number.isInteger(parsedValue) ||
    parsedValue < 1
  ) {
    return fallback;
  }

  if (maximum !== undefined) {
    return Math.min(parsedValue, maximum);
  }

  return parsedValue;
}

function getBooleanQuery(value: unknown): boolean | undefined {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return undefined;
}

function getHistoryType(
  value: unknown,
): InventoryHistoryType | undefined {
  if (
    typeof value === "string" &&
    inventoryHistoryTypes.includes(
      value as InventoryHistoryType,
    )
  ) {
    return value as InventoryHistoryType;
  }

  return undefined;
}

export const list = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const page = getPositiveInteger(req.query.page, 1);
  const limit = getPositiveInteger(
    req.query.limit,
    20,
    100,
  );

  const search = getQueryString(req.query.search);
  const lowStock = getBooleanQuery(req.query.lowStock);
  const outOfStock = getBooleanQuery(
    req.query.outOfStock,
  );

  const result = await getInventory({
    page,
    limit,
    search,
    lowStock,
    outOfStock,
  });

  res.status(200).json({
    success: true,
    message: "Inventory fetched successfully.",
    data: result.products,
    pagination: result.pagination,
  });
};

export const getByProductId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const productId = getStringParam(req.params.productId);

  if (!productId) {
    res.status(400).json({
      success: false,
      message: "Invalid product ID.",
    });
    return;
  }

  try {
    const inventory =
      await getProductInventory(productId);

    res.status(200).json({
      success: true,
      message:
        "Product inventory fetched successfully.",
      data: inventory,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "PRODUCT_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Product not found.",
      });
      return;
    }

    throw error;
  }
};

export const getHistory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const productId = getStringParam(req.params.productId);

  if (!productId) {
    res.status(400).json({
      success: false,
      message: "Invalid product ID.",
    });
    return;
  }

  const page = getPositiveInteger(req.query.page, 1);
  const limit = getPositiveInteger(
    req.query.limit,
    20,
    100,
  );
  const type = getHistoryType(req.query.type);

  try {
    const result =
      await getProductInventoryHistory(productId, {
        page,
        limit,
        type,
      });

    res.status(200).json({
      success: true,
      message:
        "Inventory history fetched successfully.",
      data: result.movements,
      pagination: result.pagination,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "PRODUCT_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Product not found.",
      });
      return;
    }

    throw error;
  }
};

export const createVariant = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const productId = getStringParam(req.params.productId);

  if (!productId) {
    res.status(400).json({
      success: false,
      message: "Invalid product ID.",
    });
    return;
  }

  try {
    const variant = await createProductVariant(
      productId,
      req.body,
      req.user?.id,
    );

    res.status(201).json({
      success: true,
      message:
        "Product variant created successfully.",
      data: variant,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "PRODUCT_NOT_FOUND") {
        res.status(404).json({
          success: false,
          message: "Product not found.",
        });
        return;
      }

      if (
        error.message ===
        "RESERVED_STOCK_EXCEEDS_STOCK"
      ) {
        res.status(400).json({
          success: false,
          message:
            "Reserved stock cannot exceed total stock.",
        });
        return;
      }

      if (
        error.message ===
        "VARIANT_SIZE_ALREADY_EXISTS"
      ) {
        res.status(409).json({
          success: false,
          message:
            "A variant with this size already exists for the product.",
        });
        return;
      }

      if (
        error.message ===
        "VARIANT_SKU_ALREADY_EXISTS"
      ) {
        res.status(409).json({
          success: false,
          message:
            "A variant with this SKU already exists.",
        });
        return;
      }

      if (
        error.message === "BARCODE_ALREADY_EXISTS"
      ) {
        res.status(409).json({
          success: false,
          message:
            "A variant with this barcode already exists.",
        });
        return;
      }
    }

    throw error;
  }
};

export const updateVariant = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const variantId = getStringParam(req.params.variantId);

  if (!variantId) {
    res.status(400).json({
      success: false,
      message: "Invalid variant ID.",
    });
    return;
  }

  try {
    const variant = await updateProductVariant(
      variantId,
      req.body,
    );

    res.status(200).json({
      success: true,
      message:
        "Product variant updated successfully.",
      data: variant,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "VARIANT_NOT_FOUND") {
        res.status(404).json({
          success: false,
          message: "Product variant not found.",
        });
        return;
      }

      if (
        error.message ===
        "VARIANT_HAS_RESERVED_STOCK"
      ) {
        res.status(409).json({
          success: false,
          message:
            "A variant with reserved stock cannot be deactivated.",
        });
        return;
      }

      if (
        error.message ===
        "VARIANT_SKU_ALREADY_EXISTS"
      ) {
        res.status(409).json({
          success: false,
          message:
            "A variant with this SKU already exists.",
        });
        return;
      }

      if (
        error.message === "BARCODE_ALREADY_EXISTS"
      ) {
        res.status(409).json({
          success: false,
          message:
            "A variant with this barcode already exists.",
        });
        return;
      }
    }

    throw error;
  }
};

export const restockVariant = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const variantId = getStringParam(req.params.variantId);

  if (!variantId) {
    res.status(400).json({
      success: false,
      message: "Invalid variant ID.",
    });
    return;
  }

  try {
    const variant = await restockProductVariant(
      variantId,
      req.body,
      req.user?.id,
    );

    res.status(200).json({
      success: true,
      message:
        "Product variant restocked successfully.",
      data: variant,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "VARIANT_NOT_FOUND") {
        res.status(404).json({
          success: false,
          message: "Product variant not found.",
        });
        return;
      }

      if (error.message === "VARIANT_INACTIVE") {
        res.status(409).json({
          success: false,
          message:
            "An inactive variant cannot be restocked.",
        });
        return;
      }
    }

    throw error;
  }
};

export const adjustVariantStock = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const variantId = getStringParam(req.params.variantId);

  if (!variantId) {
    res.status(400).json({
      success: false,
      message: "Invalid variant ID.",
    });
    return;
  }

  try {
    const variant =
      await adjustProductVariantStock(
        variantId,
        req.body,
        req.user?.id,
      );

    res.status(200).json({
      success: true,
      message:
        "Variant stock adjusted successfully.",
      data: variant,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "VARIANT_NOT_FOUND") {
        res.status(404).json({
          success: false,
          message: "Product variant not found.",
        });
        return;
      }

      if (error.message === "VARIANT_INACTIVE") {
        res.status(409).json({
          success: false,
          message:
            "Stock for an inactive variant cannot be adjusted.",
        });
        return;
      }

      if (
        error.message === "ZERO_STOCK_ADJUSTMENT"
      ) {
        res.status(400).json({
          success: false,
          message:
            "Stock adjustment quantity cannot be zero.",
        });
        return;
      }

      if (error.message === "INSUFFICIENT_STOCK") {
        res.status(409).json({
          success: false,
          message:
            "The adjustment would result in negative stock.",
        });
        return;
      }

      if (
        error.message ===
        "STOCK_BELOW_RESERVED_QUANTITY"
      ) {
        res.status(409).json({
          success: false,
          message:
            "Stock cannot be reduced below the reserved quantity.",
        });
        return;
      }
    }

    throw error;
  }
};