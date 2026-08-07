import {
  AlertCircle,
  PackagePlus,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  restockAdminProductVariant,
  type InventoryVariant,
} from "../../../services/admin-inventory.service";

interface RestockInventoryModalProps {
  isOpen: boolean;
  variant: InventoryVariant | null;
  onClose: () => void;
  onSuccess: (
    updatedVariant: InventoryVariant,
    message: string,
  ) => void;
}

export default function RestockInventoryModal({
  isOpen,
  variant,
  onClose,
  onSuccess,
}: RestockInventoryModalProps) {
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);



  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        !isSubmitting
      ) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [isOpen, isSubmitting, onClose]);

  const parsedQuantity = useMemo(() => {
    const value = Number(quantity);

    return Number.isInteger(value) ? value : null;
  }, [quantity]);

  const newStock = useMemo(() => {
    if (!variant || parsedQuantity === null) {
      return variant?.stock ?? 0;
    }

    return variant.stock + parsedQuantity;
  }, [parsedQuantity, variant]);

  if (!isOpen || !variant) {
    return null;
  }

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    onClose();
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setErrorMessage("");

    if (!variant.isActive) {
      setErrorMessage(
        "Inactive variants cannot be restocked.",
      );
      return;
    }

    if (
      parsedQuantity === null ||
      parsedQuantity <= 0
    ) {
      setErrorMessage(
        "Enter a positive whole-number quantity.",
      );
      return;
    }

    const trimmedNote = note.trim();

    try {
      setIsSubmitting(true);

      const response =
        await restockAdminProductVariant(
          variant.id,
          {
            quantity: parsedQuantity,
            note: trimmedNote || undefined,
          },
        );

      onSuccess(
        response.data,
        response.message ||
          `${variant.sku} restocked successfully.`,
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to restock this variant.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="restock-inventory-title"
        className="w-full max-w-lg overflow-hidden rounded-[28px] border border-[#E2D8C7] bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#EEE7DC] px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B38E49]">
              Inventory Action
            </p>

            <h2
              id="restock-inventory-title"
              className="mt-2 font-serif text-3xl text-[#0F4C3A]"
            >
              Restock Variant
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#6D746F]">
              Add new stock to this product variant.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Close restock modal"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#DDD2C0] text-[#5E6964] transition hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-6">
            <div className="rounded-2xl border border-[#E2D8C7] bg-[#FCFAF7] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EEF3F0] text-[#0F4C3A]">
                  <PackagePlus size={20} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#263D35]">
                    {variant.product?.name ||
                      "Product variant"}
                  </p>

                  <p className="mt-1 text-xs text-[#8A918D]">
                    Size: {variant.size} · SKU:{" "}
                    {variant.sku}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-white p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8A918D]">
                    Current
                  </p>
                  <p className="mt-1 text-lg font-semibold text-[#263D35]">
                    {variant.stock}
                  </p>
                </div>

                <div className="rounded-xl bg-white p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8A918D]">
                    Reserved
                  </p>
                  <p className="mt-1 text-lg font-semibold text-blue-700">
                    {variant.reservedStock}
                  </p>
                </div>

                <div className="rounded-xl bg-white p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8A918D]">
                    New Stock
                  </p>
                  <p className="mt-1 text-lg font-semibold text-emerald-700">
                    {newStock}
                  </p>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0"
                />
                <span>{errorMessage}</span>
              </div>
            )}

            {!variant.isActive && (
              <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0"
                />
                <span>
                  This variant is inactive and cannot be
                  restocked.
                </span>
              </div>
            )}

            <label className="block">
              <span className="text-sm font-semibold text-[#263D35]">
                Restock quantity
              </span>

              <input
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                value={quantity}
                onChange={(event) =>
                  setQuantity(event.target.value)
                }
                placeholder="Enter quantity"
                autoFocus
                disabled={
                  isSubmitting || !variant.isActive
                }
                className="mt-2 w-full rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] px-4 py-3 text-sm text-[#263D35] outline-none transition placeholder:text-[#9AA09C] focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <p className="mt-2 text-xs text-[#8A918D]">
                Enter the number of units being added.
              </p>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-[#263D35]">
                Note{" "}
                <span className="font-normal text-[#8A918D]">
                  (optional)
                </span>
              </span>

              <textarea
                value={note}
                onChange={(event) =>
                  setNote(event.target.value)
                }
                rows={4}
                maxLength={500}
                placeholder="Example: New stock received from supplier"
                disabled={
                  isSubmitting || !variant.isActive
                }
                className="mt-2 w-full resize-none rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] px-4 py-3 text-sm leading-6 text-[#263D35] outline-none transition placeholder:text-[#9AA09C] focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <div className="mt-2 flex justify-end">
                <span className="text-xs text-[#8A918D]">
                  {note.length}/500
                </span>
              </div>
            </label>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-[#EEE7DC] bg-[#FCFAF7] px-6 py-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-xl border border-[#DDD2C0] bg-white px-5 py-3 text-sm font-semibold text-[#0F4C3A] transition hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                isSubmitting ||
                !variant.isActive ||
                parsedQuantity === null ||
                parsedQuantity <= 0
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F4C3A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0B3B2F] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <PackagePlus size={17} />

              {isSubmitting
                ? "Restocking..."
                : "Confirm Restock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}