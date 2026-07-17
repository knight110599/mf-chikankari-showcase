import type { Request, Response } from "express";

import {
  loginSchema,
  registerSchema,
} from "../schemas/auth.schema.js";

import {
  loginUser,
  registerUser,
} from "../services/auth.service.js";
export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validationResult = registerSchema.safeParse({
      body: req.body,
    });

    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: validationResult.error.flatten().fieldErrors,
      });
      return;
    }

    const user = await registerUser(validationResult.data.body);

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
      data: user,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create account. Please try again.",
    });
  }
};
export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validationResult = loginSchema.safeParse({
      body: req.body,
    });

    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: validationResult.error.flatten().fieldErrors,
      });
      return;
    }

    const result = await loginUser(validationResult.data.body);

    res.status(200).json({
      success: true,
      message: "Login successful.",
      data: result,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to log in. Please try again.",
    });
  }
};