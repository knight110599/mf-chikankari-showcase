import { doubleCsrf } from "csrf-csrf";
import { verifyRefreshToken } from "../utils/jwt.js";
const csrfSecret = process.env.CSRF_SECRET;

if (!csrfSecret) {
  throw new Error(
    "CSRF_SECRET is missing in environment variables.",
  );
}

export const {
  generateCsrfToken,
  doubleCsrfProtection,
} = doubleCsrf({
  getSecret: () => csrfSecret,

  getSessionIdentifier: (req) => {
  const refreshToken = req.cookies?.refreshToken;

  if (typeof refreshToken !== "string") {
    return "anonymous";
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    return payload.sessionId;
  } catch {
    return "anonymous";
  }
},

  cookieName:
    process.env.NODE_ENV === "production"
      ? "__Host-mf-csrf"
      : "mf-csrf",

  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
    path: "/",
  },

  getCsrfTokenFromRequest: (req) => {
    const token = req.headers["x-csrf-token"];

    return typeof token === "string"
      ? token
      : undefined;
  },
});