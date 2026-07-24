import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Check,
  Loader2,
  PackageOpen,
  Plus,
  RefreshCcw,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface ProductImage {
  id?: string;
  url: string;
  altText?: string | null;
  isPrimary?: boolean;
}

interface ProductCategory {
  id?: string;
  name: string;
  slug?: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  sku?: string;
  price: string | number;
  stock?: number;
  status?: "DRAFT" | "ACTIVE" | "ARCHIVED";
  isNewArrival?: boolean;
  category?: ProductCategory | null;
  images?: ProductImage[];
}

interface ProductsApiResponse {
  success?: boolean;
  message?: string;
  data?:
    | Product[]
    | {
        products?: Product[];
      };
  products?: Product[];
}

interface ProductMutationResponse {
  success?: boolean;
  message?: string;
}

function extractProducts(result: ProductsApiResponse): Product[] {
  if (Array.isArray(result.data)) {
    return result.data;
  }

  if (
    result.data &&
    !Array.isArray(result.data) &&
    Array.isArray(result.data.products)
  ) {
    return result.data.products;
  }

  if (Array.isArray(result.products)) {
    return result.products;
  }

  return [];
}

function getProductImage(product: Product): string {
  const images = product.images ?? [];
  const primaryImage = images.find((image) => image.isPrimary);

  return primaryImage?.url || images[0]?.url || "";
}

