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
  productSku: string;
  productSlug: string | null;
  productImage: string | null;
  selectedSize: string | null;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
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
  subtotal: string;
  deliveryCharge: string;
  total: string;
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

export interface GetAdminOrdersOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  source?: OrderSource;
  sortOrder?: "asc" | "desc";
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