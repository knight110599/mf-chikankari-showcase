import type { Request, Response } from "express";
import {
  createWholesaleApplication,
  getMyWholesaleApplication,
  getWholesaleApplicationById,
  listWholesaleApplications,
  reviewWholesaleApplication,
} from "../services/wholesale.service.js";

function getStringParam(
  value: string | string[] | undefined,
): string | null {
  return typeof value === "string" ? value : null;
}

export const apply = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
    return;
  }

  try {
    const application =
      await createWholesaleApplication(
        userId,
        req.body,
      );

    res.status(201).json({
      success: true,
      message:
        "Wholesale application submitted successfully.",
      data: application,
    });
  } catch (error) {
    if (error instanceof Error) {
      const errorMap: Record<
        string,
        { status: number; message: string }
      > = {
        USER_NOT_FOUND: {
          status: 404,
          message: "User account not found.",
        },
        USER_INACTIVE: {
          status: 403,
          message:
            "Inactive users cannot submit a wholesale application.",
        },
        ADMIN_CANNOT_APPLY: {
          status: 403,
          message:
            "Admin accounts cannot apply for wholesale access.",
        },
        ALREADY_WHOLESALE: {
          status: 409,
          message:
            "This account already has wholesale access.",
        },
        APPLICATION_ALREADY_PENDING: {
          status: 409,
          message:
            "A wholesale application is already pending review.",
        },
        APPLICATION_ALREADY_APPROVED: {
          status: 409,
          message:
            "This wholesale application is already approved.",
        },
      };

      const mappedError = errorMap[error.message];

      if (mappedError) {
        res.status(mappedError.status).json({
          success: false,
          message: mappedError.message,
        });
        return;
      }
    }

    throw error;
  }
};

export const getMine = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
    return;
  }

  const application =
    await getMyWholesaleApplication(userId);

  res.status(200).json({
    success: true,
    message: application
      ? "Wholesale application fetched successfully."
      : "No wholesale application found.",
    data: application,
  });
};

export const list = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const result = await listWholesaleApplications(
    req.query as never,
  );

  res.status(200).json({
    success: true,
    message:
      "Wholesale applications fetched successfully.",
    data: result.applications,
    pagination: result.pagination,
  });
};

export const getById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const applicationId = getStringParam(
    req.params.applicationId,
  );

  if (!applicationId) {
    res.status(400).json({
      success: false,
      message: "Invalid wholesale application ID.",
    });
    return;
  }

  try {
    const application =
      await getWholesaleApplicationById(
        applicationId,
      );

    res.status(200).json({
      success: true,
      message:
        "Wholesale application fetched successfully.",
      data: application,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "APPLICATION_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message:
          "Wholesale application not found.",
      });
      return;
    }

    throw error;
  }
};

export const review = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const applicationId = getStringParam(
    req.params.applicationId,
  );

  if (!applicationId) {
    res.status(400).json({
      success: false,
      message: "Invalid wholesale application ID.",
    });
    return;
  }

  try {
    const application =
      await reviewWholesaleApplication(
        applicationId,
        req.body,
      );

    res.status(200).json({
      success: true,
      message:
        req.body.action === "APPROVE"
          ? "Wholesale application approved successfully."
          : "Wholesale application rejected successfully.",
      data: application,
    });
  } catch (error) {
    if (error instanceof Error) {
      const errorMap: Record<
        string,
        { status: number; message: string }
      > = {
        APPLICATION_NOT_FOUND: {
          status: 404,
          message:
            "Wholesale application not found.",
        },
        USER_INACTIVE: {
          status: 409,
          message:
            "The linked user account is inactive.",
        },
        APPLICATION_ALREADY_APPROVED: {
          status: 409,
          message:
            "This application is already approved.",
        },
        APPLICATION_ALREADY_REJECTED: {
          status: 409,
          message:
            "This application is already rejected.",
        },
      };

      const mappedError = errorMap[error.message];

      if (mappedError) {
        res.status(mappedError.status).json({
          success: false,
          message: mappedError.message,
        });
        return;
      }
    }

    throw error;
  }
};