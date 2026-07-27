import type {
  NextFunction,
  Request,
  Response,
} from "express";
import { prisma } from "../lib/prisma.js";
import { verifyAccessToken } from "../utils/jwt.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

function getBearerToken(
  authorizationHeader: string | undefined,
): string | null {
  if (
    !authorizationHeader?.startsWith("Bearer ")
  ) {
    return null;
  }

  const token =
    authorizationHeader.split(" ")[1];

  return token || null;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = getBearerToken(
      req.headers.authorization,
    );

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    const payload = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
      select: {
        id: true,
        role: true,
        status: true,
      },
    });

    if (!user || user.status !== "ACTIVE") {
      res.status(401).json({
        success: false,
        message: "Invalid authentication.",
      });
      return;
    }

    req.user = {
      id: user.id,
      role: user.role,
    };

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

export const optionalProtect = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const token = getBearerToken(
    req.headers.authorization,
  );

  if (!token) {
    next();
    return;
  }

  try {
    const payload = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
      select: {
        id: true,
        role: true,
        status: true,
      },
    });

    if (!user || user.status !== "ACTIVE") {
      res.status(401).json({
        success: false,
        message: "Invalid authentication.",
      });
      return;
    }

    req.user = {
      id: user.id,
      role: user.role,
    };

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};