import type {
  NextFunction,
  Request,
  Response,
} from "express";

function getAllowedOrigin(): string {
  return (
    process.env.CLIENT_URL ||
    "http://localhost:5173"
  );
}

function isTrustedRequestOrigin(
  value: string | undefined,
  allowedOrigin: string,
): boolean {
  if (!value) {
    return false;
  }

  try {
    return new URL(value).origin === allowedOrigin;
  } catch {
    return false;
  }
}

export function requireTrustedOrigin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const allowedOrigin = getAllowedOrigin();

  const isTrusted =
    isTrustedRequestOrigin(
      req.get("origin"),
      allowedOrigin,
    ) ||
    isTrustedRequestOrigin(
      req.get("referer"),
      allowedOrigin,
    );

  if (!isTrusted) {
    res.status(403).json({
      success: false,
      message: "Request origin is not allowed.",
    });
    return;
  }

  next();
}