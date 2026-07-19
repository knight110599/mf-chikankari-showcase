import { apiRequest } from "../lib/api";

export interface ApiProductImage {
  id: string;
  url: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
}

export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string | null;
  description: string | null;
  price: string;
  wholesalePrice: string | null;
  stock: number;
  minimumWholesaleQuantity: number | null;
  fabric: string | null;
  sizes: string[];
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  isFeatured: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  images: ApiProductImage[];
}

interface ProductsResponse {
  success: boolean;
  message: string;
  data: ApiProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ProductResponse {
  success: boolean;
  message: string;
  data: ApiProduct;
}

export function getProducts() {
  return apiRequest<ProductsResponse>("/products?page=1&limit=50");
}

export function getFeaturedProducts() {
  return apiRequest<ProductsResponse>("/products/featured");
}

export function getProductBySlug(slug: string) {
  return apiRequest<ProductResponse>(`/products/slug/${slug}`);
}