import {
  AlertCircle,
  Archive,
  Boxes,
  ChevronLeft,
  ChevronRight,
  CircleGauge,
  History,
  PackagePlus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  TriangleAlert,
  Warehouse,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getAdminInventory,
  type InventoryPagination,
  type InventoryProduct,
  type InventoryVariant,
} from "../../services/admin-inventory.service";

import RestockInventoryModal from "../../components/admin/inventory/RestockInventoryModal";
import AddInventoryVariantModal from "../../components/admin/inventory/AddInventoryVariantModal";
import AdjustInventoryStockModal from "../../components/admin/inventory/AdjustInventoryStockModal";
import InventoryHistoryModal from "../../components/admin/inventory/InventoryHistoryModal";

type InventoryFilter =
  | "all"
  | "low-stock"
  | "out-of-stock";

const EMPTY_PAGINATION: InventoryPagination = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
};

function getProductImage(product: InventoryProduct) {
  const image = product.images?.[0];

  return image?.url || image?.imageUrl || "";
}

function getProductInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function getAvailableStock(variant: InventoryVariant) {
  return Math.max(
    variant.stock - variant.reservedStock,
    0,
  );
}

function getStockStatus(variant: InventoryVariant) {
  if (!variant.isActive) {
    return {
      label: "Inactive",
      className: "bg-slate-100 text-slate-700",
    };
  }

  if (variant.stock <= 0) {
    return {
      label: "Out of stock",
      className: "bg-red-50 text-red-700",
    };
  }

  if (variant.stock <= variant.lowStockThreshold) {
    return {
      label: "Low stock",
      className: "bg-amber-50 text-amber-700",
    };
  }

  return {
    label: "In stock",
    className: "bg-emerald-50 text-emerald-700",
  };
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

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<
    InventoryProduct[]
  >([]);
  const [pagination, setPagination] =
    useState<InventoryPagination>(EMPTY_PAGINATION);

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] =
    useState<InventoryFilter>("all");

  const [page, setPage] = useState(1);
  const [expandedProductIds, setExpandedProductIds] =
    useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [restockVariant, setRestockVariant] =
  useState<InventoryVariant | null>(null);

  const [variantProduct, setVariantProduct] =
  useState<InventoryProduct | null>(null);

  const [adjustVariant, setAdjustVariant] =
  useState<InventoryVariant | null>(null);

const [isHistoryModalOpen, setIsHistoryModalOpen] =
  useState(false);

const [selectedHistoryVariant, setSelectedHistoryVariant] =
  useState<InventoryVariant | null>(null);

