import {
  AlertCircle,
  History,
  RefreshCw,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getAdminProductInventoryHistory,
  type InventoryVariant,
  type StockMovement,
} from "../../../services/admin-inventory.service";

interface InventoryHistoryModalProps {
  isOpen: boolean;
  productId: string | null;
  variant: InventoryVariant | null;
  onClose: () => void;
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

function formatMovementType(type: string) {
  return type
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getAdminName(movement: StockMovement) {
  const firstName = movement.createdBy?.firstName?.trim() || "";
  const lastName = movement.createdBy?.lastName?.trim() || "";
  const fullName = `${firstName} ${lastName}`.trim();

  return (
    fullName ||
    movement.createdBy?.email ||
    "System"
  );
}

export default function InventoryHistoryModal({
  isOpen,
  productId,
  variant,
  onClose,
}: InventoryHistoryModalProps) {
  const [movements, setMovements] = useState<StockMovement[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadHistory = useCallback(async () => {
    if (!productId || !variant) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response =
        await getAdminProductInventoryHistory(productId);

      setMovements(
        response.data.filter(
          (movement) =>
            movement.variantId === variant.id,
        ),
      );
    } catch (error) {
      setMovements([]);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load inventory history.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [productId, variant]);

  useEffect(() => {
  if (!isOpen) {
    return;
  }

  const timeoutId = window.setTimeout(() => {
    void loadHistory();
  }, 0);

  return () => {
    window.clearTimeout(timeoutId);
  };
}, [isOpen, loadHistory]);

  const totalChange = useMemo(
    () =>
      movements.reduce(
        (total, movement) => total + movement.quantity,
        0,
      ),
    [movements],
  );

  if (!isOpen || !variant) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-[28px] border border-[#E2D8C7] bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-[#EEE7DC] px-6 py-5">
          <div>
            <div className="flex items-center gap-2 text-[#B38E49]">
              <History size={18} />

              <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                Inventory History
              </p>
            </div>

            <h2 className="mt-2 font-serif text-3xl text-[#0F4C3A]">
              {variant.sku}
            </h2>

            <p className="mt-1 text-sm text-[#7B837E]">
              Size {variant.size} · Current stock{" "}
              {variant.stock}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD2C0] text-[#5E6964] transition hover:bg-[#F8F5F0]"
            aria-label="Close inventory history"
          >
            <X size={19} />
          </button>
        </div>

        <div className="flex items-center justify-between border-b border-[#EEE7DC] bg-[#FCFAF7] px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A918D]">
              Total Records
            </p>

            <p className="mt-1 font-semibold text-[#0F4C3A]">
              {movements.length}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A918D]">
              Net Change
            </p>

            <p
              className={`mt-1 font-semibold ${
                totalChange > 0
                  ? "text-emerald-700"
                  : totalChange < 0
                    ? "text-red-700"
                    : "text-[#5E6964]"
              }`}
            >
              {totalChange > 0 ? "+" : ""}
              {totalChange}
            </p>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-auto">
          {errorMessage && (
            <div className="m-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              <AlertCircle size={19} />
              {errorMessage}
            </div>
          )}

          {isLoading ? (
            <div className="px-6 py-16 text-center text-sm text-[#7B837E]">
              <RefreshCw
                size={24}
                className="mx-auto mb-3 animate-spin text-[#0F4C3A]"
              />
              Loading inventory history...
            </div>
          ) : !errorMessage && movements.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF3F0] text-[#0F4C3A]">
                <History size={24} />
              </div>

              <p className="mt-4 font-semibold text-[#263D35]">
                No history found
              </p>

              <p className="mt-1 text-sm text-[#8A918D]">
                No stock movements are available for this
                variant.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">
                <thead className="sticky top-0 bg-[#F8F5F0]">
                  <tr className="text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#7B837E]">
                      Date
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#7B837E]">
                      Action
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#7B837E]">
                      Change
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#7B837E]">
                      Previous
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#7B837E]">
                      New Stock
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#7B837E]">
                      Note
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#7B837E]">
                      Updated By
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#EEE7DC]">
                  {movements.map((movement) => (
                    <tr
                      key={movement.id}
                      className="transition hover:bg-[#FCFAF7]"
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-[#5E6964]">
                        {formatDate(movement.createdAt)}
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-[#EEF3F0] px-3 py-1 text-xs font-semibold text-[#0F4C3A]">
                          {formatMovementType(movement.type)}
                        </span>
                      </td>

                      <td
                        className={`px-6 py-4 text-sm font-semibold ${
                          movement.quantity > 0
                            ? "text-emerald-700"
                            : movement.quantity < 0
                              ? "text-red-700"
                              : "text-[#5E6964]"
                        }`}
                      >
                        {movement.quantity > 0 ? "+" : ""}
                        {movement.quantity}
                      </td>

                      <td className="px-6 py-4 text-sm text-[#5E6964]">
                        {movement.previousStock}
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-[#263D35]">
                        {movement.newStock}
                      </td>

                      <td className="max-w-[260px] px-6 py-4 text-sm text-[#5E6964]">
                        {movement.note || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-[#5E6964]">
                        {getAdminName(movement)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-[#EEE7DC] px-6 py-4">
          <button
            type="button"
            onClick={() => void loadHistory()}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-[#DDD2C0] bg-white px-4 py-2.5 text-sm font-semibold text-[#0F4C3A] transition hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={isLoading ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#0F4C3A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B3B2F]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}