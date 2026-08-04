import {
  AlertCircle,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Eye,
  LoaderCircle,
  Mail,
  Package,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  Store,
  UserRound,
  Users,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getAdminUsers,
  updateAdminUserRole,
  updateAdminUserStatus,
  type AdminUser,
  type AdminUserRole,
  type AdminUsersPagination,
  type AdminUserStatus,
} from "../../services/admin-user.service";

type RoleFilter = "ALL" | AdminUserRole;
type StatusFilter = "ALL" | AdminUserStatus;

type ActionState = {
  userId: string;
  action: string;
} | null;

type FeedbackMessage = {
  type: "success" | "error";
  message: string;
} | null;

const EMPTY_PAGINATION: AdminUsersPagination = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
};

function formatDate(
  value: string | null | undefined,
) {
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

function getFullName(user: AdminUser) {
  return `${user.firstName} ${user.lastName}`.trim();
}

function getInitials(user: AdminUser) {
  return [user.firstName, user.lastName]
    .filter(Boolean)
    .map((name) =>
      name.charAt(0).toUpperCase(),
    )
    .join("")
    .slice(0, 2);
}

function getRoleClasses(
  role: AdminUserRole,
) {
  if (role === "ADMIN") {
    return "border-purple-200 bg-purple-50 text-purple-700";
  }

  if (role === "WHOLESALE") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
}

function getStatusClasses(
  status: AdminUserStatus,
) {
  if (status === "ACTIVE") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "SUSPENDED") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-red-200 bg-red-50 text-red-700";
}

function getStatusActionLabel(
  status: AdminUserStatus,
) {
  if (status === "ACTIVE") {
    return "Suspend";
  }

  return "Activate";
}