const [selectedHistoryProductId, setSelectedHistoryProductId] =
  useState<string | null>(null);
  
  const loadInventory = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await getAdminInventory({
        page,
        limit: 20,
        search: searchTerm || undefined,
        lowStock:
          selectedFilter === "low-stock"
            ? true
            : undefined,
        outOfStock:
          selectedFilter === "out-of-stock"
            ? true
            : undefined,
      });

      setProducts(response.data);
      setPagination(response.pagination);
    } catch (error) {
      setProducts([]);
      setPagination(EMPTY_PAGINATION);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load inventory.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, searchTerm, selectedFilter]);

  useEffect(() => {
  const timeoutId = window.setTimeout(() => {
    void loadInventory();
  }, 0);

  return () => {
    window.clearTimeout(timeoutId);
  };
}, [loadInventory]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setPage(1);
      setSearchTerm(searchInput.trim());
    }, 450);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchInput]);

  const inventoryTotals = useMemo(() => {
    return products.reduce(
      (totals, product) => ({
        totalStock:
          totals.totalStock +
          product.inventorySummary.totalStock,
        reservedStock:
          totals.reservedStock +
          product.inventorySummary.reservedStock,
        availableStock:
          totals.availableStock +
          product.inventorySummary.availableStock,
        lowStockVariants:
          totals.lowStockVariants +
          product.inventorySummary.lowStockVariants,
        outOfStockVariants:
          totals.outOfStockVariants +
          product.inventorySummary.outOfStockVariants,
        activeVariants:
          totals.activeVariants +
          product.inventorySummary.activeVariants,
      }),
      {
        totalStock: 0,
        reservedStock: 0,
        availableStock: 0,
        lowStockVariants: 0,
        outOfStockVariants: 0,
        activeVariants: 0,
      },
    );
  }, [products]);

  const toggleProduct = (productId: string) => {
    setExpandedProductIds((currentIds) =>
      currentIds.includes(productId)
        ? currentIds.filter((id) => id !== productId)
        : [...currentIds, productId],
    );
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearchTerm("");
    setSelectedFilter("all");
    setPage(1);
  };

  const handleRestockSuccess = (
  updatedVariant: InventoryVariant,
  message: string,
) => {
  setProducts((currentProducts) =>
    currentProducts.map((product) => {
      if (product.id !== updatedVariant.productId) {
        return product;
      }

      const updatedVariants = product.variants.map((variant) =>
        variant.id === updatedVariant.id
          ? {
              ...variant,
              ...updatedVariant,
            }
          : variant,
      );

      const totalStock = updatedVariants.reduce(
        (sum, variant) => sum + variant.stock,
        0,
      );

      const reservedStock = updatedVariants.reduce(
        (sum, variant) => sum + variant.reservedStock,
        0,
      );

      const activeVariants = updatedVariants.filter(
        (variant) => variant.isActive,
      );

      const lowStockVariants = activeVariants.filter(
        (variant) =>
          variant.stock > 0 &&
          variant.stock <= variant.lowStockThreshold,
      ).length;

      const outOfStockVariants = activeVariants.filter(
        (variant) => variant.stock <= 0,
      ).length;

      return {
        ...product,
        variants: updatedVariants,
        inventorySummary: {
          ...product.inventorySummary,
          totalStock,
          reservedStock,
          availableStock: Math.max(totalStock - reservedStock, 0),
          activeVariants: activeVariants.length,
          lowStockVariants,
          outOfStockVariants,
        },
      };
    }),
  );

  setRestockVariant(null);
  setErrorMessage("");
  setSuccessMessage(message);
};

const handleAdjustSuccess = (
  updatedVariant: InventoryVariant,
  message: string,
) => {
  handleRestockSuccess(updatedVariant, message);
  setAdjustVariant(null);
};

const handlePendingAction = (
  action: string,
  variant: InventoryVariant,
) => {
  if (action === "Inventory history") {
    setSelectedHistoryVariant(variant);
    setSelectedHistoryProductId(variant.productId);
    setIsHistoryModalOpen(true);
    return;
  }

  setErrorMessage("");
  setSuccessMessage(
    `${action} modal for ${variant.sku} will be connected in the next step.`,
  );
};

const handleCreateVariantSuccess = async (
  message: string,
) => {
  setVariantProduct(null);
  setErrorMessage("");
  setSuccessMessage(message);

  await loadInventory();
};

const hasActiveFilters =
  searchInput.trim().length > 0 ||
  selectedFilter !== "all";

