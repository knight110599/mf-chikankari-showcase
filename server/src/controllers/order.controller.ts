import type {
  Request,
  Response,
} from "express";
import {
  createOrder,
  getOrderById,
  getOrders,
  updateOrderStatus,
} from "../services/order.service.js";

interface OrderQuery {
  page?: number;
  limit?: number;
  search?: string;

  status?:
    | "PENDING_CONFIRMATION"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";

  paymentStatus?:
    | "UNPAID"
    | "PAYMENT_PENDING"
    | "PAID"
    | "FAILED"
    | "REFUNDED";

  source?:
    | "WEBSITE"
    | "WHATSAPP"
    | "ADMIN";

  sortOrder?: "asc" | "desc";
}

function getStringParam(
  value: string | string[] | undefined,
): string | null {
  return typeof value === "string"
    ? value
    : null;
}

function getErrorValue(
  message: string,
): string {
  const separatorIndex = message.indexOf(":");

  if (separatorIndex === -1) {
    return "";
  }

  return message
    .slice(separatorIndex + 1)
    .trim();
}

export const create = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const order = await createOrder(req.body, {
      userId: req.user?.id,
      userRole: req.user?.role as
        | "CUSTOMER"
        | "WHOLESALE"
        | "ADMIN"
        | undefined,
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully.",
      data: order,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "PRODUCT_NOT_FOUND") {
        res.status(404).json({
          success: false,
          message:
            "One or more products were not found.",
        });
        return;
      }

      if (
        error.message.startsWith(
          "PRODUCT_INACTIVE:",
        )
      ) {
        const productName = getErrorValue(
          error.message,
        );

        res.status(409).json({
          success: false,
          message: `${productName} is currently unavailable.`,
        });
        return;
      }

      if (
        error.message.startsWith(
          "INSUFFICIENT_STOCK:",
        )
      ) {
        const productName = getErrorValue(
          error.message,
        );

        res.status(409).json({
          success: false,
          message: `There is not enough stock available for ${productName}.`,
        });
        return;
      }

      if (
        error.message.startsWith(
          "INVALID_SIZE:",
        )
      ) {
        const productName = getErrorValue(
          error.message,
        );

        res.status(400).json({
          success: false,
          message: `The selected size is not available for ${productName}.`,
        });
        return;
      }

      if (
        error.message ===
        "ORDER_CREATION_FAILED"
      ) {
        res.status(500).json({
          success: false,
          message:
            "The order could not be created. Please try again.",
        });
        return;
      }
    }

    throw error;
  }
};

export const list = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const query =
    req.query as unknown as OrderQuery;

  const result = await getOrders({
    page: query.page ?? 1,
    limit: query.limit ?? 20,
    search: query.search,
    status: query.status,
    paymentStatus: query.paymentStatus,
    source: query.source,
    sortOrder: query.sortOrder ?? "desc",
  });

  res.status(200).json({
    success: true,
    message: "Orders fetched successfully.",
    data: result.orders,
    pagination: result.pagination,
  });
};

export const getById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = getStringParam(req.params.id);

  if (!id) {
    res.status(400).json({
      success: false,
      message: "Invalid order ID.",
    });
    return;
  }

  try {
    const order = await getOrderById(id);

    res.status(200).json({
      success: true,
      message: "Order fetched successfully.",
      data: order,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "ORDER_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Order not found.",
      });
      return;
    }

    throw error;
  }
};

export const updateStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = getStringParam(req.params.id);

  if (!id) {
    res.status(400).json({
      success: false,
      message: "Invalid order ID.",
    });
    return;
  }

  try {
    const order = await updateOrderStatus(
      id,
      req.body,
    );

    res.status(200).json({
      success: true,
      message:
        "Order status updated successfully.",
      data: order,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "ORDER_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Order not found.",
      });
      return;
    }

    throw error;
  }
};