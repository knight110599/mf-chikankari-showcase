import type {
  NextFunction,
  Request,
  Response,
} from "express";
import type { ZodType } from "zod";

interface ValidatedRequestData {
  body?: unknown;
  params?: Record<string, string>;
  query?: Record<string, unknown>;
}

export const validate =
  (schema: ZodType) =>
  (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });

      return;
    }

    const validatedData =
      result.data as ValidatedRequestData;

    if (validatedData.body !== undefined) {
      req.body = validatedData.body;
    }

    if (validatedData.params !== undefined) {
      Object.assign(req.params, validatedData.params);
    }

    if (validatedData.query !== undefined) {
  Object.defineProperty(req, "query", {
    value: validatedData.query,
    writable: true,
    configurable: true,
    enumerable: true,
  });
}

    next();
  };