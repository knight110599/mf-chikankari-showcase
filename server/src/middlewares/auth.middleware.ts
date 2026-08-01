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

function getAccessToken(req: Request): string | null {
  const bearerToken = getBearerToken(
    req.headers.authorization,
  );

  if (bearerToken) {
    return bearerToken;
  }

  const cookieToken =
    req.cookies?.accessToken;

  return typeof cookieToken === "string"
    ? cookieToken
    : null;
}

async function getAuthenticatedUser(token: string) {
  const payload = verifyAccessToken(token);

  return prisma.user.findUnique({
    where: {
      id: payload.userId,
    },
    select: {
      id: true,
      role: true,
      status: true,
    },
  });
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = getAccessToken(req);

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    const user = await getAuthenticatedUser(token);

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
  const token = getAccessToken(req);

  if (!token) {
    next();
    return;
  }

  try {
    const user = await getAuthenticatedUser(token);

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