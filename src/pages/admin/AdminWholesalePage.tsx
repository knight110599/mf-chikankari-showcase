import {
  AlertCircle,
  BadgeCheck,
  Building2,
  ChevronLeft,
  ChevronRight,
  CircleX,
  Eye,
  LoaderCircle,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getAdminWholesaleApplications,
  reviewAdminWholesaleApplication,
  type WholesaleApplication,
  type WholesaleApplicationStatus,
  type WholesalePagination,
} from "../../services/admin-wholesale.service";

type StatusFilter =
  | "ALL"
  | WholesaleApplicationStatus;

const EMPTY_PAGINATION: WholesalePagination = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
};

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatCurrency(value: number | null) {
  if (value === null) {
    return "—";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getStatusClasses(
  status: WholesaleApplicationStatus,
) {
  if (status === "APPROVED") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "REJECTED") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

function getFullName(application: WholesaleApplication) {
  return `${application.user.firstName} ${application.user.lastName}`.trim();
}

export default function AdminWholesalePage() {
  const [applications, setApplications] = useState<
    WholesaleApplication[]
  >([]);

  const [pagination, setPagination] =
    useState<WholesalePagination>(
      EMPTY_PAGINATION,
    );

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] =
    useState("");
  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  const [selectedApplication, setSelectedApplication] =
    useState<WholesaleApplication | null>(null);

  const [reviewApplication, setReviewApplication] =
    useState<WholesaleApplication | null>(null);

  const [reviewAction, setReviewAction] =
    useState<"APPROVE" | "REJECT" | null>(
      null,
    );

  const [rejectionReason, setRejectionReason] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [isReviewing, setIsReviewing] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const loadApplications = useCallback(
    async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response =
          await getAdminWholesaleApplications({
            page,
            limit: 20,
            search: searchTerm || undefined,
            status:
              statusFilter === "ALL"
                ? undefined
                : statusFilter,
          });

        setApplications(response.data);
        setPagination(response.pagination);
      } catch (error) {
        setApplications([]);
        setPagination(EMPTY_PAGINATION);

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load wholesale applications.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [page, searchTerm, statusFilter],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadApplications();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadApplications]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setPage(1);
      setSearchTerm(searchInput.trim());
    }, 400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchInput]);

  const statusTotals = useMemo(() => {
    return applications.reduce(
      (totals, application) => {
        totals[application.status] += 1;
        return totals;
      },
      {
        PENDING: 0,
        APPROVED: 0,
        REJECTED: 0,
      },
    );
  }, [applications]);

  const openReviewModal = (
    application: WholesaleApplication,
    action: "APPROVE" | "REJECT",
  ) => {
    setReviewApplication(application);
    setReviewAction(action);
    setRejectionReason("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  const closeReviewModal = () => {
    if (isReviewing) {
      return;
    }

    setReviewApplication(null);
    setReviewAction(null);
    setRejectionReason("");
  };

  const handleReview = async () => {
    if (!reviewApplication || !reviewAction) {
      return;
    }

    const trimmedReason =
      rejectionReason.trim();

    if (
      reviewAction === "REJECT" &&
      !trimmedReason
    ) {
      setErrorMessage(
        "Rejection reason is required.",
      );
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    try {
      setIsReviewing(true);

      const response =
        await reviewAdminWholesaleApplication(
          reviewApplication.id,
          {
            action: reviewAction,
            rejectionReason:
              reviewAction === "REJECT"
                ? trimmedReason
                : undefined,
          },
        );

      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application.id === response.data.id
            ? {
                ...application,
                ...response.data,
              }
            : application,
        ),
      );

      setSelectedApplication(
        (currentApplication) =>
          currentApplication?.id ===
          response.data.id
            ? response.data
            : currentApplication,
      );

      setSuccessMessage(response.message);
      closeReviewModal();

      await loadApplications();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to review this application.",
      );
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#B38E49]">
            Wholesale Management
          </p>

          <h1 className="mt-2 font-serif text-4xl text-[#0F4C3A]">
            Wholesale Applications
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#6D746F]">
            Review and manage wholesale account
            applications.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadApplications()}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#DDD2C0] bg-white px-4 py-3 text-sm font-semibold text-[#0F4C3A] shadow-sm transition hover:bg-[#FCFAF7] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={
              isLoading ? "animate-spin" : ""
            }
          />
          Refresh
        </button>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <AlertCircle
            size={19}
            className="shrink-0"
          />
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
          <BadgeCheck
            size={19}
            className="shrink-0"
          />
          {successMessage}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total Applications"
          value={pagination.total}
          icon={<Building2 size={20} />}
          iconClasses="bg-[#EEF3F0] text-[#0F4C3A]"
        />

        <SummaryCard
          label="Pending"
          value={statusTotals.PENDING}
          icon={<AlertCircle size={20} />}
          iconClasses="bg-amber-50 text-amber-700"
        />

        <SummaryCard
          label="Approved"
          value={statusTotals.APPROVED}
          icon={<BadgeCheck size={20} />}
          iconClasses="bg-emerald-50 text-emerald-700"
        />

        <SummaryCard
          label="Rejected"
          value={statusTotals.REJECTED}
          icon={<CircleX size={20} />}
          iconClasses="bg-red-50 text-red-700"
        />
      </div>

      <p className="-mt-2 text-xs text-[#8A918D]">
        Status cards reflect applications loaded on the
        current page.
      </p>

      <div className="rounded-[24px] border border-[#E2D8C7] bg-white p-5 shadow-sm">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_240px]">
          <label className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8A918D]"
            />

            <input
              type="search"
              value={searchInput}
              onChange={(event) =>
                setSearchInput(event.target.value)
              }
              placeholder="Search business, owner, email, GST or PAN..."
              className="w-full rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] py-3 pl-11 pr-4 text-sm text-[#263D35] outline-none transition placeholder:text-[#9AA09C] focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15"
            />
          </label>

          <label className="relative">
            <SlidersHorizontal
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8A918D]"
            />

            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(
                  event.target
                    .value as StatusFilter,
                );
                setPage(1);
              }}
              className="w-full appearance-none rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] py-3 pl-11 pr-4 text-sm text-[#263D35] outline-none transition focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15"
            >
              <option value="ALL">
                All applications
              </option>
              <option value="PENDING">
                Pending
              </option>
              <option value="APPROVED">
                Approved
              </option>
              <option value="REJECTED">
                Rejected
              </option>
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-[#EEE7DC] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#7B837E]">
            Showing{" "}
            <span className="font-semibold text-[#0F4C3A]">
              {applications.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[#0F4C3A]">
              {pagination.total}
            </span>{" "}
            applications
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-[#E2D8C7] bg-white shadow-sm">
        {isLoading ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center px-6 py-16 text-center">
            <LoaderCircle
              size={28}
              className="animate-spin text-[#0F4C3A]"
            />

            <p className="mt-4 text-sm text-[#7B837E]">
              Loading wholesale applications...
            </p>
          </div>
        ) : applications.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF3F0] text-[#0F4C3A]">
              <Building2 size={25} />
            </div>

            <p className="mt-4 font-semibold text-[#263D35]">
              No applications found
            </p>

            <p className="mt-1 text-sm text-[#8A918D]">
              Try changing the search or status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead className="bg-[#F8F5F0]">
                <tr className="text-left">
                  <TableHeading>
                    Business
                  </TableHeading>
                  <TableHeading>
                    Applicant
                  </TableHeading>
                  <TableHeading>
                    Contact
                  </TableHeading>
                  <TableHeading>
                    Monthly Value
                  </TableHeading>
                  <TableHeading>
                    Applied
                  </TableHeading>
                  <TableHeading>
                    Status
                  </TableHeading>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.14em] text-[#7B837E]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#EEE7DC]">
                {applications.map((application) => (
                  <tr
                    key={application.id}
                    className="transition hover:bg-[#FCFAF7]"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#263D35]">
                        {application.businessName}
                      </p>

                      <p className="mt-1 text-xs text-[#8A918D]">
                        {application.businessType ||
                          "Business type not provided"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-[#263D35]">
                        {getFullName(application)}
                      </p>

                      <p className="mt-1 text-xs text-[#8A918D]">
                        {application.user.email}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-[#5E6964]">
                      {application.businessPhone ||
                        application.user.phone ||
                        "—"}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-[#263D35]">
                      {formatCurrency(
                        application.expectedMonthlyOrderValue,
                      )}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-[#5E6964]">
                      {formatDate(
                        application.createdAt,
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                          application.status,
                        )}`}
                      >
                        {application.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedApplication(
                              application,
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-xl border border-[#DDD2C0] bg-white px-3 py-2 text-xs font-semibold text-[#0F4C3A] transition hover:bg-[#F8F5F0]"
                        >
                          <Eye size={14} />
                          View
                        </button>

                        {application.status ===
                          "PENDING" && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                openReviewModal(
                                  application,
                                  "APPROVE",
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800"
                            >
                              <BadgeCheck size={14} />
                              Approve
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                openReviewModal(
                                  application,
                                  "REJECT",
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-xl bg-red-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-800"
                            >
                              <CircleX size={14} />
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#EEE7DC] px-5 py-4">
            <button
              type="button"
              onClick={() =>
                setPage((currentPage) =>
                  Math.max(currentPage - 1, 1),
                )
              }
              disabled={page <= 1 || isLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-[#DDD2C0] px-4 py-2 text-sm font-semibold text-[#0F4C3A] transition hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <p className="text-sm text-[#7B837E]">
              Page{" "}
              <span className="font-semibold text-[#0F4C3A]">
                {pagination.page}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#0F4C3A]">
                {pagination.totalPages}
              </span>
            </p>

            <button
              type="button"
              onClick={() =>
                setPage((currentPage) =>
                  Math.min(
                    currentPage + 1,
                    pagination.totalPages,
                  ),
                )
              }
              disabled={
                page >= pagination.totalPages ||
                isLoading
              }
              className="inline-flex items-center gap-2 rounded-xl border border-[#DDD2C0] px-4 py-2 text-sm font-semibold text-[#0F4C3A] transition hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {selectedApplication && (
        <ApplicationDetailsModal
          application={selectedApplication}
          onClose={() =>
            setSelectedApplication(null)
          }
          onApprove={() =>
            openReviewModal(
              selectedApplication,
              "APPROVE",
            )
          }
          onReject={() =>
            openReviewModal(
              selectedApplication,
              "REJECT",
            )
          }
        />
      )}

      {reviewApplication && reviewAction && (
        <ReviewApplicationModal
          application={reviewApplication}
          action={reviewAction}
          rejectionReason={rejectionReason}
          isSubmitting={isReviewing}
          onReasonChange={setRejectionReason}
          onClose={closeReviewModal}
          onConfirm={() => void handleReview()}
        />
      )}
    </section>
  );
}

interface SummaryCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconClasses: string;
}

function SummaryCard({
  label,
  value,
  icon,
  iconClasses,
}: SummaryCardProps) {
  return (
    <div className="rounded-[22px] border border-[#E2D8C7] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iconClasses}`}
        >
          {icon}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A918D]">
            {label}
          </p>

          <p className="mt-1 text-2xl font-semibold text-[#0F4C3A]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function TableHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#7B837E]">
      {children}
    </th>
  );
}

interface ApplicationDetailsModalProps {
  application: WholesaleApplication;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}

function ApplicationDetailsModal({
  application,
  onClose,
  onApprove,
  onReject,
}: ApplicationDetailsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-[28px] border border-[#E2D8C7] bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-[#EEE7DC] px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B38E49]">
              Wholesale Application
            </p>

            <h2 className="mt-2 font-serif text-3xl text-[#0F4C3A]">
              {application.businessName}
            </h2>

            <span
              className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                application.status,
              )}`}
            >
              {application.status}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD2C0] text-[#5E6964] transition hover:bg-[#F8F5F0]"
          >
            <X size={19} />
          </button>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <DetailsSection title="Applicant">
            <DetailRow
              label="Name"
              value={getFullName(application)}
            />
            <DetailRow
              label="Email"
              value={application.user.email}
            />
            <DetailRow
              label="Phone"
              value={
                application.user.phone || "—"
              }
            />
            <DetailRow
              label="User role"
              value={application.user.role}
            />
          </DetailsSection>

          <DetailsSection title="Business">
            <DetailRow
              label="Business name"
              value={application.businessName}
            />
            <DetailRow
              label="Business type"
              value={
                application.businessType || "—"
              }
            />
            <DetailRow
              label="Business email"
              value={
                application.businessEmail || "—"
              }
            />
            <DetailRow
              label="Business phone"
              value={
                application.businessPhone || "—"
              }
            />
          </DetailsSection>

          <DetailsSection title="Registration">
            <DetailRow
              label="GST number"
              value={application.gstNumber || "—"}
            />
            <DetailRow
              label="PAN number"
              value={application.panNumber || "—"}
            />
            <DetailRow
              label="Expected monthly value"
              value={formatCurrency(
                application.expectedMonthlyOrderValue,
              )}
            />
          </DetailsSection>

          <DetailsSection title="Address">
            <DetailRow
              label="Address"
              value={[
                application.addressLine1,
                application.addressLine2,
                application.city,
                application.state,
                application.postalCode,
                application.country,
              ]
                .filter(Boolean)
                .join(", ")}
            />
          </DetailsSection>

          <div className="md:col-span-2">
            <DetailsSection title="Notes">
              <p className="text-sm leading-7 text-[#5E6964]">
                {application.notes ||
                  "No additional notes provided."}
              </p>
            </DetailsSection>
          </div>

          {application.rejectionReason && (
            <div className="md:col-span-2 rounded-2xl border border-red-200 bg-red-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-red-700">
                Rejection reason
              </p>

              <p className="mt-2 text-sm leading-6 text-red-700">
                {application.rejectionReason}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t border-[#EEE7DC] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#DDD2C0] px-5 py-2.5 text-sm font-semibold text-[#0F4C3A] transition hover:bg-[#F8F5F0]"
          >
            Close
          </button>

          {application.status === "PENDING" && (
            <>
              <button
                type="button"
                onClick={onReject}
                className="rounded-xl bg-red-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800"
              >
                Reject
              </button>

              <button
                type="button"
                onClick={onApprove}
                className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Approve
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface ReviewApplicationModalProps {
  application: WholesaleApplication;
  action: "APPROVE" | "REJECT";
  rejectionReason: string;
  isSubmitting: boolean;
  onReasonChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

function ReviewApplicationModal({
  application,
  action,
  rejectionReason,
  isSubmitting,
  onReasonChange,
  onClose,
  onConfirm,
}: ReviewApplicationModalProps) {
  const isApprove = action === "APPROVE";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-[28px] border border-[#E2D8C7] bg-white p-6 shadow-2xl">
        <h2 className="font-serif text-3xl text-[#0F4C3A]">
          {isApprove
            ? "Approve Application"
            : "Reject Application"}
        </h2>

        <p className="mt-3 text-sm leading-6 text-[#6D746F]">
          {isApprove
            ? `Approve ${application.businessName} and grant wholesale access?`
            : `Reject the wholesale application for ${application.businessName}?`}
        </p>

        {!isApprove && (
          <label className="mt-5 block">
            <span className="text-sm font-semibold text-[#263D35]">
              Rejection reason
            </span>

            <textarea
              rows={4}
              value={rejectionReason}
              onChange={(event) =>
                onReasonChange(event.target.value)
              }
              placeholder="Explain why the application was rejected"
              className="mt-2 w-full resize-none rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] px-4 py-3 text-sm leading-6 text-[#263D35] outline-none transition focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15"
            />
          </label>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl border border-[#DDD2C0] px-5 py-2.5 text-sm font-semibold text-[#0F4C3A] transition hover:bg-[#F8F5F0] disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
              isApprove
                ? "bg-emerald-700 hover:bg-emerald-800"
                : "bg-red-700 hover:bg-red-800"
            }`}
          >
            {isSubmitting && (
              <LoaderCircle
                size={16}
                className="animate-spin"
              />
            )}

            {isApprove
              ? "Confirm Approval"
              : "Confirm Rejection"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#E7DDCB] bg-[#FCFAF7] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#B38E49]">
        {title}
      </p>

      <div className="mt-4 space-y-3">
        {children}
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-[#8A918D]">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-[#263D35]">
        {value}
      </p>
    </div>
  );
}