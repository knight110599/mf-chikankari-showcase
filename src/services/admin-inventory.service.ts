import { apiRequest } from "../lib/api";

export type StockMovementType =
  | "INITIAL_STOCK"
  | "RESTOCK"
  | "ORDER_DEDUCTION"
  | "ORDER_RESTORATION"
  | "MANUAL_INCREASE"
  | "MANUAL_DECREASE"
  | "CUSTOMER_RETURN"
  | "DAMAGED"
  | "LOST"
  | "CORRECTION";

export interface InventoryPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface InventoryCategory {
  id: string;
  name: string;
  slug: string;
}

export interface InventoryImage {
  id: string;
  url?: string;
  imageUrl?: string;
  altText?: string | null;
  sortOrder?: number;
}

export interface InventorySummary {
  legacyStock: number;
  totalStock: number;
  reservedStock: number;
  availableStock: number;
  activeVariants: number;
  lowStockVariants: number;
  outOfStockVariants: number;
}

export interface InventoryVariant {
  id: string;
  productId: string;
  size: string;
  sku: string;
  barcode: string | null;
  stock: number;
  reservedStock: number;
  lowStockThreshold: number;
  costPrice: string | number | null;
  weightGrams: number | null;
  isDefault: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;

  product?: {
    id: string;
    name: string;
    slug?: string;
    sku: string;
    stock?: number;
    sizes?: string[];
  };
}

export interface InventoryProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  stock: number;
  sizes: string[];
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  category: InventoryCategory;
  images: InventoryImage[];
  variants: InventoryVariant[];
  inventorySummary: InventorySummary;
}

export interface StockMovementVariant {
  id: string;
  size: string;
  sku: string;
}

export interface StockMovementOrder {
  id: string;
  orderNumber: string;
}

export interface StockMovementUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  variantId: string | null;
  orderId: string | null;
  createdById: string | null;
  type: StockMovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  productNameSnapshot: string;
  productSkuSnapshot: string;
  variantSizeSnapshot: string | null;
  variantSkuSnapshot: string | null;
  reference: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  variant: StockMovementVariant | null;
  order: StockMovementOrder | null;
  createdBy: StockMovementUser | null;
}

export interface InventoryListResponse {
  success: boolean;
  message: string;
  data: InventoryProduct[];
  pagination: InventoryPagination;
}

export interface ProductInventoryResponse {
  success: boolean;
  message: string;
  data: InventoryProduct;
}

export interface InventoryVariantResponse {
  success: boolean;
  message: string;
  data: InventoryVariant;
}

export interface InventoryHistoryResponse {
  success: boolean;
  message: string;
  data: StockMovement[];
  pagination: InventoryPagination;
}

export interface GetAdminInventoryOptions {
  page?: number;
  limit?: number;
  search?: string;
  lowStock?: boolean;
  outOfStock?: boolean;
}

export interface GetInventoryHistoryOptions {
  page?: number;
  limit?: number;
  type?: StockMovementType;
}

export interface CreateInventoryVariantInput {
  size: string;
  sku: string;
  barcode?: string;
  stock: number;
  reservedStock: number;
  lowStockThreshold: number;
  costPrice?: number;
  weightGrams?: number;
  isDefault: boolean;
  isActive: boolean;
  sortOrder: number;
}

export interface UpdateInventoryVariantInput {
  sku?: string;
  barcode?: string;
  lowStockThreshold?: number;
  costPrice?: number;
  weightGrams?: number;
  isDefault?: boolean;
  isActive?: boolean;
  sortOrder?: number;
}

export interface RestockInventoryVariantInput {
  quantity: number;
  note?: string;
}

export interface AdjustInventoryVariantStockInput {
  quantity: number;
  note?: string;
}

function getAdminAccessToken(): string {
  const token = localStorage.getItem("adminAccessToken");

  if (!token) {
    throw new Error("Authentication required.");
  }

  return token;
}

function getAuthorizationHeaders() {
  return {
    Authorization: `Bearer ${getAdminAccessToken()}`,
  };
}

function requireId(value: string, label: string) {
  if (!value.trim()) {
    throw new Error(`${label} is required.`);
  }
}

function createQueryString(
  options: object
): string {
  const searchParams = new URLSearchParams();

  Object.entries(options).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      searchParams.set(key, String(value));
    }
  });

  return searchParams.toString();
}

export function getAdminInventory(
  options: GetAdminInventoryOptions = {},
) {
  const queryString = createQueryString(options);

  return apiRequest<InventoryListResponse>(
    queryString
      ? `/inventory?${queryString}`
      : "/inventory",
    {
      headers: getAuthorizationHeaders(),
    },
  );
}

export function getAdminProductInventory(
  productId: string,
) {
  requireId(productId, "Product ID");

  return apiRequest<ProductInventoryResponse>(
    `/inventory/products/${productId}`,
    {
      headers: getAuthorizationHeaders(),
    },
  );
}

export function getAdminProductInventoryHistory(
  productId: string,
  options: GetInventoryHistoryOptions = {},
) {
  requireId(productId, "Product ID");

  const queryString = createQueryString(options);

  return apiRequest<InventoryHistoryResponse>(
    queryString
      ? `/inventory/products/${productId}/history?${queryString}`
      : `/inventory/products/${productId}/history`,
    {
      headers: getAuthorizationHeaders(),
    },
  );
}

export function createAdminProductVariant(
  productId: string,
  input: CreateInventoryVariantInput,
) {
  requireId(productId, "Product ID");

  return apiRequest<InventoryVariantResponse>(
    `/inventory/products/${productId}/variants`,
    {
      method: "POST",
      headers: getAuthorizationHeaders(),
      body: JSON.stringify(input),
    },
  );
}

export function updateAdminProductVariant(
  variantId: string,
  input: UpdateInventoryVariantInput,
) {
  requireId(variantId, "Variant ID");

  return apiRequest<InventoryVariantResponse>(
    `/inventory/variants/${variantId}`,
    {
      method: "PATCH",
      headers: getAuthorizationHeaders(),
      body: JSON.stringify(input),
    },
  );
}

export function restockAdminProductVariant(
  variantId: string,
  input: RestockInventoryVariantInput,
) {
  requireId(variantId, "Variant ID");

  if (
    !Number.isInteger(input.quantity) ||
    input.quantity <= 0
  ) {
    throw new Error(
      "Restock quantity must be a positive whole number.",
    );
  }

  return apiRequest<InventoryVariantResponse>(
    `/inventory/variants/${variantId}/restock`,
    {
      method: "POST",
      headers: getAuthorizationHeaders(),
      body: JSON.stringify(input),
    },
  );
}

export function adjustAdminProductVariantStock(
  variantId: string,
  input: AdjustInventoryVariantStockInput,
) {
  requireId(variantId, "Variant ID");

  if (
    !Number.isInteger(input.quantity) ||
    input.quantity === 0
  ) {
    throw new Error(
      "Adjustment quantity must be a non-zero whole number.",
    );
  }

  return apiRequest<InventoryVariantResponse>(
    `/inventory/variants/${variantId}/adjust`,
    {
      method: "POST",
      headers: getAuthorizationHeaders(),
      body: JSON.stringify(input),
    },
  );
}