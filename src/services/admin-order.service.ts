import { apiRequest } from "../lib/api";

export type OrderStatus =
  | "PENDING_CONFIRMATION"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus =
  | "UNPAID"
  | "PAYMENT_PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

export type OrderSource =
  | "WEBSITE"
  | "WHATSAPP"
  | "ADMIN";

export interface AdminOrderItem {
  id: string;
  productId: string | null;
  productName: string;
  productSku?: string | null;
  productSlug?: string | null;
  productImage?: string | null;
  selectedSize?: string | null;
  quantity: number;
  unitPrice: string | number;
  lineTotal: string | number;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  userId: string | null;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  orderNotes: string | null;
  subtotal: string | number;
  deliveryCharge: string | number;
  total: string | number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  source: OrderSource;
  confirmedAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  items?: AdminOrderItem[];
}

export interface OrdersPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminOrdersResponse {
  success: boolean;
  message: string;
  data: AdminOrder[];
  pagination: OrdersPagination;
}

export interface AdminOrderResponse {
  success: boolean;
  message: string;
  data: AdminOrder;
}

export interface GetAdminOrdersOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  source?: OrderSource;
  sortOrder?: "asc" | "desc";
}

export interface UpdateAdminOrderStatusInput {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
}

function getAdminAccessToken() {
  const token = localStorage.getItem("adminAccessToken");

  if (!token) {
    throw new Error("Authentication required.");
  }

  return token;
}

export function getAdminOrders(
  options: GetAdminOrdersOptions = {},
) {
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

  const queryString = searchParams.toString();
  const accessToken = getAdminAccessToken();

  return apiRequest<AdminOrdersResponse>(
    queryString
      ? `/orders?${queryString}`
      : "/orders",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
}

export function updateAdminOrderStatus(
  orderId: string,
  input: UpdateAdminOrderStatusInput,
) {
  const accessToken = getAdminAccessToken();

  return apiRequest<AdminOrderResponse>(
    `/orders/${orderId}/status`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(input),
    },
  );
}