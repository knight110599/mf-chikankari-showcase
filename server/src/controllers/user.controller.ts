import type {
  NextFunction,
  Request,
  Response,
} from "express";

import type {
  UpdateUserRoleInput,
  UpdateUserStatusInput,
} from "../schemas/user.schema.js";

import {
  getUserById,
  listUsers,
  updateUserRole,
  updateUserStatus,
} from "../services/user.service.js";

function getRequiredParam(
  value: string | string[] | undefined,
  fieldName: string,
): string {
  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    throw new Error(
      `${fieldName.toUpperCase()}_REQUIRED`,
    );
  }

  return value.trim();
}

function getCurrentAdminId(
  req: Request,
): string {
  const userId = req.user?.id;

  if (
    typeof userId !== "string" ||
    !userId.trim()
  ) {
    throw new Error(
      "ADMIN_AUTHENTICATION_REQUIRED",
    );
  }

  return userId.trim();
}

export const list = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await listUsers(
      req.query as never,
    );

    res.status(200).json({
      success: true,
      message: "Users fetched successfully.",
      data: result.users,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = getRequiredParam(
      req.params.userId,
      "userId",
    );

    const user = await getUserById(userId);

    res.status(200).json({
      success: true,
      message: "User fetched successfully.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = getRequiredParam(
      req.params.userId,
      "userId",
    );

    const currentAdminId =
      getCurrentAdminId(req);

    const input =
      req.body as UpdateUserStatusInput;

    const user = await updateUserStatus(
      userId,
      input,
      currentAdminId,
    );

    res.status(200).json({
      success: true,
      message:
        "User status updated successfully.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = getRequiredParam(
      req.params.userId,
      "userId",
    );

    const currentAdminId =
      getCurrentAdminId(req);

    const input =
      req.body as UpdateUserRoleInput;

    const user = await updateUserRole(
      userId,
      input,
      currentAdminId,
    );

    res.status(200).json({
      success: true,
      message:
        "User role updated successfully.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};