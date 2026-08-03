import { apiRequest } from "../lib/api";

export type WholesaleApplicationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export interface WholesaleApplicationUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: "CUSTOMER" | "WHOLESALE" | "ADMIN";
  status: "ACTIVE" | "SUSPENDED" | "DELETED";
  createdAt?: string;
}

export interface WholesaleApplication {
  id: string;
  userId: string;
  businessName: string;
  businessType: string | null;
  businessPhone: string | null;
  businessEmail: string | null;
  gstNumber: string | null;
  panNumber: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  expectedMonthlyOrderValue: number | null;
  notes: string | null;
  status: WholesaleApplicationStatus;
  reviewedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  user: WholesaleApplicationUser;
}

export interface WholesalePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface WholesaleApplicationsResponse {
  success: boolean;
  message: string;
  data: WholesaleApplication[];
  pagination: WholesalePagination;
}

export interface WholesaleApplicationResponse {
  success: boolean;
  message: string;
  data: WholesaleApplication;
}

export interface GetWholesaleApplicationsOptions {
  page?: number;
  limit?: number;
  status?: WholesaleApplicationStatus;
  search?: string;
}

export interface ReviewWholesaleApplicationInput {
  action: "APPROVE" | "REJECT";
  rejectionReason?: string;
}

function getAdminAccessToken(): string {
  const token = localStorage.getItem("adminAccessToken");

  if (!token) {
    throw new Error("Admin authentication required.");
  }

  return token;
}

function getAuthorizationHeaders() {
  return {
    Authorization: `Bearer ${getAdminAccessToken()}`,
  };
}

function createQueryString(
  options: GetWholesaleApplicationsOptions,
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

  return searchParams.toString();
}

function requireId(value: string, label: string) {
  if (!value.trim()) {
    throw new Error(`${label} is required.`);
  }
}

export function getAdminWholesaleApplications(
  options: GetWholesaleApplicationsOptions = {},
) {
  const queryString = createQueryString(options);

  return apiRequest<WholesaleApplicationsResponse>(
    queryString
      ? `/wholesale/admin/applications?${queryString}`
      : "/wholesale/admin/applications",
    {
      headers: getAuthorizationHeaders(),
    },
  );
}

export function getAdminWholesaleApplicationById(
  applicationId: string,
) {
  requireId(applicationId, "Application ID");

  return apiRequest<WholesaleApplicationResponse>(
    `/wholesale/admin/applications/${applicationId}`,
    {
      headers: getAuthorizationHeaders(),
    },
  );
}

export function reviewAdminWholesaleApplication(
  applicationId: string,
  input: ReviewWholesaleApplicationInput,
) {
  requireId(applicationId, "Application ID");

  return apiRequest<WholesaleApplicationResponse>(
    `/wholesale/admin/applications/${applicationId}/review`,
    {
      method: "PATCH",
      headers: getAuthorizationHeaders(),
      body: JSON.stringify(input),
    },
  );
}