return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#B38E49]">
            Inventory Management
          </p>

          <h1 className="mt-2 font-serif text-4xl text-[#0F4C3A]">
            Inventory
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#6D746F]">
            Manage product variants, stock levels and
            inventory history.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadInventory()}
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
          <AlertCircle size={19} className="shrink-0" />
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
          <CircleGauge size={19} className="shrink-0" />
          {successMessage}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-[22px] border border-[#E2D8C7] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EEF3F0] text-[#0F4C3A]">
              <Warehouse size={20} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A918D]">
                Total Stock
              </p>
              <p className="mt-1 text-2xl font-semibold text-[#0F4C3A]">
                {inventoryTotals.totalStock}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[22px] border border-[#E2D8C7] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <Archive size={20} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A918D]">
                Reserved
              </p>
              <p className="mt-1 text-2xl font-semibold text-[#0F4C3A]">
                {inventoryTotals.reservedStock}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[22px] border border-[#E2D8C7] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Boxes size={20} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A918D]">
                Available
              </p>
              <p className="mt-1 text-2xl font-semibold text-[#0F4C3A]">
                {inventoryTotals.availableStock}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[22px] border border-[#E2D8C7] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
              <TriangleAlert size={20} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A918D]">
                Low Stock
              </p>
              <p className="mt-1 text-2xl font-semibold text-[#0F4C3A]">
                {inventoryTotals.lowStockVariants}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[22px] border border-[#E2D8C7] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-700">
              <AlertCircle size={20} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A918D]">
                Out of Stock
              </p>
              <p className="mt-1 text-2xl font-semibold text-[#0F4C3A]">
                {inventoryTotals.outOfStockVariants}
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="-mt-2 text-xs text-[#8A918D]">
        Summary cards reflect the products loaded on the
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
              placeholder="Search product, SKU, barcode or size..."
              className="w-full rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] py-3 pl-11 pr-4 text-sm text-[#263D35] outline-none transition placeholder:text-[#9AA09C] focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15"
            />
          </label>

          <label className="relative">
            <SlidersHorizontal
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8A918D]"
            />

            <select
              value={selectedFilter}
              onChange={(event) => {
                setSelectedFilter(
                  event.target.value as InventoryFilter,
                );
                setPage(1);
              }}
              className="w-full appearance-none rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] py-3 pl-11 pr-4 text-sm text-[#263D35] outline-none transition focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15"
            >
              <option value="all">
                All inventory
              </option>
              <option value="low-stock">
                Low-stock variants
              </option>
              <option value="out-of-stock">
                Out-of-stock variants
              </option>
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-[#EEE7DC] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#7B837E]">
            Showing{" "}
            <span className="font-semibold text-[#0F4C3A]">
              {products.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[#0F4C3A]">
              {pagination.total}
            </span>{" "}
            products
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-left text-sm font-semibold text-[#B38E49] transition hover:text-[#8E6B2F]"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-[#E2D8C7] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1380px] border-collapse">
            <thead className="bg-[#F8F5F0]">
              <tr className="border-b border-[#E2D8C7] text-left">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#7B837E]">
                  Product
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#7B837E]">
                  Category
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#7B837E]">
                  Variants
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#7B837E]">
                  Total Stock
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#7B837E]">
                  Reserved
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#7B837E]">
                  Available
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#7B837E]">
                  Alerts
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#7B837E]">
                  Updated
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
                    className="px-6 py-16 text-center text-sm text-[#7B837E]"
                  >
                    <RefreshCw
                      size={22}
                      className="mx-auto mb-3 animate-spin text-[#0F4C3A]"
                    />
                    Loading inventory...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-16 text-center"
                  >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFE8DB] text-[#0F4C3A]">
                      <Warehouse size={25} />
                    </div>

                    <p className="mt-4 font-semibold text-[#263D35]">
                      No inventory found
                    </p>

                    <p className="mt-1 text-sm text-[#8A918D]">
                      Try changing the search or inventory
                      filter.
                    </p>
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const isExpanded =
                    expandedProductIds.includes(product.id);
                  const imageUrl =
                    getProductImage(product);

                  return (
                    <>
                      <tr
                        key={product.id}
                        className="group transition hover:bg-[#FCFAF7]"
                      >
                        <td className="px-6 py-4">
                          <div className="flex min-w-[260px] items-center gap-3">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={product.name}
                                className="h-12 w-12 shrink-0 rounded-xl border border-[#E2D8C7] object-cover"
                              />
                            ) : (
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EEF3F0] text-sm font-semibold text-[#0F4C3A]">
                                {getProductInitials(
                                  product.name,
                                )}
                              </div>
                            )}

                            <div>
                              <p className="text-sm font-semibold text-[#263D35]">
                                {product.name}
                              </p>
                              <p className="mt-1 text-xs text-[#8A918D]">
                                SKU: {product.sku || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-[#5E6964]">
                          {product.category?.name || "N/A"}
                        </td>

                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-[#0F4C3A]">
                            {
                              product.inventorySummary
                                .activeVariants
                            }
                          </p>
                          <p className="mt-1 text-xs text-[#8A918D]">
                            {product.variants.length} total
                          </p>
                        </td>

                        <td className="px-6 py-4 text-sm font-semibold text-[#263D35]">
                          {
                            product.inventorySummary
                              .totalStock
                          }
                        </td>

                        <td className="px-6 py-4 text-sm text-blue-700">
                          {
                            product.inventorySummary
                              .reservedStock
                          }
                        </td>

                        <td className="px-6 py-4 text-sm font-semibold text-emerald-700">
                          {
                            product.inventorySummary
                              .availableStock
                          }
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {product.inventorySummary
                              .lowStockVariants > 0 && (
                              <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                                {
                                  product.inventorySummary
                                    .lowStockVariants
                                }{" "}
                                low
                              </span>
                            )}

                            {product.inventorySummary
                              .outOfStockVariants > 0 && (
                              <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                                {
                                  product.inventorySummary
                                    .outOfStockVariants
                                }{" "}
                                out
                              </span>
                            )}

                            {product.inventorySummary
                              .lowStockVariants === 0 &&
                              product.inventorySummary
                                .outOfStockVariants ===
                                0 && (
                                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                  Healthy
                                </span>
                              )}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-[#5E6964]">
                          {formatDate(product.updatedAt)}
                        </td>

                        <td className="sticky right-0 z-10 bg-white px-6 py-4 shadow-[-8px_0_12px_-12px_rgba(15,76,58,0.35)] transition-colors group-hover:bg-[#FCFAF7]">
                          <button
                            type="button"
                            onClick={() =>
                              toggleProduct(product.id)
                            }
                            className="ml-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#DDD2C0] bg-white px-4 py-2.5 text-sm font-semibold text-[#0F4C3A] transition hover:bg-[#F8F5F0]"
                          >
                            <Boxes size={16} />
                            {isExpanded
                              ? "Hide variants"
                              : "View variants"}
                          </button>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr key={`${product.id}-variants`}>
                          <td
                            colSpan={9}
                            className="bg-[#FCFAF7] px-6 py-5"
                          >
                            <div className="overflow-hidden rounded-2xl border border-[#E2D8C7] bg-white">
                              <div className="flex flex-col gap-3 border-b border-[#EEE7DC] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <p className="font-semibold text-[#0F4C3A]">
                                    Product Variants
                                  </p>
                                  <p className="mt-1 text-xs text-[#8A918D]">
                                    Manage size-level stock
                                    for {product.name}.
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
  setErrorMessage("");
  setSuccessMessage("");
  setVariantProduct(product);
}}
                                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F4C3A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B3B2F]"
                                >
                                  <PackagePlus size={16} />
                                  Add Variant
                                </button>
                              </div>

                              {product.variants.length ===
                              0 ? (
                                <div className="px-5 py-10 text-center text-sm text-[#8A918D]">
                                  No product variants have
                                  been created.
                                </div>
                              ) : (
                                <div className="overflow-x-auto">
                                  <table className="w-full min-w-[1100px]">
                                    <thead className="bg-[#F8F5F0]">
                                      <tr className="text-left">
                                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#7B837E]">
                                          Size
                                        </th>
                                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#7B837E]">
                                          SKU / Barcode
                                        </th>
                                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#7B837E]">
                                          Stock
                                        </th>
                                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#7B837E]">
                                          Reserved
                                        </th>
                                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#7B837E]">
                                          Available
                                        </th>
                                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#7B837E]">
                                          Threshold
                                        </th>
                                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#7B837E]">
                                          Status
                                        </th>
                                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-[0.14em] text-[#7B837E]">
                                          Actions
                                        </th>
                                      </tr>
                                    </thead>

                                    <tbody className="divide-y divide-[#EEE7DC]">
                                      {product.variants.map(
                                        (variant) => {
                                          const stockStatus =
                                            getStockStatus(
                                              variant,
                                            );

                                          return (
                                            <tr
  key={variant.id}
  className={`transition hover:bg-[#FCFAF7] ${
    variant.stock <= 0
      ? "bg-red-50/70"
      : variant.stock <= variant.lowStockThreshold
        ? "bg-amber-50/70"
        : ""
  }`}
                                            >
                                              <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                  <span className="font-semibold text-[#263D35]">
                                                    {
                                                      variant.size
                                                    }
                                                  </span>

                                                  {variant.isDefault && (
                                                    <span className="rounded-full bg-[#EEF3F0] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#0F4C3A]">
                                                      Default
                                                    </span>
                                                  )}
                                                </div>
                                              </td>

                                              <td className="px-5 py-4">
                                                <p className="text-sm font-medium text-[#263D35]">
                                                  {
                                                    variant.sku
                                                  }
                                                </p>
                                                <p className="mt-1 text-xs text-[#8A918D]">
                                                  {variant.barcode ||
                                                    "No barcode"}
                                                </p>
                                              </td>

                                              <td className="px-5 py-4 text-sm font-semibold text-[#263D35]">
                                                {
                                                  variant.stock
                                                }
                                              </td>

                                              <td className="px-5 py-4 text-sm text-blue-700">
                                                {
                                                  variant.reservedStock
                                                }
                                              </td>

                                              <td className="px-5 py-4 text-sm font-semibold text-emerald-700">
                                                {getAvailableStock(
                                                  variant,
                                                )}
                                              </td>

                                              <td className="px-5 py-4 text-sm text-[#5E6964]">
                                                {
                                                  variant.lowStockThreshold
                                                }
                                              </td>

                                              <td className="px-5 py-4">
                                                <span
                                                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${stockStatus.className}`}
                                                >
                                                  {
                                                    stockStatus.label
                                                  }
                                                </span>
                                              </td>

                                              <td className="px-5 py-4">
                                                <div className="flex justify-end gap-2">
                                                  <button
                                                    type="button"
                                                    onClick={() => {
  setErrorMessage("");
  setSuccessMessage("");
  setRestockVariant(variant);
}}
                                                    className="inline-flex items-center gap-2 rounded-xl border border-[#DDD2C0] bg-white px-3 py-2 text-xs font-semibold text-[#0F4C3A] transition hover:bg-[#F8F5F0]"
                                                  >
                                                    <PackagePlus
                                                      size={
                                                        14
                                                      }
                                                    />
                                                    Restock
                                                  </button>

                                                  <button
                                                    type="button"
                                                    onClick={() => setAdjustVariant(variant)}
                                                    className="inline-flex items-center gap-2 rounded-xl border border-[#DDD2C0] bg-white px-3 py-2 text-xs font-semibold text-[#0F4C3A] transition hover:bg-[#F8F5F0]"
                                                  >
                                                    <SlidersHorizontal
                                                      size={
                                                        14
                                                      }
                                                    />
                                                    Adjust
                                                  </button>

                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      handlePendingAction(
                                                        "Inventory history",
                                                        variant,
                                                      )
                                                    }
                                                    className="inline-flex items-center gap-2 rounded-xl border border-[#DDD2C0] bg-white px-3 py-2 text-xs font-semibold text-[#0F4C3A] transition hover:bg-[#F8F5F0]"
                                                  >
                                                    <History
                                                      size={
                                                        14
                                                      }
                                                    />
                                                    History
                                                  </button>
                                                </div>
                                              </td>
                                            </tr>
                                          );
                                        },
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!isLoading && pagination.totalPages > 1 && (
        <div className="flex flex-col gap-3 rounded-[22px] border border-[#E2D8C7] bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
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

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() =>
                setPage((currentPage) =>
                  Math.max(currentPage - 1, 1),
                )
              }
              className="inline-flex items-center gap-2 rounded-xl border border-[#DDD2C0] bg-white px-4 py-2.5 text-sm font-semibold text-[#0F4C3A] transition hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <button
              type="button"
              disabled={
                page >= pagination.totalPages
              }
              onClick={() =>
                setPage((currentPage) =>
                  Math.min(
                    currentPage + 1,
                    pagination.totalPages,
                  ),
                )
              }
              className="inline-flex items-center gap-2 rounded-xl bg-[#0F4C3A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B3B2F] disabled:cursor-not-allowed disabled:opacity-45"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
      <AddInventoryVariantModal
  isOpen={variantProduct !== null}
  product={variantProduct}
  onClose={() => setVariantProduct(null)}
  onSuccess={handleCreateVariantSuccess}
/>

<RestockInventoryModal
  isOpen={restockVariant !== null}
  variant={restockVariant}
  onClose={() => setRestockVariant(null)}
  onSuccess={handleRestockSuccess}
/>
<AdjustInventoryStockModal
  isOpen={adjustVariant !== null}
  variant={adjustVariant}
  onClose={() => setAdjustVariant(null)}
  onSuccess={handleAdjustSuccess}
/>
<InventoryHistoryModal
  isOpen={isHistoryModalOpen}
  productId={selectedHistoryProductId}
  variant={selectedHistoryVariant}
  onClose={() => {
    setIsHistoryModalOpen(false);
    setSelectedHistoryVariant(null);
    setSelectedHistoryProductId(null);
  }}
/>
</section>
);
}