function formatPrice(price: string | number): string {
  const amount = Number(price);

  if (Number.isNaN(amount)) {
    return "Price unavailable";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function AdminNewArrivalsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingProductId, setUpdatingProductId] = useState<string | null>(
    null,
  );

  const [pageError, setPageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setPageError("");

    try {
      const [productsResponse, newArrivalsResponse] = await Promise.all([
        fetch(`${API_URL}/products`),
        fetch(`${API_URL}/products/new-arrivals`),
      ]);

      const productsResult =
        (await productsResponse.json()) as ProductsApiResponse;

      const newArrivalsResult =
        (await newArrivalsResponse.json()) as ProductsApiResponse;

      if (!productsResponse.ok) {
        throw new Error(
          productsResult.message || "Unable to load products.",
        );
      }

      if (!newArrivalsResponse.ok) {
        throw new Error(
          newArrivalsResult.message ||
            "Unable to load New Arrivals.",
        );
      }

      setAllProducts(extractProducts(productsResult));
      setNewArrivals(extractProducts(newArrivalsResult));
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Unable to load New Arrivals.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const newArrivalIds = useMemo(
    () => new Set(newArrivals.map((product) => product.id)),
    [newArrivals],
  );

  const availableProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return allProducts.filter((product) => {
      if (newArrivalIds.has(product.id)) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return (
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.sku?.toLowerCase().includes(normalizedSearch) ||
        product.category?.name
          .toLowerCase()
          .includes(normalizedSearch)
      );
    });
  }, [allProducts, newArrivalIds, searchTerm]);

  const updateNewArrivalStatus = async (
    product: Product,
    isNewArrival: boolean,
  ) => {
    setUpdatingProductId(product.id);
    setPageError("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("adminAccessToken");

      const response = await fetch(
        `${API_URL}/products/${encodeURIComponent(product.id)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
          body: JSON.stringify({
            isNewArrival,
          }),
        },
      );

      const result =
        (await response.json()) as ProductMutationResponse;

      if (!response.ok) {
        throw new Error(
          result.message ||
            (isNewArrival
              ? "Unable to add product to New Arrivals."
              : "Unable to remove product from New Arrivals."),
        );
      }

      if (isNewArrival) {
        setNewArrivals((currentProducts) => [
          ...currentProducts,
          {
            ...product,
            isNewArrival: true,
          },
        ]);

        setAllProducts((currentProducts) =>
          currentProducts.map((currentProduct) =>
            currentProduct.id === product.id
              ? {
                  ...currentProduct,
                  isNewArrival: true,
                }
              : currentProduct,
          ),
        );

        setSuccessMessage(
          `${product.name} added to New Arrivals.`,
        );
      } else {
        setNewArrivals((currentProducts) =>
          currentProducts.filter(
            (currentProduct) => currentProduct.id !== product.id,
          ),
        );

        setAllProducts((currentProducts) =>
          currentProducts.map((currentProduct) =>
            currentProduct.id === product.id
              ? {
                  ...currentProduct,
                  isNewArrival: false,
                }
              : currentProduct,
          ),
        );

        setSuccessMessage(
          `${product.name} removed from New Arrivals.`,
        );
      }
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Unable to update New Arrivals.",
      );
    } finally {
      setUpdatingProductId(null);
    }
  };

  return (
    <section className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#B38E49]">
          Homepage Management
        </p>

        <h1 className="mt-2 font-serif text-4xl text-[#0F4C3A]">
          New Arrivals
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6D746F]">
          Select which products should appear in the homepage New
          Arrivals section. Removing a product from here will not
          delete it from the store or its category.
        </p>
      </div>

      {successMessage && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
          <Check size={18} />
          {successMessage}
        </div>
      )}

      {pageError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
          <p className="text-sm text-red-700">{pageError}</p>

          <button
            type="button"
            onClick={() => void loadProducts()}
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-red-700"
          >
            <RefreshCcw size={16} />
            Try again
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex min-h-[350px] items-center justify-center rounded-[24px] border border-[#E2D8C7] bg-white">
          <div className="text-center">
            <Loader2
              size={34}
              className="mx-auto animate-spin text-[#B38E49]"
            />

            <p className="mt-4 text-sm text-[#6D746F]">
              Loading products...
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="rounded-[24px] border border-[#E2D8C7] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles size={20} className="text-[#B38E49]" />

                  <h2 className="font-serif text-2xl text-[#0F4C3A]">
                    Current New Arrivals
                  </h2>
                </div>

                <p className="mt-2 text-sm text-[#7B837E]">
                  These products are currently visible on the
                  homepage.
                </p>
              </div>

              <span className="w-fit rounded-full bg-[#F4EFE5] px-4 py-2 text-xs font-semibold text-[#0F4C3A]">
                {newArrivals.length} products
              </span>
            </div>

            {newArrivals.length === 0 ? (
              <div className="mt-6 flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-[#DDD2C0] bg-[#FCFAF7] px-6">
                <div className="text-center">
                  <PackageOpen
                    size={34}
                    className="mx-auto text-[#B38E49]"
                  />

                  <h3 className="mt-4 font-serif text-2xl text-[#0F4C3A]">
                    No New Arrivals selected
                  </h3>

                  <p className="mt-2 text-sm text-[#7B837E]">
                    Add products from the available products section
                    below.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {newArrivals.map((product) => {
                  const imageUrl = getProductImage(product);
                  const isUpdating =
                    updatingProductId === product.id;

                  return (
                    <article
                      key={product.id}
                      className="flex gap-4 rounded-2xl border border-[#E2D8C7] bg-[#FCFAF7] p-4"
                    >
                      <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-[#E9E0D2]">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[#9A9286]">
                            <PackageOpen size={22} />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#B38E49]">
                          {product.category?.name || "Uncategorized"}
                        </p>

                        <h3 className="mt-1 truncate text-sm font-semibold text-[#263D35]">
                          {product.name}
                        </h3>

                        <p className="mt-1 text-sm text-[#6D746F]">
                          {formatPrice(product.price)}
                        </p>

                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() =>
                            void updateNewArrivalStatus(
                              product,
                              false,
                            )
                          }
                          className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-red-600 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isUpdating ? (
                            <Loader2
                              size={14}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={14} />
                          )}

                          Remove
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-[24px] border border-[#E2D8C7] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="font-serif text-2xl text-[#0F4C3A]">
                  Available Products
                </h2>

                <p className="mt-2 text-sm text-[#7B837E]">
                  Add existing store products to the homepage New
                  Arrivals section.
                </p>
              </div>

              <label className="relative block w-full lg:max-w-sm">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A918D]"
                />

                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Search products..."
                  className="w-full rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] py-3 pl-11 pr-4 text-sm text-[#263D35] outline-none transition placeholder:text-[#9AA09C] focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15"
                />
              </label>
            </div>

            {availableProducts.length === 0 ? (
              <div className="mt-6 flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-[#DDD2C0] bg-[#FCFAF7] px-6">
                <div className="text-center">
                  <PackageOpen
                    size={34}
                    className="mx-auto text-[#B38E49]"
                  />

                  <h3 className="mt-4 font-serif text-2xl text-[#0F4C3A]">
                    No products found
                  </h3>

                  <p className="mt-2 text-sm text-[#7B837E]">
                    Try another search or add new products from the
                    Products page.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-6 overflow-hidden rounded-2xl border border-[#E2D8C7]">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left">
                    <thead className="bg-[#F8F5F0]">
                      <tr>
                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#7B837E]">
                          Product
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#7B837E]">
                          Category
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#7B837E]">
                          Price
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#7B837E]">
                          Stock
                        </th>

                        <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.14em] text-[#7B837E]">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#EEE7DC]">
                      {availableProducts.map((product) => {
                        const imageUrl = getProductImage(product);
                        const isUpdating =
                          updatingProductId === product.id;

                        return (
                          <tr
                            key={product.id}
                            className="transition hover:bg-[#FCFAF7]"
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-14 w-12 shrink-0 overflow-hidden rounded-xl bg-[#E9E0D2]">
                                  {imageUrl ? (
                                    <img
                                      src={imageUrl}
                                      alt={product.name}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-full items-center justify-center text-[#9A9286]">
                                      <PackageOpen size={18} />
                                    </div>
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <p className="max-w-[260px] truncate text-sm font-semibold text-[#263D35]">
                                    {product.name}
                                  </p>

                                  <p className="mt-1 text-xs text-[#8A918D]">
                                    {product.sku || product.slug}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4 text-sm text-[#59635F]">
                              {product.category?.name ||
                                "Uncategorized"}
                            </td>

                            <td className="px-5 py-4 text-sm font-semibold text-[#263D35]">
                              {formatPrice(product.price)}
                            </td>

                            <td className="px-5 py-4 text-sm text-[#59635F]">
                              {product.stock ?? 0}
                            </td>

                            <td className="px-5 py-4 text-right">
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() =>
                                  void updateNewArrivalStatus(
                                    product,
                                    true,
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-xl bg-[#0F4C3A] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#0B3B2F] disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {isUpdating ? (
                                  <Loader2
                                    size={15}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Plus size={15} />
                                )}

                                Add to New Arrivals
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}