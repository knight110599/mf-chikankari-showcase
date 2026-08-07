import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Package,
  Phone,
  Printer,
  ShoppingBag,
  Truck,
  UserRound,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getAdminOrderById,
  type AdminOrder,
  type AdminOrderItem,
  type OrderStatus,
  type PaymentStatus,
} from "../../../services/admin-order.service";

interface OrderDetailsModalProps {
  orderId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

interface TimelineStep {
  key: Exclude<OrderStatus, "CANCELLED">;
  label: string;
  description: string;
  date: string | null;
}

const ORDER_STATUS_SEQUENCE: Array<
  Exclude<OrderStatus, "CANCELLED">
> = [
  "PENDING_CONFIRMATION",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

function formatLabel(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() + part.slice(1),
    )
    .join(" ");
}

function formatCurrency(
  value: string | number,
): string {
  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return "N/A";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(
  value: string | null | undefined,
): string {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatDateOnly(
  value: string | null | undefined,
): string {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(date);
}

function getOrderStatusClasses(
  status: OrderStatus,
): string {
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
): string {
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

function getProductImage(
  item: AdminOrderItem,
): string | null {
  if (
    typeof item.productImage !== "string" ||
    item.productImage.trim().length === 0
  ) {
    return null;
  }

  return item.productImage;
}

function getFullName(order: AdminOrder): string {
  return [
    order.customerFirstName,
    order.customerLastName,
  ]
    .filter(Boolean)
    .join(" ");
}

function getFullAddress(order: AdminOrder): string[] {
  return [
    order.addressLine1,
    order.addressLine2,
    `${order.city}, ${order.state} ${order.postalCode}`,
    order.country,
  ].filter(
    (value): value is string =>
      typeof value === "string" &&
      value.trim().length > 0,
  );
}

function escapeHtml(
  value: string | number | null | undefined,
): string {
  const text = String(value ?? "");

  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function openPrintWindow(
  title: string,
  bodyContent: string,
): void {
  const printWindow = window.open(
    "",
    "_blank",
    "width=1000,height=800",
  );

  if (!printWindow) {
    throw new Error(
      "Print window was blocked. Please allow pop-ups and try again.",
    );
  }

  printWindow.document.open();
  printWindow.document.write(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>${escapeHtml(title)}</title>

        <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 32px;
            color: #1f2f29;
            background: #ffffff;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 13px;
            line-height: 1.5;
          }

          .document {
            width: 100%;
            max-width: 900px;
            margin: 0 auto;
          }

          .header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 32px;
            padding-bottom: 22px;
            border-bottom: 2px solid #0f4c3a;
          }

          .brand {
            margin: 0;
            color: #0f4c3a;
            font-family: Georgia, "Times New Roman", serif;
            font-size: 30px;
            font-weight: 700;
          }

          .document-title {
            margin: 4px 0 0;
            color: #b38e49;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.16em;
            text-transform: uppercase;
          }

          .text-right {
            text-align: right;
          }

          .muted {
            color: #6d746f;
          }

          .strong {
            color: #1f2f29;
            font-weight: 700;
          }

          .section {
            margin-top: 24px;
          }

          .section-title {
            margin: 0 0 10px;
            color: #0f4c3a;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
          }

          .grid-two {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }

          .card {
            padding: 16px;
            border: 1px solid #ddd2c0;
            border-radius: 10px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th {
            padding: 11px 10px;
            color: #52615b;
            background: #f8f5f0;
            border: 1px solid #ddd2c0;
            font-size: 11px;
            letter-spacing: 0.08em;
            text-align: left;
            text-transform: uppercase;
          }

          td {
            padding: 11px 10px;
            border: 1px solid #e7dfd2;
            vertical-align: top;
          }

          .number {
            text-align: right;
            white-space: nowrap;
          }

          .summary {
            width: 340px;
            margin-top: 20px;
            margin-left: auto;
          }

          .summary-row {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            padding: 7px 0;
          }

          .summary-total {
            margin-top: 5px;
            padding-top: 12px;
            border-top: 2px solid #0f4c3a;
            color: #0f4c3a;
            font-size: 16px;
            font-weight: 700;
          }

          .notes {
            min-height: 70px;
            padding: 14px;
            border: 1px solid #ddd2c0;
            border-radius: 8px;
            white-space: pre-wrap;
          }

          .checklist {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 14px;
            margin-top: 12px;
          }

          .check-item {
            padding: 15px;
            border: 1px solid #ddd2c0;
            border-radius: 8px;
            font-weight: 700;
          }

          .footer {
            margin-top: 38px;
            padding-top: 16px;
            color: #6d746f;
            border-top: 1px solid #ddd2c0;
            font-size: 11px;
            text-align: center;
          }

          @media print {
            body {
              padding: 0;
            }

            @page {
              size: A4;
              margin: 14mm;
            }
          }
        </style>
      </head>

      <body>
        ${bodyContent}

        <script>
          window.addEventListener("load", function () {
            window.focus();
            window.print();
          });

          window.addEventListener("afterprint", function () {
            window.close();
          });
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

function printInvoice(order: AdminOrder): void {
  const items = order.items ?? [];

  const itemRows = items
    .map(
      (item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>
            <div class="strong">
              ${escapeHtml(item.productName)}
            </div>
            <div class="muted">
              SKU: ${escapeHtml(item.productSku || "N/A")}
            </div>
            <div class="muted">
              Size: ${escapeHtml(item.selectedSize || "N/A")}
            </div>
          </td>
          <td class="number">
            ${escapeHtml(item.quantity)}
          </td>
          <td class="number">
            ${escapeHtml(formatCurrency(item.unitPrice))}
          </td>
          <td class="number">
            ${escapeHtml(formatCurrency(item.lineTotal))}
          </td>
        </tr>
      `,
    )
    .join("");

  const address = getFullAddress(order)
    .map((line) => escapeHtml(line))
    .join("<br />");

  openPrintWindow(
    `Invoice - ${order.orderNumber}`,
    `
      <main class="document">
        <header class="header">
          <div>
            <h1 class="brand">MF Chikankari</h1>
            <p class="document-title">Customer Invoice</p>
          </div>

          <div class="text-right">
            <div class="strong">
              Invoice: ${escapeHtml(order.orderNumber)}
            </div>
            <div class="muted">
              Order Date:
              ${escapeHtml(formatDateOnly(order.createdAt))}
            </div>
            <div class="muted">
              Payment:
              ${escapeHtml(formatLabel(order.paymentStatus))}
            </div>
          </div>
        </header>

        <section class="section grid-two">
          <div class="card">
            <h2 class="section-title">Billed To</h2>
            <div class="strong">
              ${escapeHtml(getFullName(order))}
            </div>
            <div>${escapeHtml(order.customerEmail)}</div>
            <div>${escapeHtml(order.customerPhone)}</div>
          </div>

          <div class="card">
            <h2 class="section-title">
              Shipping Address
            </h2>
            <div>${address}</div>
          </div>
        </section>

        <section class="section">
          <h2 class="section-title">Order Items</h2>

          <table>
            <thead>
              <tr>
                <th style="width: 52px;">#</th>
                <th>Product</th>
                <th class="number">Quantity</th>
                <th class="number">Unit Price</th>
                <th class="number">Amount</th>
              </tr>
            </thead>

            <tbody>
              ${
                itemRows ||
                `
                  <tr>
                    <td colspan="5">
                      No order items available.
                    </td>
                  </tr>
                `
              }
            </tbody>
          </table>

          <div class="summary">
            <div class="summary-row">
              <span>Subtotal</span>
              <span class="strong">
                ${escapeHtml(formatCurrency(order.subtotal))}
              </span>
            </div>

            <div class="summary-row">
              <span>Delivery Charge</span>
              <span class="strong">
                ${escapeHtml(
                  formatCurrency(order.deliveryCharge),
                )}
              </span>
            </div>

            <div class="summary-row summary-total">
              <span>Total</span>
              <span>
                ${escapeHtml(formatCurrency(order.total))}
              </span>
            </div>
          </div>
        </section>

        ${
          order.orderNotes
            ? `
              <section class="section">
                <h2 class="section-title">
                  Order Notes
                </h2>

                <div class="notes">
                  ${escapeHtml(order.orderNotes)}
                </div>
              </section>
            `
            : ""
        }

        <footer class="footer">
          Thank you for shopping with MF Chikankari.
          This is a computer-generated invoice.
        </footer>
      </main>
    `,
  );
}

function printShippingSlip(
  order: AdminOrder,
): void {
  const items = order.items ?? [];

  const itemRows = items
    .map(
      (item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>
            <div class="strong">
              ${escapeHtml(item.productName)}
            </div>
            <div class="muted">
              SKU: ${escapeHtml(item.productSku || "N/A")}
            </div>
          </td>
          <td>
            ${escapeHtml(item.selectedSize || "N/A")}
          </td>
          <td class="number">
            ${escapeHtml(item.quantity)}
          </td>
        </tr>
      `,
    )
    .join("");

  const address = getFullAddress(order)
    .map((line) => escapeHtml(line))
    .join("<br />");

  const totalQuantity = items.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  openPrintWindow(
    `Shipping Slip - ${order.orderNumber}`,
    `
      <main class="document">
        <header class="header">
          <div>
            <h1 class="brand">MF Chikankari</h1>
            <p class="document-title">
              Shipping / Packing Slip
            </p>
          </div>

          <div class="text-right">
            <div class="strong">
              Order: ${escapeHtml(order.orderNumber)}
            </div>
            <div class="muted">
              Date:
              ${escapeHtml(formatDateOnly(order.createdAt))}
            </div>
            <div class="muted">
              Source:
              ${escapeHtml(formatLabel(order.source))}
            </div>
          </div>
        </header>

        <section class="section grid-two">
          <div class="card">
            <h2 class="section-title">Ship To</h2>
            <div class="strong">
              ${escapeHtml(getFullName(order))}
            </div>
            <div>${escapeHtml(order.customerPhone)}</div>
            <div style="margin-top: 8px;">
              ${address}
            </div>
          </div>

          <div class="card">
            <h2 class="section-title">
              Package Information
            </h2>

            <div>
              Line Items:
              <span class="strong">${items.length}</span>
            </div>

            <div>
              Total Quantity:
              <span class="strong">
                ${totalQuantity}
              </span>
            </div>

            <div>
              Order Status:
              <span class="strong">
                ${escapeHtml(formatLabel(order.status))}
              </span>
            </div>

            <div>
              Payment:
              <span class="strong">
                ${escapeHtml(
                  formatLabel(order.paymentStatus),
                )}
              </span>
            </div>
          </div>
        </section>

        <section class="section">
          <h2 class="section-title">Items to Pack</h2>

          <table>
            <thead>
              <tr>
                <th style="width: 52px;">#</th>
                <th>Product</th>
                <th style="width: 120px;">Size</th>
                <th
                  class="number"
                  style="width: 100px;"
                >
                  Quantity
                </th>
              </tr>
            </thead>

            <tbody>
              ${
                itemRows ||
                `
                  <tr>
                    <td colspan="4">
                      No order items available.
                    </td>
                  </tr>
                `
              }
            </tbody>
          </table>
        </section>

        ${
          order.orderNotes
            ? `
              <section class="section">
                <h2 class="section-title">
                  Special Instructions
                </h2>

                <div class="notes">
                  ${escapeHtml(order.orderNotes)}
                </div>
              </section>
            `
            : ""
        }

        <section class="section">
          <h2 class="section-title">
            Warehouse Checklist
          </h2>

          <div class="checklist">
            <div class="check-item">
              □ QC Checked
            </div>

            <div class="check-item">
              □ Order Packed
            </div>

            <div class="check-item">
              □ Courier Handover
            </div>
          </div>
        </section>

        <section class="section grid-two">
          <div class="card">
            Packed By:
            <br /><br />
            ______________________________
          </div>

          <div class="card">
            Courier / AWB:
            <br /><br />
            ______________________________
          </div>
        </section>

        <footer class="footer">
          Internal fulfilment document. Product prices are
          intentionally excluded.
        </footer>
      </main>
    `,
  );
}

export default function OrderDetailsModal({
  orderId,
  isOpen,
  onClose,
}: OrderDetailsModalProps) {
  const [order, setOrder] =
    useState<AdminOrder | null>(null);
  const [isLoading, setIsLoading] =
    useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");
  const [printError, setPrintError] = useState("");
const fetchOrder = useCallback(async () => {
  if (!orderId) {
    return null;
  }

  const response = await getAdminOrderById(orderId);
  return response.data;
}, [orderId]);
  const loadOrder = useCallback(async () => {
  setIsLoading(true);
  setErrorMessage("");
  setPrintError("");

  try {
    const orderData = await fetchOrder();

    if (orderData) {
      setOrder(orderData);
    }
  } catch (error) {
    setOrder(null);
    setErrorMessage(
      error instanceof Error
        ? error.message
        : "Unable to load order details.",
    );
  } finally {
    setIsLoading(false);
  }
}, [fetchOrder]);

  useEffect(() => {
  if (!isOpen || !orderId) {
    return;
  }

  let isMounted = true;

  void fetchOrder()
    .then((orderData) => {
      if (isMounted && orderData) {
        setOrder(orderData);
      }
    })
    .catch((error) => {
      if (isMounted) {
        setOrder(null);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load order details.",
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
}, [isOpen, orderId, fetchOrder]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        originalOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [isOpen, onClose]);

  const timelineSteps =
    useMemo<TimelineStep[]>(() => {
      if (!order) {
        return [];
      }

      return [
        {
          key: "PENDING_CONFIRMATION",
          label: "Order Placed",
          description:
            "The order was successfully created.",
          date: order.createdAt,
        },
        {
          key: "CONFIRMED",
          label: "Confirmed",
          description:
            "The order was confirmed for fulfilment.",
          date: order.confirmedAt,
        },
        {
          key: "PROCESSING",
          label: "Processing",
          description:
            "The order is being prepared and packed.",
          date:
            order.status === "PROCESSING" ||
            order.status === "SHIPPED" ||
            order.status === "DELIVERED"
              ? order.updatedAt
              : null,
        },
        {
          key: "SHIPPED",
          label: "Shipped",
          description:
            "The order was handed over for delivery.",
          date: order.shippedAt,
        },
        {
          key: "DELIVERED",
          label: "Delivered",
          description:
            "The order was delivered to the customer.",
          date: order.deliveredAt,
        },
      ];
    }, [order]);

  const currentStatusIndex = order
    ? ORDER_STATUS_SEQUENCE.indexOf(
        order.status === "CANCELLED"
          ? "PENDING_CONFIRMATION"
          : order.status,
      )
    : -1;

  const totalQuantity = useMemo(() => {
    return (order?.items ?? []).reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
  }, [order]);

  const handlePrintInvoice = () => {
    if (!order) {
      return;
    }

    try {
      setPrintError("");
      printInvoice(order);
    } catch (error) {
      setPrintError(
        error instanceof Error
          ? error.message
          : "Unable to print invoice.",
      );
    }
  };

  const handlePrintShippingSlip = () => {
    if (!order) {
      return;
    }

    try {
      setPrintError("");
      printShippingSlip(order);
    } catch (error) {
      setPrintError(
        error instanceof Error
          ? error.message
          : "Unable to print shipping slip.",
      );
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-3 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-details-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-[28px] border border-[#E2D8C7] bg-[#FCFAF7] shadow-2xl">
        <header className="flex shrink-0 items-start justify-between gap-5 border-b border-[#E2D8C7] bg-white px-5 py-5 sm:px-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B38E49]">
              Order Management
            </p>

            <h2
              id="order-details-title"
              className="mt-2 font-serif text-3xl text-[#0F4C3A]"
            >
              {order?.orderNumber ??
                "Order Details"}
            </h2>

            {order && (
              <p className="mt-2 text-sm text-[#78817C]">
                Created {formatDate(order.createdAt)}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#DDD2C0] bg-white text-[#59645F] transition hover:bg-[#F8F5F0] hover:text-[#0F4C3A]"
            aria-label="Close order details"
          >
            <X size={19} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex min-h-[460px] flex-col items-center justify-center px-6 text-center">
              <Loader2
                size={34}
                className="animate-spin text-[#0F4C3A]"
              />

              <p className="mt-4 font-semibold text-[#263D35]">
                Loading order details...
              </p>
            </div>
          ) : errorMessage ? (
            <div className="flex min-h-[460px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-700">
                <AlertCircle size={26} />
              </div>

              <p className="mt-4 font-semibold text-[#263D35]">
                Could not load this order
              </p>

              <p className="mt-2 max-w-md text-sm leading-6 text-red-700">
                {errorMessage}
              </p>

              <button
                type="button"
                onClick={() => void loadOrder()}
                className="mt-5 rounded-xl bg-[#0F4C3A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B3B2F]"
              >
                Try Again
              </button>
            </div>
          ) : order ? (
            <div className="space-y-6 p-5 sm:p-7">
              <section className="flex flex-col gap-4 rounded-[22px] border border-[#E2D8C7] bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-3">
                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getOrderStatusClasses(
                      order.status,
                    )}`}
                  >
                    {formatLabel(order.status)}
                  </span>

                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getPaymentStatusClasses(
                      order.paymentStatus,
                    )}`}
                  >
                    {formatLabel(order.paymentStatus)}
                  </span>

                  <span className="inline-flex rounded-full bg-[#F4EFE7] px-3 py-1.5 text-xs font-semibold text-[#725F3E]">
                    {formatLabel(order.source)}
                  </span>
                </div>

                <div className="text-sm text-[#6D746F]">
                  Last updated{" "}
                  <span className="font-semibold text-[#263D35]">
                    {formatDate(order.updatedAt)}
                  </span>
                </div>
              </section>

              {order.status === "CANCELLED" && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                  <AlertCircle
                    size={19}
                    className="mt-0.5 shrink-0"
                  />

                  <div>
                    <p className="font-semibold">
                      This order was cancelled.
                    </p>

                    <p className="mt-1">
                      Cancellation date:{" "}
                      {formatDate(order.cancelledAt)}
                    </p>
                  </div>
                </div>
              )}

              {printError && (
                <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                  <AlertCircle size={18} />
                  {printError}
                </div>
              )}

              <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.75fr)]">
                <div className="space-y-6">
                  <section className="grid gap-5 md:grid-cols-2">
                    <div className="rounded-[22px] border border-[#E2D8C7] bg-white p-5 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF3F0] text-[#0F4C3A]">
                          <UserRound size={19} />
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A918D]">
                            Customer
                          </p>

                          <h3 className="mt-1 font-semibold text-[#263D35]">
                            {getFullName(order)}
                          </h3>
                        </div>
                      </div>

                      <div className="mt-5 space-y-3 text-sm">
                        <div className="flex items-start gap-3 text-[#5E6964]">
                          <Mail
                            size={17}
                            className="mt-0.5 shrink-0 text-[#B38E49]"
                          />
                          <span className="break-all">
                            {order.customerEmail}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-[#5E6964]">
                          <Phone
                            size={17}
                            className="shrink-0 text-[#B38E49]"
                          />
                          <span>
                            {order.customerPhone}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[22px] border border-[#E2D8C7] bg-white p-5 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F0E4] text-[#B38E49]">
                          <MapPin size={19} />
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A918D]">
                            Shipping Address
                          </p>

                          <h3 className="mt-1 font-semibold text-[#263D35]">
                            Delivery destination
                          </h3>
                        </div>
                      </div>

                      <address className="mt-5 space-y-1 text-sm not-italic leading-6 text-[#5E6964]">
                        {getFullAddress(order).map(
                          (line) => (
                            <p key={line}>{line}</p>
                          ),
                        )}
                      </address>
                    </div>
                  </section>

                  <section className="overflow-hidden rounded-[22px] border border-[#E2D8C7] bg-white shadow-sm">
                    <div className="flex flex-col gap-3 border-b border-[#EEE7DC] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A918D]">
                          Products
                        </p>

                        <h3 className="mt-1 font-serif text-2xl text-[#0F4C3A]">
                          Order Items
                        </h3>
                      </div>

                      <div className="flex gap-3 text-xs font-semibold text-[#6D746F]">
                        <span className="rounded-full bg-[#F8F5F0] px-3 py-1.5">
                          {order.items?.length ?? 0} line
                          item
                          {(order.items?.length ?? 0) === 1
                            ? ""
                            : "s"}
                        </span>

                        <span className="rounded-full bg-[#F8F5F0] px-3 py-1.5">
                          {totalQuantity} unit
                          {totalQuantity === 1 ? "" : "s"}
                        </span>
                      </div>
                    </div>

                    {order.items &&
                    order.items.length > 0 ? (
                      <div className="divide-y divide-[#EEE7DC]">
                        {order.items.map((item) => {
                          const image =
                            getProductImage(item);

                          return (
                            <article
                              key={item.id}
                              className="grid gap-4 px-5 py-5 sm:grid-cols-[82px_minmax(0,1fr)_auto] sm:items-center"
                            >
                              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-[#E2D8C7] bg-[#F8F5F0]">
                                {image ? (
                                  <img
                                    src={image}
                                    alt={item.productName}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <Package
                                    size={25}
                                    className="text-[#9AA09C]"
                                  />
                                )}
                              </div>

                              <div>
                                <h4 className="font-semibold text-[#263D35]">
                                  {item.productName}
                                </h4>

                                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#7B837E]">
                                  <span>
                                    SKU:{" "}
                                    <strong className="text-[#4D5A54]">
                                      {item.productSku ||
                                        "N/A"}
                                    </strong>
                                  </span>

                                  <span>
                                    Size:{" "}
                                    <strong className="text-[#4D5A54]">
                                      {item.selectedSize ||
                                        "N/A"}
                                    </strong>
                                  </span>

                                  <span>
                                    Quantity:{" "}
                                    <strong className="text-[#4D5A54]">
                                      {item.quantity}
                                    </strong>
                                  </span>
                                </div>

                                <p className="mt-2 text-xs text-[#8A918D]">
                                  {formatCurrency(
                                    item.unitPrice,
                                  )}{" "}
                                  per unit
                                </p>
                              </div>

                              <div className="text-left sm:text-right">
                                <p className="text-xs uppercase tracking-[0.12em] text-[#8A918D]">
                                  Line Total
                                </p>

                                <p className="mt-1 text-base font-semibold text-[#0F4C3A]">
                                  {formatCurrency(
                                    item.lineTotal,
                                  )}
                                </p>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="px-6 py-12 text-center">
                        <ShoppingBag
                          size={28}
                          className="mx-auto text-[#9AA09C]"
                        />

                        <p className="mt-3 text-sm text-[#7B837E]">
                          No items are available for this
                          order.
                        </p>
                      </div>
                    )}
                  </section>

                  <section className="rounded-[22px] border border-[#E2D8C7] bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F0E4] text-[#B38E49]">
                        <FileText size={19} />
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A918D]">
                          Customer Instructions
                        </p>

                        <h3 className="mt-1 font-semibold text-[#263D35]">
                          Order Notes
                        </h3>
                      </div>
                    </div>

                    <div className="mt-4 min-h-20 rounded-2xl bg-[#FCFAF7] px-4 py-4 text-sm leading-6 text-[#5E6964]">
                      {order.orderNotes?.trim() ||
                        "No special instructions were provided."}
                    </div>
                  </section>
                </div>

                <aside className="space-y-6">
                  <section className="rounded-[22px] border border-[#E2D8C7] bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF3F0] text-[#0F4C3A]">
                        <CreditCard size={19} />
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A918D]">
                          Payment
                        </p>

                        <h3 className="mt-1 font-serif text-2xl text-[#0F4C3A]">
                          Order Summary
                        </h3>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3 text-sm">
                      <div className="flex items-center justify-between gap-4 text-[#65706A]">
                        <span>Subtotal</span>

                        <span className="font-semibold text-[#263D35]">
                          {formatCurrency(order.subtotal)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4 text-[#65706A]">
                        <span>Delivery Charge</span>

                        <span className="font-semibold text-[#263D35]">
                          {formatCurrency(
                            order.deliveryCharge,
                          )}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-4 border-t border-[#E2D8C7] pt-4">
                        <span className="font-semibold text-[#263D35]">
                          Total
                        </span>

                        <span className="text-xl font-semibold text-[#0F4C3A]">
                          {formatCurrency(order.total)}
                        </span>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-[22px] border border-[#E2D8C7] bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F0E4] text-[#B38E49]">
                        <Clock3 size={19} />
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A918D]">
                          Fulfilment
                        </p>

                        <h3 className="mt-1 font-serif text-2xl text-[#0F4C3A]">
                          Order Timeline
                        </h3>
                      </div>
                    </div>

                    <div className="mt-6">
                      {timelineSteps.map(
                        (step, index) => {
                          const isCompleted =
                            order.status !==
                              "CANCELLED" &&
                            index <=
                              currentStatusIndex;

                          const isCurrent =
                            order.status !==
                              "CANCELLED" &&
                            index ===
                              currentStatusIndex;

                          const isLast =
                            index ===
                            timelineSteps.length - 1;

                          return (
                            <div
                              key={step.key}
                              className="relative flex gap-4"
                            >
                              {!isLast && (
                                <div
                                  className={`absolute left-[15px] top-8 h-[calc(100%-10px)] w-px ${
                                    isCompleted &&
                                    index <
                                      currentStatusIndex
                                      ? "bg-[#0F4C3A]"
                                      : "bg-[#DDD2C0]"
                                  }`}
                                />
                              )}

                              <div
                                className={`relative z-10 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                                  isCompleted
                                    ? "border-[#0F4C3A] bg-[#0F4C3A] text-white"
                                    : "border-[#DDD2C0] bg-white text-[#A0A6A2]"
                                }`}
                              >
                                {isCompleted ? (
                                  <CheckCircle2
                                    size={17}
                                  />
                                ) : (
                                  <span className="h-2 w-2 rounded-full bg-current" />
                                )}
                              </div>

                              <div
                                className={`min-w-0 ${
                                  isLast
                                    ? "pb-0"
                                    : "pb-7"
                                }`}
                              >
                                <div className="flex flex-wrap items-center gap-2">
                                  <p
                                    className={`text-sm font-semibold ${
                                      isCompleted
                                        ? "text-[#0F4C3A]"
                                        : "text-[#7B837E]"
                                    }`}
                                  >
                                    {step.label}
                                  </p>

                                  {isCurrent && (
                                    <span className="rounded-full bg-[#F7F0E4] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9A7433]">
                                      Current
                                    </span>
                                  )}
                                </div>

                                <p className="mt-1 text-xs leading-5 text-[#8A918D]">
                                  {step.description}
                                </p>

                                {step.date && (
                                  <p className="mt-1 text-xs font-medium text-[#5E6964]">
                                    {formatDate(step.date)}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </section>

                  <section className="rounded-[22px] border border-[#E2D8C7] bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                      <CalendarDays
                        size={18}
                        className="text-[#B38E49]"
                      />

                      <h3 className="font-semibold text-[#263D35]">
                        Important Dates
                      </h3>
                    </div>

                    <dl className="mt-4 space-y-3 text-sm">
                      <div className="flex justify-between gap-4">
                        <dt className="text-[#7B837E]">
                          Created
                        </dt>

                        <dd className="text-right font-medium text-[#263D35]">
                          {formatDate(order.createdAt)}
                        </dd>
                      </div>

                      <div className="flex justify-between gap-4">
                        <dt className="text-[#7B837E]">
                          Confirmed
                        </dt>

                        <dd className="text-right font-medium text-[#263D35]">
                          {formatDate(order.confirmedAt)}
                        </dd>
                      </div>

                      <div className="flex justify-between gap-4">
                        <dt className="text-[#7B837E]">
                          Shipped
                        </dt>

                        <dd className="text-right font-medium text-[#263D35]">
                          {formatDate(order.shippedAt)}
                        </dd>
                      </div>

                      <div className="flex justify-between gap-4">
                        <dt className="text-[#7B837E]">
                          Delivered
                        </dt>

                        <dd className="text-right font-medium text-[#263D35]">
                          {formatDate(order.deliveredAt)}
                        </dd>
                      </div>
                    </dl>
                  </section>
                </aside>
              </div>
            </div>
          ) : null}
        </div>

        <footer className="flex shrink-0 flex-col gap-3 border-t border-[#E2D8C7] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <p className="text-xs leading-5 text-[#7B837E]">
            Invoice contains prices. Shipping slip excludes
            all product prices.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-xl border border-[#DDD2C0] bg-white px-4 py-2.5 text-sm font-semibold text-[#4D5A54] transition hover:bg-[#F8F5F0]"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handlePrintShippingSlip}
              disabled={!order || isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0F4C3A] bg-white px-4 py-2.5 text-sm font-semibold text-[#0F4C3A] transition hover:bg-[#EEF3F0] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Truck size={17} />
              Print Shipping Slip
            </button>

            <button
              type="button"
              onClick={handlePrintInvoice}
              disabled={!order || isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F4C3A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B3B2F] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Printer size={17} />
              Print Invoice
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}