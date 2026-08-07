import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Eye,
  PackageCheck,
  RefreshCw,
  Save,
  Search,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getAdminOrders,
  updateAdminOrderStatus,
  type AdminOrder,
  type OrderSource,
  type OrderStatus,
  type PaymentStatus,
} from "../../services/admin-order.service";
import OrderDetailsModal from "../../components/admin/orders/OrderDetailsModal";

const ORDER_STATUS_OPTIONS: Array<{
  value: "all" | OrderStatus;
  label: string;
}> = [
  { value: "all", label: "All Order Statuses" },
  {
    value: "PENDING_CONFIRMATION",
    label: "Pending Confirmation",
  },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

const PAYMENT_STATUS_OPTIONS: Array<{
  value: "all" | PaymentStatus;
  label: string;
}> = [
  { value: "all", label: "All Payment Statuses" },
  { value: "UNPAID", label: "Unpaid" },
  {
    value: "PAYMENT_PENDING",
    label: "Payment Pending",
  },
  { value: "PAID", label: "Paid" },
  { value: "FAILED", label: "Failed" },
  { value: "REFUNDED", label: "Refunded" },
];

const SOURCE_OPTIONS: Array<{
  value: "all" | OrderSource;
  label: string;
}> = [
  { value: "all", label: "All Sources" },
  { value: "WEBSITE", label: "Website" },
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "ADMIN", label: "Admin" },
];

type OrderDraft = {
  status: OrderStatus;
  paymentStatus: PaymentStatus;
};

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() + part.slice(1),
    )
    .join(" ");
}

