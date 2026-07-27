import { apiRequest } from "../lib/api";

export interface CreateOrderItemInput {
  productId: string;
  quantity: number;
  selectedSize?: string;
}

export interface CreateOrderInput {
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  orderNotes?: string;
  items: CreateOrderItemInput[];
}

export interface ApiOrderItem {
  id: string;
  orderId: string;
  productId: string | null;
  productName: string;
  productSku: string;
  productSlug: string | null;
  productImage: string | null;
  selectedSize: string | null;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiOrder {
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
  status:
    | "PENDING_CONFIRMATION"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";
  paymentStatus:
    | "UNPAID"
    | "PAYMENT_PENDING"
    | "PAID"
    | "FAILED"
    | "REFUNDED";
  source: "WEBSITE" | "WHATSAPP" | "ADMIN";
  confirmedAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: ApiOrderItem[];
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  data: ApiOrder;
}

export function createOrder(input: CreateOrderInput) {
  return apiRequest<CreateOrderResponse>("/orders", {
    method: "POST",
    body: JSON.stringify(input),
  });
}