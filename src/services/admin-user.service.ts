import { apiRequest } from "../lib/api";

export type AdminUserRole =
  | "CUSTOMER"
  | "WHOLESALE"
  | "ADMIN";

export type AdminUserStatus =
  | "ACTIVE"
  | "SUSPENDED"
  | "DELETED";

export interface AdminUserWholesaleApplication {
  id: string;
  businessName: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reviewedAt: string | null;
}

export interface AdminUserOrderSummary {
  id: string;
  orderNumber: string;
  status:
    | "PENDING_CONFIRMATION"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";
  total: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: AdminUserRole;
  status: AdminUserStatus;
  emailVerified: boolean;
  emailVerifiedAt?: string | null;
  lastLoginAt: string | null;
  passwordChangedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  wholesaleApplication:
    | AdminUserWholesaleApplication
    | null;
  orders?: AdminUserOrderSummary[];
  _count: {
    orders: number;
  };
}

export interface AdminUsersPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminUsersResponse {
  success: boolean;
  message: string;
  data: AdminUser[];
  pagination: AdminUsersPagination;
}

export interface AdminUserResponse {
  success: boolean;
  message: string;
  data: AdminUser;
}

export interface GetAdminUsersOptions {
  page?: number;
  limit?: number;
  search?: string;
  role?: AdminUserRole;
  status?: AdminUserStatus;
}

export interface UpdateAdminUserStatusInput {
  status: AdminUserStatus;
}

export interface UpdateAdminUserRoleInput {
  role: AdminUserRole;
}

function getAdminAccessToken(): string {
  const token = localStorage.getItem(
    "adminAccessToken",
  );

  if (!token) {
    throw new Error(
      "Admin authentication required.",
    );
  }

  return token;
}

function getAuthorizationHeaders() {
  return {
    Authorization: `Bearer ${getAdminAccessToken()}`,
  };
}

function getJsonHeaders() {
  return {
    ...getAuthorizationHeaders(),
    "Content-Type": "application/json",
  };
}

function createQueryString(
  options: GetAdminUsersOptions,
) {
  const searchParams = new URLSearchParams();

  Object.entries(options).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        searchParams.set(
          key,
          String(value),
        );
      }
    },
  );

  return searchParams.toString();
}

function validateUserId(userId: string) {
  const normalizedUserId = userId.trim();

  if (!normalizedUserId) {
    throw new Error(
      "User ID is required.",
    );
  }

  return normalizedUserId;
}

export function getAdminUsers(
  options: GetAdminUsersOptions = {},
) {
  const queryString =
    createQueryString(options);

  return apiRequest<AdminUsersResponse>(
    queryString
      ? `/users?${queryString}`
      : "/users",
    {
      headers:
        getAuthorizationHeaders(),
    },
  );
}

export function getAdminUserById(
  userId: string,
) {
  const normalizedUserId =
    validateUserId(userId);

  return apiRequest<AdminUserResponse>(
    `/users/${encodeURIComponent(
      normalizedUserId,
    )}`,
    {
      headers:
        getAuthorizationHeaders(),
    },
  );
}

export function updateAdminUserStatus(
  userId: string,
  input: UpdateAdminUserStatusInput,
) {
  const normalizedUserId =
    validateUserId(userId);

  return apiRequest<AdminUserResponse>(
    `/users/${encodeURIComponent(
      normalizedUserId,
    )}/status`,
    {
      method: "PATCH",
      headers: getJsonHeaders(),
      body: JSON.stringify(input),
    },
  );
}

export function updateAdminUserRole(
  userId: string,
  input: UpdateAdminUserRoleInput,
) {
  const normalizedUserId =
    validateUserId(userId);

  return apiRequest<AdminUserResponse>(
    `/users/${encodeURIComponent(
      normalizedUserId,
    )}/role`,
    {
      method: "PATCH",
      headers: getJsonHeaders(),
      body: JSON.stringify(input),
    },
  );
}