import type { Request, Response } from "express";
import { generateCsrfToken } from "../lib/csrf.js";
import {
  getCurrentUser,
  loginUser,
  refreshUserSession,
  registerUser,
  logoutAllSessions,
  logoutUser,
} from "../services/auth.service.js";
import {
  loginSchema,
  registerSchema,
} from "../schemas/auth.schema.js";
const REFRESH_TOKEN_COOKIE_MAX_AGE =
  7 * 24 * 60 * 60 * 1000;

export const register = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const validationResult = registerSchema.safeParse({
      body: req.body,
    });

    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors:
          validationResult.error.flatten().fieldErrors,
      });
      return;
    }

    const user = await registerUser(
      validationResult.data.body,
    );

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
      data: user,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "EMAIL_ALREADY_EXISTS") {
        res.status(409).json({
          success: false,
          message:
            "An account with this email already exists.",
        });
        return;
      }

      if (error.message === "PHONE_ALREADY_EXISTS") {
        res.status(409).json({
          success: false,
          message:
            "An account with this phone number already exists.",
        });
        return;
      }
    }

    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      success: false,
      message:
        "Unable to create account. Please try again.",
    });
  }
};
export const csrfToken = (
  req: Request,
  res: Response,
): void => {
  const token = generateCsrfToken(req, res);

  res.status(200).json({
    success: true,
    data: {
      csrfToken: token,
    },
  });
};
export const login = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const validationResult = loginSchema.safeParse({
      body: req.body,
    });

    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors:
          validationResult.error.flatten().fieldErrors,
      });
      return;
    }

    const result = await loginUser(
      validationResult.data.body,
    );

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
      maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE,
      path: "/api/auth",
    });

    res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "INVALID_CREDENTIALS") {
        res.status(401).json({
          success: false,
          message: "Invalid email or password.",
        });
        return;
      }

      if (error.message === "ACCOUNT_NOT_ACTIVE") {
        res.status(403).json({
          success: false,
          message:
            "Your account is currently unavailable.",
        });
        return;
      }
    }

    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to log in. Please try again.",
    });
  }
};
export const me = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    const user = await getCurrentUser(req.user.id);

    res.status(200).json({
      success: true,
      message: "User profile fetched successfully.",
      data: user,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "USER_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

    console.error("GET CURRENT USER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch user profile.",
    });
  }
};
export const refresh = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken || typeof refreshToken !== "string") {
      res.status(401).json({
        success: false,
        message: "Refresh token is required.",
      });
      return;
    }

    const result = await refreshUserSession(refreshToken);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
      maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE,
      path: "/api/auth",
    });

    res.status(200).json({
      success: true,
      message: "Session refreshed successfully.",
      data: {
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      [
        "INVALID_REFRESH_TOKEN",
        "REFRESH_TOKEN_REVOKED",
        "REFRESH_TOKEN_EXPIRED",
      ].includes(error.message)
    ) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite:
          process.env.NODE_ENV === "production"
            ? "none"
            : "lax",
        path: "/api/auth",
      });

      res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
      return;
    }

    if (
      error instanceof Error &&
      error.message === "ACCOUNT_NOT_ACTIVE"
    ) {
      res.status(403).json({
        success: false,
        message: "Your account is currently unavailable.",
      });
      return;
    }

    console.error("REFRESH SESSION ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to refresh session.",
    });
  }
};
export const logout = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken && typeof refreshToken === "string") {
      await logoutUser(refreshToken);
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
      path: "/api/auth",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("LOGOUT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to log out. Please try again.",
    });
  }
};

export const logoutAll = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    await logoutAllSessions(req.user.id);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
      path: "/api/auth",
    });

    res.status(200).json({
      success: true,
      message: "Logged out from all devices successfully.",
    });
  } catch (error) {
    console.error("LOGOUT ALL ERROR:", error);

    res.status(500).json({
      success: false,
      message:
        "Unable to log out from all devices. Please try again.",
    });
  }
};