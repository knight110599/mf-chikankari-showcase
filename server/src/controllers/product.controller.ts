import type { Request, Response } from "express";
import {
  createProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductById,
  getProductBySlug,
  getProducts,
  updateProduct,
} from "../services/product.service.js";

interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: "DRAFT" | "ACTIVE" | "ARCHIVED";
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: "createdAt" | "name" | "price" | "stock";
  sortOrder?: "asc" | "desc";
}

function getStringParam(
  value: string | string[] | undefined,
): string | null {
  return typeof value === "string" ? value : null;
}

export const create = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const product = await createProduct(req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: product,
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

      if (error.message === "CATEGORY_INACTIVE") {
        res.status(409).json({
          success: false,
          message:
            "Product cannot be assigned to an inactive category.",
        });
        return;
      }

      if (error.message === "MULTIPLE_PRIMARY_IMAGES") {
        res.status(400).json({
          success: false,
          message:
            "Only one product image can be marked as primary.",
        });
        return;
      }
    }

    throw error;
  }
};

export const list = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const query = req.query as unknown as ProductQuery;

  const result = await getProducts({
    page: query.page ?? 1,
    limit: query.limit ?? 20,
    search: query.search,
    categoryId: query.categoryId,
    status: query.status,
    featured: query.featured,
    minPrice: query.minPrice,
    maxPrice: query.maxPrice,
    inStock: query.inStock,
    sortBy: query.sortBy ?? "createdAt",
    sortOrder: query.sortOrder ?? "desc",
  });

  res.status(200).json({
    success: true,
    message: "Products fetched successfully.",
    data: result.products,
    pagination: result.pagination,
  });
};

export const getById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = getStringParam(req.params.id);

  if (!id) {
    res.status(400).json({
      success: false,
      message: "Invalid product ID.",
    });
    return;
  }

  try {
    const product = await getProductById(id);

    res.status(200).json({
      success: true,
      message: "Product fetched successfully.",
      data: product,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "PRODUCT_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Product not found.",
      });
      return;
    }

    throw error;
  }
};

export const getBySlug = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const slug = getStringParam(req.params.slug);

  if (!slug) {
    res.status(400).json({
      success: false,
      message: "Invalid product slug.",
    });
    return;
  }

  try {
    const product = await getProductBySlug(slug);

    res.status(200).json({
      success: true,
      message: "Product fetched successfully.",
      data: product,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "PRODUCT_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Product not found.",
      });
      return;
    }

    throw error;
  }
};

export const featured = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const products = await getFeaturedProducts();

  res.status(200).json({
    success: true,
    message: "Featured products fetched successfully.",
    data: products,
  });
};

export const update = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = getStringParam(req.params.id);

  if (!id) {
    res.status(400).json({
      success: false,
      message: "Invalid product ID.",
    });
    return;
  }

  try {
    const product = await updateProduct(id, req.body);

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      data: product,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "PRODUCT_NOT_FOUND") {
        res.status(404).json({
          success: false,
          message: "Product not found.",
        });
        return;
      }

      if (error.message === "CATEGORY_NOT_FOUND") {
        res.status(404).json({
          success: false,
          message: "Category not found.",
        });
        return;
      }

      if (error.message === "CATEGORY_INACTIVE") {
        res.status(409).json({
          success: false,
          message:
            "Product cannot be assigned to an inactive category.",
        });
        return;
      }

      if (error.message === "MULTIPLE_PRIMARY_IMAGES") {
        res.status(400).json({
          success: false,
          message:
            "Only one product image can be marked as primary.",
        });
        return;
      }
    }

    throw error;
  }
};

export const remove = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = getStringParam(req.params.id);

  if (!id) {
    res.status(400).json({
      success: false,
      message: "Invalid product ID.",
    });
    return;
  }

  try {
    await deleteProduct(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "PRODUCT_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Product not found.",
      });
      return;
    }

    throw error;
  }
};