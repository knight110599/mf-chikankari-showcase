import type { Request, Response } from "express";

import {
  loginSchema,
  registerSchema,
} from "../schemas/auth.schema.js";

import {
  loginUser,
  registerUser,
} from "../services/auth.service.js";

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