import type {
  NextFunction,
  Request,
  Response,
} from "express";
import { Prisma } from "../../generated/prisma/client.js";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  void _next;

  console.error("UNHANDLED ERROR:", error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      res.status(409).json({
        success: false,
        message: "A record with these details already exists.",
      });
      return;
    }

    if (error.code === "P2025") {
      res.status(404).json({
        success: false,
        message: "Requested record was not found.",
      });
      return;
    }
  }

  if (error instanceof Error) {
    if (error.name === "JsonWebTokenError") {
      res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
      return;
    }

    if (error.name === "TokenExpiredError") {
      res.status(401).json({
        success: false,
        message: "Authentication token has expired.",
      });
      return;
    }
  }

  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error."
        : error instanceof Error
          ? error.message
          : "Internal server error.",
  });
};