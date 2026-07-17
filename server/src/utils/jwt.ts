import jwt from "jsonwebtoken";

const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

if (!accessSecret || !refreshSecret) {
  throw new Error("JWT secrets are missing in environment variables.");
}

export const generateAccessToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    accessSecret,
    {
      expiresIn: "15m",
    }
  );
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    refreshSecret,
    {
      expiresIn: "7d",
    }
  );
};