export default function AdminCustomersPage() {
  const [users, setUsers] =
    useState<AdminUser[]>([]);

  const [pagination, setPagination] =
    useState<AdminUsersPagination>(
      EMPTY_PAGINATION,
    );

  const [page, setPage] = useState(1);

  const [searchInput, setSearchInput] =
    useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState<RoleFilter>("ALL");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  const [selectedUser, setSelectedUser] =
    useState<AdminUser | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [feedback, setFeedback] =
    useState<FeedbackMessage>(null);

  const [actionState, setActionState] =
    useState<ActionState>(null);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await getAdminUsers({
        page,
        limit: 20,
        search: searchTerm || undefined,
        role:
          roleFilter === "ALL"
            ? undefined
            : roleFilter,
        status:
          statusFilter === "ALL"
            ? undefined
            : statusFilter,
      });

      setUsers(response.data);
      setPagination(response.pagination);
    } catch (error) {
      setUsers([]);
      setPagination(EMPTY_PAGINATION);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load customers.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    page,
    roleFilter,
    searchTerm,
    statusFilter,
  ]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadUsers();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadUsers]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setPage(1);
      setSearchTerm(searchInput.trim());
    }, 400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchInput]);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setFeedback(null);
    }, 4000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [feedback]);

  const pageTotals = useMemo(() => {
    return users.reduce(
      (totals, user) => {
        totals[user.role] += 1;
        return totals;
      },
      {
        CUSTOMER: 0,
        WHOLESALE: 0,
        ADMIN: 0,
      },
    );
  }, [users]);

  const updateUserInState = useCallback(
    (updatedUser: AdminUser) => {
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === updatedUser.id
            ? updatedUser
            : user,
        ),
      );

      setSelectedUser((currentUser) =>
        currentUser?.id === updatedUser.id
          ? updatedUser
          : currentUser,
      );
    },
    [],
  );

  const handleStatusChange = async (
    user: AdminUser,
    nextStatus: AdminUserStatus,
  ) => {
    const actionLabel =
      nextStatus === "ACTIVE"
        ? "activate"
        : nextStatus === "SUSPENDED"
          ? "suspend"
          : "soft delete";

    const confirmed = window.confirm(
      `Are you sure you want to ${actionLabel} ${getFullName(
        user,
      )}?`,
    );

    if (!confirmed) {
      return;
    }

    setActionState({
      userId: user.id,
      action: `status-${nextStatus}`,
    });

    setFeedback(null);

    try {
      const response =
        await updateAdminUserStatus(user.id, {
          status: nextStatus,
        });

      updateUserInState(response.data);

      setFeedback({
        type: "success",
        message:
          response.message ||
          "User status updated successfully.",
      });

      await loadUsers();
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to update user status.",
      });
    } finally {
      setActionState(null);
    }
  };

  const handleRoleChange = async (
    user: AdminUser,
    nextRole: AdminUserRole,
  ) => {
    if (nextRole === user.role) {
      return;
    }

    const confirmed = window.confirm(
      `Change ${getFullName(
        user,
      )}'s role from ${user.role} to ${nextRole}?`,
    );

    if (!confirmed) {
      return;
    }

    setActionState({
      userId: user.id,
      action: `role-${nextRole}`,
    });

    setFeedback(null);

    try {
      const response =
        await updateAdminUserRole(user.id, {
          role: nextRole,
        });

      updateUserInState(response.data);

      setFeedback({
        type: "success",
        message:
          response.message ||
          "User role updated successfully.",
      });

      await loadUsers();
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to update user role.",
      });
    } finally {
      setActionState(null);
    }
  };

  const isActionRunning = (
    userId: string,
  ) => actionState?.userId === userId;
    return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#B38E49]">
            Customer Management
          </p>

          <h1 className="mt-2 font-serif text-4xl text-[#0F4C3A]">
            Customers
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#6D746F]">
            View customer accounts, wholesale access,
            order activity and account status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadUsers()}
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

      {feedback && (
        <div
          className={`flex items-center gap-3 rounded-2xl border px-5 py-4 text-sm ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {feedback.type === "success" ? (
            <BadgeCheck
              size={19}
              className="shrink-0"
            />
          ) : (
            <AlertCircle
              size={19}
              className="shrink-0"
            />
          )}

          {feedback.message}
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <AlertCircle
            size={19}
            className="shrink-0"
          />
          {errorMessage}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total Users"
          value={pagination.total}
          icon={<Users size={20} />}
          iconClasses="bg-[#EEF3F0] text-[#0F4C3A]"
        />

        <SummaryCard
          label="Customers"
          value={pageTotals.CUSTOMER}
          icon={<UserRound size={20} />}
          iconClasses="bg-slate-100 text-slate-700"
        />

        <SummaryCard
          label="Wholesale"
          value={pageTotals.WHOLESALE}
          icon={<Store size={20} />}
          iconClasses="bg-emerald-50 text-emerald-700"
        />

        <SummaryCard
          label="Admins"
          value={pageTotals.ADMIN}
          icon={<ShieldCheck size={20} />}
          iconClasses="bg-purple-50 text-purple-700"
        />
      </div>

      <p className="-mt-2 text-xs text-[#8A918D]">
        Role cards reflect users loaded on the current page.
      </p>

      <div className="rounded-[24px] border border-[#E2D8C7] bg-white p-5 shadow-sm">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px_220px]">
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
              placeholder="Search name, email or phone..."
              className="w-full rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] py-3 pl-11 pr-4 text-sm text-[#263D35] outline-none transition placeholder:text-[#9AA09C] focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15"
            />
          </label>

          <select
            value={roleFilter}
            onChange={(event) => {
              setRoleFilter(
                event.target.value as RoleFilter,
              );
              setPage(1);
            }}
            className="rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] px-4 py-3 text-sm text-[#263D35] outline-none transition focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15"
          >
            <option value="ALL">
              All Roles
            </option>
            <option value="CUSTOMER">
              Customers
            </option>
            <option value="WHOLESALE">
              Wholesale
            </option>
            <option value="ADMIN">
              Admins
            </option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(
                event.target
                  .value as StatusFilter,
              );
              setPage(1);
            }}
            className="rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] px-4 py-3 text-sm text-[#263D35] outline-none transition focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15"
          >
            <option value="ALL">
              All Statuses
            </option>
            <option value="ACTIVE">
              Active
            </option>
            <option value="SUSPENDED">
              Suspended
            </option>
            <option value="DELETED">
              Deleted
            </option>
          </select>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-[#EEE7DC] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#7B837E]">
            Showing{" "}
            <span className="font-semibold text-[#0F4C3A]">
              {users.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[#0F4C3A]">
              {pagination.total}
            </span>{" "}
            users
          </p>

          {(searchInput ||
            roleFilter !== "ALL" ||
            statusFilter !== "ALL") && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                setSearchTerm("");
                setRoleFilter("ALL");
                setStatusFilter("ALL");
                setPage(1);
              }}
              className="text-sm font-semibold text-[#B38E49] transition hover:text-[#8E6B2F]"
            >
              Clear filters
            </button>
          )}
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
              Loading customers...
            </p>
          </div>
        ) : users.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF3F0] text-[#0F4C3A]">
              <Users size={25} />
            </div>

            <p className="mt-4 font-semibold text-[#263D35]">
              No users found
            </p>

            <p className="mt-1 text-sm text-[#8A918D]">
              Try changing the search or filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1250px]">
              <thead className="bg-[#F8F5F0]">
                <tr className="text-left">
                  <TableHeading>
                    Customer
                  </TableHeading>

                  <TableHeading>
                    Contact
                  </TableHeading>

                  <TableHeading>
                    Role
                  </TableHeading>

                  <TableHeading>
                    Status
                  </TableHeading>

                  <TableHeading>
                    Orders
                  </TableHeading>

                  <TableHeading>
                    Last Login
                  </TableHeading>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.14em] text-[#7B837E]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#EEE7DC]">
                {users.map((user) => {
                  const actionRunning =
                    isActionRunning(user.id);

                  const isAdmin =
                    user.role === "ADMIN";

                  const isDeleted =
                    user.status === "DELETED";

                  const nextPrimaryStatus:
                    | AdminUserStatus
                    | null =
                    user.status === "ACTIVE"
                      ? "SUSPENDED"
                      : user.status ===
                          "SUSPENDED"
                        ? "ACTIVE"
                        : null;

                  return (
                    <tr
                      key={user.id}
                      className="transition hover:bg-[#FCFAF7]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0F4C3A] text-sm font-semibold text-white">
                            {getInitials(user) || (
                              <UserRound
                                size={18}
                              />
                            )}
                          </div>

                          <div>
                            <p className="font-semibold text-[#263D35]">
                              {getFullName(user)}
                            </p>

                            <p className="mt-1 text-xs text-[#8A918D]">
                              Joined{" "}
                              {formatDate(
                                user.createdAt,
                              )}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-[#263D35]">
                          {user.email}
                        </p>

                        <p className="mt-1 text-xs text-[#8A918D]">
                          {user.phone ||
                            "No phone"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        {isAdmin ? (
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getRoleClasses(
                              user.role,
                            )}`}
                          >
                            {user.role}
                          </span>
                        ) : (
                          <select
                            value={user.role}
                            disabled={
                              actionRunning ||
                              isDeleted
                            }
                            onChange={(event) => {
                              const nextRole =
                                event.target
                                  .value as AdminUserRole;

                              void handleRoleChange(
                                user,
                                nextRole,
                              );
                            }}
                            className="rounded-xl border border-[#DDD2C0] bg-white px-3 py-2 text-xs font-semibold text-[#263D35] outline-none transition focus:border-[#B38E49] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="CUSTOMER">
                              Customer
                            </option>

                            <option value="WHOLESALE">
                              Wholesale
                            </option>
                          </select>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                            user.status,
                          )}`}
                        >
                          {user.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-[#263D35]">
                        {user._count.orders}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-[#5E6964]">
                        {formatDate(
                          user.lastLoginAt,
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedUser(user)
                            }
                            disabled={actionRunning}
                            className="inline-flex items-center gap-2 rounded-xl border border-[#DDD2C0] bg-white px-3 py-2 text-xs font-semibold text-[#0F4C3A] transition hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Eye size={14} />
                            View
                          </button>

                          {!isAdmin &&
                            nextPrimaryStatus && (
                              <button
                                type="button"
                                disabled={
                                  actionRunning
                                }
                                onClick={() =>
                                  void handleStatusChange(
                                    user,
                                    nextPrimaryStatus,
                                  )
                                }
                                className={`rounded-xl border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                  nextPrimaryStatus ===
                                  "ACTIVE"
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                    : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                                }`}
                              >
                                {actionRunning
                                  ? "Updating..."
                                  : getStatusActionLabel(
                                      user.status,
                                    )}
                              </button>
                            )}

                          {!isAdmin &&
                            !isDeleted && (
                              <button
                                type="button"
                                disabled={
                                  actionRunning
                                }
                                onClick={() =>
                                  void handleStatusChange(
                                    user,
                                    "DELETED",
                                  )
                                }
                                className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Delete
                              </button>
                            )}

                          {!isAdmin &&
                            isDeleted && (
                              <button
                                type="button"
                                disabled={
                                  actionRunning
                                }
                                onClick={() =>
                                  void handleStatusChange(
                                    user,
                                    "ACTIVE",
                                  )
                                }
                                className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {actionRunning
                                  ? "Restoring..."
                                  : "Restore"}
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
                  Math.max(
                    currentPage - 1,
                    1,
                  ),
                )
              }
              disabled={
                page <= 1 || isLoading
              }
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
                page >=
                  pagination.totalPages ||
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

      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() =>
            setSelectedUser(null)
          }
          onStatusChange={
            handleStatusChange
          }
          onRoleChange={
            handleRoleChange
          }
          isActionRunning={isActionRunning(
            selectedUser.id,
          )}
        />
      )}
    </section>
  );
}
interface SummaryCardProps {
  label: string;
  value: number;
  icon: ReactNode;
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
  children: ReactNode;
}) {
  return (
    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#7B837E]">
      {children}
    </th>
  );
}

interface UserDetailsModalProps {
  user: AdminUser;
  onClose: () => void;
  onStatusChange: (
    user: AdminUser,
    nextStatus: AdminUserStatus,
  ) => Promise<void>;
  onRoleChange: (
    user: AdminUser,
    nextRole: AdminUserRole,
  ) => Promise<void>;
  isActionRunning: boolean;
}

function UserDetailsModal({
  user,
  onClose,
  onStatusChange,
  onRoleChange,
  isActionRunning,
}: UserDetailsModalProps) {
  const isAdmin = user.role === "ADMIN";
  const isDeleted = user.status === "DELETED";

  const nextPrimaryStatus:
    | AdminUserStatus
    | null =
    user.status === "ACTIVE"
      ? "SUSPENDED"
      : user.status === "SUSPENDED"
        ? "ACTIVE"
        : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-[28px] border border-[#E2D8C7] bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-[#EEE7DC] px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0F4C3A] text-lg font-semibold text-white">
              {getInitials(user) || (
                <CircleUserRound size={24} />
              )}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B38E49]">
                Customer Details
              </p>

              <h2 className="mt-1 font-serif text-3xl text-[#0F4C3A]">
                {getFullName(user)}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isActionRunning}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD2C0] text-[#5E6964] transition hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <DetailsSection title="Account">
            <DetailRow
              label="Role"
              value={user.role}
            />

            <DetailRow
              label="Status"
              value={user.status}
            />

            <DetailRow
              label="Joined"
              value={formatDate(user.createdAt)}
            />

            <DetailRow
              label="Last login"
              value={formatDate(user.lastLoginAt)}
            />
          </DetailsSection>

          <DetailsSection title="Contact">
            <DetailRowWithIcon
              icon={<Mail size={15} />}
              label="Email"
              value={user.email}
            />

            <DetailRowWithIcon
              icon={<Phone size={15} />}
              label="Phone"
              value={user.phone || "Not provided"}
            />

            <DetailRow
              label="Email verified"
              value={
                user.emailVerified
                  ? "Verified"
                  : "Not verified"
              }
            />
          </DetailsSection>

          <DetailsSection title="Orders">
            <DetailRowWithIcon
              icon={<Package size={15} />}
              label="Total orders"
              value={String(user._count.orders)}
            />

            {user.orders &&
              user.orders.length > 0 && (
                <div className="space-y-3 pt-2">
                  {user.orders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-xl border border-[#E7DDCB] bg-white p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-[#263D35]">
                          {order.orderNumber}
                        </p>

                        <span className="text-xs font-semibold text-[#0F4C3A]">
                          ₹
                          {Number(
                            order.total,
                          ).toLocaleString(
                            "en-IN",
                          )}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between gap-3 text-xs text-[#7B837E]">
                        <span>{order.status}</span>
                        <span>
                          {formatDate(
                            order.createdAt,
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </DetailsSection>

          <DetailsSection title="Wholesale">
            <DetailRowWithIcon
              icon={<Store size={15} />}
              label="Application status"
              value={
                user.wholesaleApplication
                  ?.status || "Not applied"
              }
            />

            <DetailRow
              label="Business name"
              value={
                user.wholesaleApplication
                  ?.businessName || "—"
              }
            />

            <DetailRow
              label="Reviewed"
              value={formatDate(
                user.wholesaleApplication
                  ?.reviewedAt,
              )}
            />
          </DetailsSection>

          <div className="md:col-span-2 rounded-2xl border border-[#E7DDCB] bg-[#FCFAF7] p-5">
            <div className="flex items-center gap-3">
              {user.emailVerified ? (
                <BadgeCheck
                  size={20}
                  className="text-emerald-700"
                />
              ) : (
                <AlertCircle
                  size={20}
                  className="text-amber-700"
                />
              )}

              <div>
                <p className="text-sm font-semibold text-[#263D35]">
                  Account verification
                </p>

                <p className="mt-1 text-xs text-[#7B837E]">
                  {user.emailVerified
                    ? "This customer has verified their email address."
                    : "This customer has not verified their email address."}
                </p>
              </div>
            </div>
          </div>

          {!isAdmin && (
            <div className="md:col-span-2 rounded-2xl border border-[#E7DDCB] bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#B38E49]">
                Account Actions
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-semibold text-[#7B837E]">
                    Change Role
                  </span>

                  <select
                    value={user.role}
                    disabled={
                      isActionRunning ||
                      isDeleted
                    }
                    onChange={(event) => {
                      const nextRole =
                        event.target
                          .value as AdminUserRole;

                      void onRoleChange(
                        user,
                        nextRole,
                      );
                    }}
                    className="mt-2 w-full rounded-xl border border-[#DDD2C0] bg-[#FCFAF7] px-4 py-3 text-sm font-semibold text-[#263D35] outline-none transition focus:border-[#B38E49] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="CUSTOMER">
                      Customer
                    </option>

                    <option value="WHOLESALE">
                      Wholesale
                    </option>
                  </select>
                </label>

                <div>
                  <span className="text-xs font-semibold text-[#7B837E]">
                    Account Status
                  </span>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {nextPrimaryStatus && (
                      <button
                        type="button"
                        disabled={isActionRunning}
                        onClick={() =>
                          void onStatusChange(
                            user,
                            nextPrimaryStatus,
                          )
                        }
                        className={`rounded-xl border px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                          nextPrimaryStatus ===
                          "ACTIVE"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                        }`}
                      >
                        {isActionRunning
                          ? "Updating..."
                          : getStatusActionLabel(
                              user.status,
                            )}
                      </button>
                    )}

                    {!isDeleted && (
                      <button
                        type="button"
                        disabled={isActionRunning}
                        onClick={() =>
                          void onStatusChange(
                            user,
                            "DELETED",
                          )
                        }
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Soft Delete
                      </button>
                    )}

                    {isDeleted && (
                      <button
                        type="button"
                        disabled={isActionRunning}
                        onClick={() =>
                          void onStatusChange(
                            user,
                            "ACTIVE",
                          )
                        }
                        className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isActionRunning
                          ? "Restoring..."
                          : "Restore Account"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-[#EEE7DC] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isActionRunning}
            className="rounded-xl border border-[#DDD2C0] px-5 py-2.5 text-sm font-semibold text-[#0F4C3A] transition hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Close
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
  children: ReactNode;
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

function DetailRowWithIcon({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-[#B38E49]">
        {icon}
      </div>

      <DetailRow
        label={label}
        value={value}
      />
    </div>
  );
}