import {
  AlertCircle,
  PackagePlus,
  X,
} from "lucide-react";
import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  createAdminProductVariant,
  type InventoryProduct,
} from "../../../services/admin-inventory.service";

interface AddInventoryVariantModalProps {
  isOpen: boolean;
  product: InventoryProduct | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export default function AddInventoryVariantModal({
  isOpen,
  product,
  onClose,
  onSuccess,
}: AddInventoryVariantModalProps) {
  const [size, setSize] = useState("");
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [stock, setStock] = useState("0");
  const [reservedStock, setReservedStock] =
    useState("0");
  const [
    lowStockThreshold,
    setLowStockThreshold,
  ] = useState("5");
  const [costPrice, setCostPrice] = useState("");
  const [weightGrams, setWeightGrams] =
    useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isDefault, setIsDefault] =
    useState(false);
  const [isActive, setIsActive] = useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setSize("");
    setSku("");
    setBarcode("");
    setStock("0");
    setReservedStock("0");
    setLowStockThreshold("5");
    setCostPrice("");
    setWeightGrams("");
    setSortOrder("0");
    setIsDefault(false);
    setIsActive(true);
    setErrorMessage("");
    setIsSubmitting(false);
  }, [isOpen, product?.id]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key === "Escape" &&
        !isSubmitting
      ) {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen || !product) {
    return null;
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setErrorMessage("");

    const trimmedSize = size.trim();
    const trimmedSku = sku.trim();
    const trimmedBarcode = barcode.trim();

    const parsedStock = Number(stock);
    const parsedReservedStock =
      Number(reservedStock);
    const parsedThreshold = Number(
      lowStockThreshold,
    );
    const parsedSortOrder = Number(sortOrder);

    if (!trimmedSize) {
      setErrorMessage("Variant size is required.");
      return;
    }

    if (!trimmedSku) {
      setErrorMessage("Variant SKU is required.");
      return;
    }

    if (
      !Number.isInteger(parsedStock) ||
      parsedStock < 0
    ) {
      setErrorMessage(
        "Stock must be a whole number of 0 or more.",
      );
      return;
    }

    if (
      !Number.isInteger(parsedReservedStock) ||
      parsedReservedStock < 0
    ) {
      setErrorMessage(
        "Reserved stock must be a whole number of 0 or more.",
      );
      return;
    }

    if (parsedReservedStock > parsedStock) {
      setErrorMessage(
        "Reserved stock cannot exceed total stock.",
      );
      return;
    }

    if (
      !Number.isInteger(parsedThreshold) ||
      parsedThreshold < 0
    ) {
      setErrorMessage(
        "Low-stock threshold must be a whole number of 0 or more.",
      );
      return;
    }

    if (
      !Number.isInteger(parsedSortOrder) ||
      parsedSortOrder < 0
    ) {
      setErrorMessage(
        "Sort order must be a whole number of 0 or more.",
      );
      return;
    }

    const parsedCostPrice =
      costPrice.trim() === ""
        ? undefined
        : Number(costPrice);

    if (
      parsedCostPrice !== undefined &&
      (!Number.isFinite(parsedCostPrice) ||
        parsedCostPrice < 0)
    ) {
      setErrorMessage(
        "Cost price must be 0 or more.",
      );
      return;
    }

    const parsedWeight =
      weightGrams.trim() === ""
        ? undefined
        : Number(weightGrams);

    if (
      parsedWeight !== undefined &&
      (!Number.isInteger(parsedWeight) ||
        parsedWeight < 0)
    ) {
      setErrorMessage(
        "Weight must be a whole number of 0 or more.",
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const response =
        await createAdminProductVariant(
          product.id,
          {
            size: trimmedSize,
            sku: trimmedSku,
            barcode:
              trimmedBarcode || undefined,
            stock: parsedStock,
            reservedStock:
              parsedReservedStock,
            lowStockThreshold:
              parsedThreshold,
            costPrice: parsedCostPrice,
            weightGrams: parsedWeight,
            isDefault,
            isActive,
            sortOrder: parsedSortOrder,
          },
        );

      onSuccess(
        response.message ||
          "Product variant created successfully.",
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to create product variant.",
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
        aria-labelledby="add-variant-title"
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-[#E2D8C7] bg-white shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#EEE7DC] bg-white px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B38E49]">
              Inventory Management
            </p>

            <h2
              id="add-variant-title"
              className="mt-2 font-serif text-3xl text-[#0F4C3A]"
            >
              Add Product Variant
            </h2>

            <p className="mt-2 text-sm text-[#6D746F]">
              Create a size-level inventory
              variant for {product.name}.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Close add variant modal"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#DDD2C0] text-[#5E6964] transition hover:bg-[#F8F5F0] disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-6">
            {errorMessage && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0"
                />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-[#263D35]">
                  Size *
                </span>

                <input
                  type="text"
                  value={size}
                  onChange={(event) =>
                    setSize(event.target.value)
                  }
                  placeholder="Example: M"
                  autoFocus
                  disabled={isSubmitting}
                  className="mt-2 w-full rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] px-4 py-3 text-sm outline-none focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-[#263D35]">
                  Variant SKU *
                </span>

                <input
                  type="text"
                  value={sku}
                  onChange={(event) =>
                    setSku(
                      event.target.value.toUpperCase(),
                    )
                  }
                  placeholder="TEST-KURTI-M"
                  disabled={isSubmitting}
                  className="mt-2 w-full rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] px-4 py-3 text-sm outline-none focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-[#263D35]">
                  Barcode
                </span>

                <input
                  type="text"
                  value={barcode}
                  onChange={(event) =>
                    setBarcode(event.target.value)
                  }
                  placeholder="Optional barcode"
                  disabled={isSubmitting}
                  className="mt-2 w-full rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] px-4 py-3 text-sm outline-none focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-[#263D35]">
                  Initial stock *
                </span>

                <input
                  type="number"
                  min={0}
                  step={1}
                  value={stock}
                  onChange={(event) =>
                    setStock(event.target.value)
                  }
                  disabled={isSubmitting}
                  className="mt-2 w-full rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] px-4 py-3 text-sm outline-none focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-[#263D35]">
                  Reserved stock *
                </span>

                <input
                  type="number"
                  min={0}
                  step={1}
                  value={reservedStock}
                  onChange={(event) =>
                    setReservedStock(
                      event.target.value,
                    )
                  }
                  disabled={isSubmitting}
                  className="mt-2 w-full rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] px-4 py-3 text-sm outline-none focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-[#263D35]">
                  Low-stock threshold *
                </span>

                <input
                  type="number"
                  min={0}
                  step={1}
                  value={lowStockThreshold}
                  onChange={(event) =>
                    setLowStockThreshold(
                      event.target.value,
                    )
                  }
                  disabled={isSubmitting}
                  className="mt-2 w-full rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] px-4 py-3 text-sm outline-none focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-[#263D35]">
                  Cost price
                </span>

                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={costPrice}
                  onChange={(event) =>
                    setCostPrice(event.target.value)
                  }
                  placeholder="Optional"
                  disabled={isSubmitting}
                  className="mt-2 w-full rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] px-4 py-3 text-sm outline-none focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-[#263D35]">
                  Weight in grams
                </span>

                <input
                  type="number"
                  min={0}
                  step={1}
                  value={weightGrams}
                  onChange={(event) =>
                    setWeightGrams(
                      event.target.value,
                    )
                  }
                  placeholder="Optional"
                  disabled={isSubmitting}
                  className="mt-2 w-full rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] px-4 py-3 text-sm outline-none focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-[#263D35]">
                  Sort order
                </span>

                <input
                  type="number"
                  min={0}
                  step={1}
                  value={sortOrder}
                  onChange={(event) =>
                    setSortOrder(
                      event.target.value,
                    )
                  }
                  disabled={isSubmitting}
                  className="mt-2 w-full rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] px-4 py-3 text-sm outline-none focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-[#E2D8C7] bg-[#FCFAF7] p-4">
                <div>
                  <p className="text-sm font-semibold text-[#263D35]">
                    Default variant
                  </p>
                  <p className="mt-1 text-xs text-[#8A918D]">
                    Use this as the primary variant.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(event) =>
                    setIsDefault(
                      event.target.checked,
                    )
                  }
                  disabled={isSubmitting}
                  className="h-5 w-5 accent-[#0F4C3A]"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-[#E2D8C7] bg-[#FCFAF7] p-4">
                <div>
                  <p className="text-sm font-semibold text-[#263D35]">
                    Active variant
                  </p>
                  <p className="mt-1 text-xs text-[#8A918D]">
                    Allow inventory operations.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(event) =>
                    setIsActive(
                      event.target.checked,
                    )
                  }
                  disabled={isSubmitting}
                  className="h-5 w-5 accent-[#0F4C3A]"
                />
              </label>
            </div>
          </div>

          <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-[#EEE7DC] bg-[#FCFAF7] px-6 py-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-xl border border-[#DDD2C0] bg-white px-5 py-3 text-sm font-semibold text-[#0F4C3A] transition hover:bg-[#F8F5F0] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F4C3A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0B3B2F] disabled:opacity-50"
            >
              <PackagePlus size={17} />

              {isSubmitting
                ? "Creating..."
                : "Create Variant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}