function formatCurrency(value: string | number) {
  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return "N/A";
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getOrderStatusClasses(status: OrderStatus) {
  switch (status) {
    case "DELIVERED":
      return "bg-emerald-50 text-emerald-700";
    case "CANCELLED":
      return "bg-red-50 text-red-700";
    case "SHIPPED":
      return "bg-blue-50 text-blue-700";
    case "PROCESSING":
      return "bg-violet-50 text-violet-700";
    case "CONFIRMED":
      return "bg-cyan-50 text-cyan-700";
    default:
      return "bg-amber-50 text-amber-700";
  }
}

function getPaymentStatusClasses(
  status: PaymentStatus,
) {
  switch (status) {
    case "PAID":
      return "bg-emerald-50 text-emerald-700";
    case "FAILED":
      return "bg-red-50 text-red-700";
    case "REFUNDED":
      return "bg-slate-100 text-slate-700";
    case "PAYMENT_PENDING":
      return "bg-blue-50 text-blue-700";
    default:
      return "bg-amber-50 text-amber-700";
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [drafts, setDrafts] = useState<
    Record<string, OrderDraft>
  >({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] =
    useState<"all" | OrderStatus>("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] =
    useState<"all" | PaymentStatus>("all");
  const [selectedSource, setSelectedSource] =
    useState<"all" | OrderSource>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [savingOrderId, setSavingOrderId] = useState<
    string | null
  >(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<
    string | null
  >(null);
const fetchOrders = useCallback(async () => {
  const response = await getAdminOrders({
    limit: 100,
    sortOrder: "desc",
  });

  return response.data;
}, []);
  const loadOrders = useCallback(async () => {
  setIsLoading(true);
  setErrorMessage("");

  try {
    const ordersData = await fetchOrders();

    setOrders(ordersData);

    setDrafts(
      Object.fromEntries(
        ordersData.map((order) => [
          order.id,
          {
            status: order.status,
            paymentStatus: order.paymentStatus,
          },
        ]),
      ),
    );
  } catch (error) {
    setErrorMessage(
      error instanceof Error
        ? error.message
        : "Unable to load orders.",
    );
  } finally {
    setIsLoading(false);
  }
}, [fetchOrders]);

  useEffect(() => {
  let isMounted = true;

  void fetchOrders()
    .then((ordersData) => {
      if (!isMounted) {
        return;
      }

      setOrders(ordersData);

      setDrafts(
        Object.fromEntries(
          ordersData.map((order) => [
            order.id,
            {
              status: order.status,
              paymentStatus: order.paymentStatus,
            },
          ]),
        ),
      );
    })
    .catch((error) => {
      if (isMounted) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load orders.",
        );
      }
    })
    .finally(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    });

  return () => {
    isMounted = false;
  };
}, [fetchOrders]);

  const handleDraftChange = (
    orderId: string,
    field: keyof OrderDraft,
    value: OrderStatus | PaymentStatus,
  ) => {
    setDrafts((currentDrafts) => ({
      ...currentDrafts,
      [orderId]: {
        ...currentDrafts[orderId],
        [field]: value,
      },
    }));
  };

  const handleSave = async (order: AdminOrder) => {
    const draft = drafts[order.id];

    if (!draft) {
      return;
    }

    const statusChanged =
      draft.status !== order.status;
    const paymentStatusChanged =
      draft.paymentStatus !== order.paymentStatus;

    if (!statusChanged && !paymentStatusChanged) {
      setSuccessMessage("No changes to save.");
      return;
    }

    try {
      setSavingOrderId(order.id);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await updateAdminOrderStatus(
        order.id,
        {
          ...(statusChanged
            ? { status: draft.status }
            : {}),
          ...(paymentStatusChanged
            ? {
                paymentStatus:
                  draft.paymentStatus,
              }
            : {}),
        },
      );

      setOrders((currentOrders) =>
        currentOrders.map((currentOrder) =>
          currentOrder.id === order.id
            ? {
                ...currentOrder,
                ...response.data,
              }
            : currentOrder,
        ),
      );

      setDrafts((currentDrafts) => ({
        ...currentDrafts,
        [order.id]: {
          status: response.data.status,
          paymentStatus:
            response.data.paymentStatus,
        },
      }));

      setSuccessMessage(
        `${order.orderNumber} updated successfully.`,
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to update order.",
      );
    } finally {
      setSavingOrderId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return orders.filter((order) => {
      const customerName =
        `${order.customerFirstName} ${order.customerLastName}`.toLowerCase();

      const matchesSearch =
        normalizedSearch.length === 0 ||
        order.orderNumber
          .toLowerCase()
          .includes(normalizedSearch) ||
        customerName.includes(normalizedSearch) ||
        order.customerEmail
          .toLowerCase()
          .includes(normalizedSearch) ||
        order.customerPhone
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        selectedStatus === "all" ||
        order.status === selectedStatus;

      const matchesPaymentStatus =
        selectedPaymentStatus === "all" ||
        order.paymentStatus === selectedPaymentStatus;

      const matchesSource =
        selectedSource === "all" ||
        order.source === selectedSource;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPaymentStatus &&
        matchesSource
      );
    });
  }, [
    orders,
    searchTerm,
    selectedStatus,
    selectedPaymentStatus,
    selectedSource,
  ]);

  const pendingCount = useMemo(
    () =>
      orders.filter(
        (order) =>
          order.status === "PENDING_CONFIRMATION",
      ).length,
    [orders],
  );

  const totalValue = useMemo(
    () =>
      orders.reduce(
        (sum, order) => sum + Number(order.total || 0),
        0,
      ),
    [orders],
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#B38E49]">
            Order Management
          </p>

          <h1 className="mt-2 font-serif text-4xl text-[#0F4C3A]">
            Orders
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#6D746F]">
            Review customer orders, payment state and
            fulfilment progress.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadOrders()}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#DDD2C0] bg-white px-4 py-3 text-sm font-semibold text-[#0F4C3A] shadow-sm transition hover:bg-[#FCFAF7] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={isLoading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <AlertCircle size={19} />
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
          <CheckCircle2 size={19} />
          {successMessage}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[22px] border border-[#E2D8C7] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF3F0] text-[#0F4C3A]">
              <ShoppingBag size={20} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A918D]">
                Total Orders
              </p>
              <p className="mt-1 text-2xl font-semibold text-[#0F4C3A]">
                {orders.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[22px] border border-[#E2D8C7] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
              <PackageCheck size={20} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A918D]">
                Pending Confirmation
              </p>
              <p className="mt-1 text-2xl font-semibold text-[#0F4C3A]">
                {pendingCount}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[22px] border border-[#E2D8C7] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F7F0E4] text-[#B38E49]">
              <CalendarDays size={20} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A918D]">
                Order Value
              </p>
              <p className="mt-1 text-2xl font-semibold text-[#0F4C3A]">
                {formatCurrency(totalValue)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-[#E2D8C7] bg-white p-5 shadow-sm">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px_220px_190px]">
          <label className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8A918D]"
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search order, customer, email or phone..."
              className="w-full rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] py-3 pl-11 pr-4 text-sm text-[#263D35] outline-none transition placeholder:text-[#9AA09C] focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15"
            />
          </label>

          <select
            value={selectedStatus}
            onChange={(event) =>
              setSelectedStatus(
                event.target.value as
                  | "all"
                  | OrderStatus,
              )
            }
            className="rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] px-4 py-3 text-sm text-[#263D35] outline-none transition focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15"
          >
            {ORDER_STATUS_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={selectedPaymentStatus}
            onChange={(event) =>
              setSelectedPaymentStatus(
                event.target.value as
                  | "all"
                  | PaymentStatus,
              )
            }
            className="rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] px-4 py-3 text-sm text-[#263D35] outline-none transition focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15"
          >
            {PAYMENT_STATUS_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={selectedSource}
            onChange={(event) =>
              setSelectedSource(
                event.target.value as
                  | "all"
                  | OrderSource,
              )
            }
            className="rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] px-4 py-3 text-sm text-[#263D35] outline-none transition focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15"
          >
            {SOURCE_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-[#EEE7DC] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#7B837E]">
            Showing{" "}
            <span className="font-semibold text-[#0F4C3A]">
              {filteredOrders.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[#0F4C3A]">
              {orders.length}
            </span>{" "}
            orders
          </p>

          {(searchTerm ||
            selectedStatus !== "all" ||
            selectedPaymentStatus !== "all" ||
            selectedSource !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedStatus("all");
                setSelectedPaymentStatus("all");
                setSelectedSource("all");
              }}
              className="text-left text-sm font-semibold text-[#B38E49] transition hover:text-[#8E6B2F]"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-[#E2D8C7] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1420px] border-collapse">
            <thead className="bg-[#F8F5F0]">
              <tr className="border-b border-[#E2D8C7] text-left">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#7B837E]">
                  Order
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#7B837E]">
                  Customer
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#7B837E]">
                  Total
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#7B837E]">
                  Current Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#7B837E]">
                  Update Order Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#7B837E]">
                  Update Payment
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#7B837E]">
                  Source
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#7B837E]">
                  Date
                </th>
                <th className="sticky right-0 z-20 bg-[#F8F5F0] px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.16em] text-[#7B837E] shadow-[-8px_0_12px_-12px_rgba(15,76,58,0.35)]">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#EEE7DC]">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-14 text-center text-sm text-[#7B837E]"
                  >
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-14 text-center"
                  >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFE8DB] text-[#0F4C3A]">
                      <ShoppingBag size={25} />
                    </div>

                    <p className="mt-4 font-semibold text-[#263D35]">
                      No orders found
                    </p>

                    <p className="mt-1 text-sm text-[#8A918D]">
                      New customer orders will appear here.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const draft = drafts[order.id] ?? {
                    status: order.status,
                    paymentStatus:
                      order.paymentStatus,
                  };

                  const hasChanges =
                    draft.status !== order.status ||
                    draft.paymentStatus !==
                      order.paymentStatus;

                  return (
                    <tr
                      key={order.id}
                      className="group transition hover:bg-[#FCFAF7]"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-[#0F4C3A]">
                          {order.orderNumber}
                        </p>
                        <p className="mt-1 text-xs text-[#8A918D]">
                          {order.items?.length
                            ? `${order.items.length} line item${
                                order.items.length === 1
                                  ? ""
                                  : "s"
                              }`
                            : "Order received"}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EEF3F0] text-[#0F4C3A]">
                            <UserRound size={17} />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-[#263D35]">
                              {order.customerFirstName}{" "}
                              {order.customerLastName}
                            </p>
                            <p className="mt-1 text-xs text-[#8A918D]">
                              {order.customerPhone}
                            </p>
                            <p className="mt-1 text-xs text-[#8A918D]">
                              {order.customerEmail}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-[#0F4C3A]">
                        {formatCurrency(order.total)}
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getOrderStatusClasses(
                              order.status,
                            )}`}
                          >
                            {formatLabel(order.status)}
                          </span>

                          <div>
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPaymentStatusClasses(
                                order.paymentStatus,
                              )}`}
                            >
                              {formatLabel(
                                order.paymentStatus,
                              )}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <select
                          value={draft.status}
                          onChange={(event) =>
                            handleDraftChange(
                              order.id,
                              "status",
                              event.target
                                .value as OrderStatus,
                            )
                          }
                          className="w-48 rounded-xl border border-[#DDD2C0] bg-white px-3 py-2.5 text-sm text-[#263D35] outline-none transition focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15"
                        >
                          {ORDER_STATUS_OPTIONS.filter(
                            (option) =>
                              option.value !== "all",
                          ).map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-6 py-4">
                        <select
                          value={draft.paymentStatus}
                          onChange={(event) =>
                            handleDraftChange(
                              order.id,
                              "paymentStatus",
                              event.target
                                .value as PaymentStatus,
                            )
                          }
                          className="w-44 rounded-xl border border-[#DDD2C0] bg-white px-3 py-2.5 text-sm text-[#263D35] outline-none transition focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15"
                        >
                          {PAYMENT_STATUS_OPTIONS.filter(
                            (option) =>
                              option.value !== "all",
                          ).map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-6 py-4 text-sm text-[#5E6964]">
                        {formatLabel(order.source)}
                      </td>

                      <td className="px-6 py-4 text-sm text-[#5E6964]">
                        {formatDate(order.createdAt)}
                      </td>

                      <td className="sticky right-0 z-10 bg-white px-6 py-4 shadow-[-8px_0_12px_-12px_rgba(15,76,58,0.35)] transition-colors group-hover:bg-[#FCFAF7]">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedOrderId(order.id)
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DDD2C0] bg-white px-4 py-2.5 text-sm font-semibold text-[#0F4C3A] transition hover:bg-[#F8F5F0]"
                          >
                            <Eye size={16} />
                            View
                          </button>

                          <button
                            type="button"
                            disabled={
                              !hasChanges ||
                              savingOrderId === order.id
                            }
                            onClick={() =>
                              void handleSave(order)
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F4C3A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B3B2F] disabled:cursor-not-allowed disabled:opacity-45"
                          >
                            {savingOrderId === order.id ? (
                              <RefreshCw
                                size={16}
                                className="animate-spin"
                              />
                            ) : (
                              <Save size={16} />
                            )}

                            {savingOrderId === order.id
                              ? "Saving..."
                              : "Save"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <OrderDetailsModal
        orderId={selectedOrderId}
        isOpen={selectedOrderId !== null}
        onClose={() => setSelectedOrderId(null)}
      />
    </section>
  );
}