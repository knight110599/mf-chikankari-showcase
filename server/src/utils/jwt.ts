import jwt from "jsonwebtoken";
import type { UserRole } from "../../generated/prisma/enums.js";

const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

if (!accessSecret || !refreshSecret) {
  throw new Error(
    "JWT secrets are missing in environment variables.",
  );
}

export interface AuthTokenPayload {
  userId: string;
  role: UserRole;
}

export const generateAccessToken = (
  payload: AuthTokenPayload,
): string => {
  return jwt.sign(payload, accessSecret, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (
  payload: AuthTokenPayload,
): string => {
  return jwt.sign(payload, refreshSecret, {
    expiresIn: "7d",
  });
};

export const verifyAccessToken = (
  token: string,
): AuthTokenPayload => {
  return jwt.verify(
    token,
    accessSecret,
  ) as AuthTokenPayload;
};

export const verifyRefreshToken = (
  token: string,
): AuthTokenPayload => {
  return jwt.verify(
    token,
    refreshSecret,
  ) as AuthTokenPayload;
};