import { apiRequest } from "../lib/api";

export interface ApiProductImage {
  id: string;
  url: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
}

export interface ApiProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string | null;
  description: string;
  price: string;
  wholesalePrice: string | null;
  stock: number;
  minimumWholesaleQuantity: number | null;
  fabric: string | null;
  sizes: string[];
  status: string;
  isFeatured: boolean;
  isActive?: boolean;
  categoryId: string;
  category: ApiProductCategory;
  images: ApiProductImage[];
}

export interface ProductsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  data: ApiProduct[];
  pagination: ProductsPagination;
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: ApiProduct;
}

export interface GetProductsOptions {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  categoryId?: string;
  categorySlug?: string;
  status?: string;
  featured?: boolean;
  isFeatured?: boolean;
  sort?: string;
  order?: string;
  [key: string]: string | number | boolean | undefined;
}

export function getProducts(options: GetProductsOptions = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();

  return apiRequest<ProductsResponse>(
    queryString ? `/products?${queryString}` : "/products",
  );
}

export function getFeaturedProducts() {
  return apiRequest<ProductsResponse>("/products/featured");
}

export function getProductBySlug(slug: string) {
  return apiRequest<ProductResponse>(
    `/products/slug/${encodeURIComponent(slug)}`,
  );
}

export function getProductById(id: string) {
  return apiRequest<ProductResponse>(`/products/${encodeURIComponent(id)}`);
}
