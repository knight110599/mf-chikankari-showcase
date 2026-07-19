import type { Request, Response } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../services/category.service.js";

interface CategoryQuery {
  includeInactive?: boolean;
  page?: number;
  limit?: number;
  search?: string;
}

export const create = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const category = await createCategory(req.body);

  res.status(201).json({
    success: true,
    message: "Category created successfully.",
    data: category,
  });
};

export const list = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const query = req.query as unknown as CategoryQuery;

  const result = await getCategories({
    includeInactive: query.includeInactive ?? false,
    page: query.page ?? 1,
    limit: query.limit ?? 20,
    search: query.search,
  });

  res.status(200).json({
    success: true,
    message: "Categories fetched successfully.",
    data: result.categories,
    pagination: result.pagination,
  });
};

export const getById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = req.params.id;

  if (typeof id !== "string") {
    res.status(400).json({
      success: false,
      message: "Category ID is required.",
    });
    return;
  }

  try {
    const category = await getCategoryById(id);

    res.status(200).json({
      success: true,
      message: "Category fetched successfully.",
      data: category,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "CATEGORY_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Category not found.",
      });
      return;
    }

    throw error;
  }
};

export const update = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = req.params.id;

if (typeof id !== "string") {
  res.status(400).json({
    success: false,
    message: "Invalid category ID.",
  });
  return;
}

  if (!id) {
    res.status(400).json({
      success: false,
      message: "Category ID is required.",
    });
    return;
  }

  try {
    const category = await updateCategory(id, req.body);

    res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      data: category,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "CATEGORY_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Category not found.",
      });
      return;
    }

    throw error;
  }
};

export const remove = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = req.params.id;

if (typeof id !== "string") {
  res.status(400).json({
    success: false,
    message: "Invalid category ID.",
  });
  return;
}

  if (!id) {
    res.status(400).json({
      success: false,
      message: "Category ID is required.",
    });
    return;
  }

  try {
    await deleteCategory(id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "CATEGORY_NOT_FOUND") {
        res.status(404).json({
          success: false,
          message: "Category not found.",
        });
        return;
      }

      if (error.message === "CATEGORY_HAS_PRODUCTS") {
        res.status(409).json({
          success: false,
          message:
            "Category cannot be deleted because it contains products.",
        });
        return;
      }
    }

    throw error;
  }
};