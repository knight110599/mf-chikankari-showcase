import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Package,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
type Category = {
  id?: string;
  name?: string;
};

type ProductImage = {
  id: string;
  url: string;
  altText?: string | null;
  isPrimary?: boolean;
};

type Product = {
  id: string;
  name: string;
  slug?: string;
  image?: string;
  images?: ProductImage[];
  price?: number | string;
  wholesalePrice?: number | string;
  stock?: number;
  featured?: boolean;
  isFeatured?: boolean;
  category?: Category;
  createdAt?: string;
};

type ProductsApiResponse = {
  success?: boolean;
  data?:
    | Product[]
    | {
        products?: Product[];
      };
  products?: Product[];
};

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function extractProducts(response: ProductsApiResponse): Product[] {
  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (
    response.data &&
    !Array.isArray(response.data) &&
    Array.isArray(response.data.products)
  ) {
    return response.data.products;
  }

  if (Array.isArray(response.products)) {
    return response.products;
  }

  return [];
}

function getProductImage(product: Product) {
  const primaryImage =
    product.images?.find((image) => image.isPrimary) ??
    product.images?.[0];

  return (
    primaryImage?.url ||
    product.image ||
    "https://placehold.co/120x140/F2ECE1/0F4C3A?text=Product"
  );
}

export default function AdminProductsPage() {
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFilter, setSelectedFilter] = useState(
    searchParams.get("filter") || "all",
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleDeleteProduct = async (product: Product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    const accessToken = localStorage.getItem("adminAccessToken");

    if (!accessToken) {
      setErrorMessage("Authentication required.");
      return;
    }

    try {
      setDeletingProductId(product.id);
      setErrorMessage("");

      const response = await fetch(`${API_URL}/products/${product.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = (await response.json()) as {
        success?: boolean;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(result.message || "Unable to delete product.");
      }

      setProducts((currentProducts) =>
        currentProducts.filter(
          (currentProduct) => currentProduct.id !== product.id,
        ),
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to delete product.",
      );
    } finally {
      setDeletingProductId(null);
    }
  };

  useEffect(() => {
    const filterFromUrl = searchParams.get("filter");

    if (filterFromUrl) {
      setSelectedFilter(filterFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(`${API_URL}/products`);

        if (!response.ok) {
          throw new Error("Unable to load products.");
        }

        const result = (await response.json()) as ProductsApiResponse;

        setProducts(extractProducts(result));
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load products.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadProducts();
  }, []);

  const categories = useMemo(() => {
    const categoryNames = products
      .map((product) => product.category?.name)
      .filter((name): name is string => Boolean(name));

    return [...new Set(categoryNames)].sort((first, second) =>
      first.localeCompare(second),
    );
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.slug?.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        selectedCategory === "all" ||
        product.category?.name === selectedCategory;

      const isFeatured =
        product.featured === true || product.isFeatured === true;

      const isOutOfStock =
        typeof product.stock === "number" && product.stock <= 0;

      let matchesFilter = true;

      if (selectedFilter === "featured") {
        matchesFilter = isFeatured;
      }

      if (selectedFilter === "out-of-stock") {
        matchesFilter = isOutOfStock;
      }

      return matchesSearch && matchesCategory && matchesFilter;
    });
  }, [products, searchTerm, selectedCategory, selectedFilter]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#B38E49]">
            Catalog Management
          </p>

          <h1 className="mt-2 font-serif text-4xl text-[#0F4C3A]">
            Products
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#6D746F]">
            Manage product details, pricing, stock and storefront visibility.
          </p>
        </div>

        <Link
  to="/admin/products/new"
  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0F4C3A] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0B3B2F]"
>
  <Plus size={18} />
  Add Product
</Link>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <AlertCircle size={19} />
          {errorMessage}
        </div>
      )}

      <div className="rounded-[24px] border border-[#E2D8C7] bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
          <label className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8A918D]"
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search products..."
              className="w-full rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] py-3 pl-11 pr-4 text-sm text-[#263D35] outline-none transition placeholder:text-[#9AA09C] focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15"
            />
          </label>

          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] px-4 py-3 text-sm text-[#263D35] outline-none transition focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15"
          >
            <option value="all">All Categories</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={selectedFilter}
            onChange={(event) => setSelectedFilter(event.target.value)}
            className="rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] px-4 py-3 text-sm text-[#263D35] outline-none transition focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15"
          >
            <option value="all">All Products</option>
            <option value="featured">Featured Products</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-[#EEE7DC] pt-4">
          <p className="text-sm text-[#7B837E]">
            Showing{" "}
            <span className="font-semibold text-[#0F4C3A]">
              {filteredProducts.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[#0F4C3A]">
              {products.length}
            </span>{" "}
            products
          </p>

          {(searchTerm ||
            selectedCategory !== "all" ||
            selectedFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedFilter("all");
              }}
              className="text-sm font-semibold text-[#B38E49] transition hover:text-[#8E6B2F]"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-[#E2D8C7] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full border-collapse">
            <thead className="bg-[#F8F5F0]">
              <tr className="border-b border-[#E2D8C7] text-left">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#7B837E]">
                  Product
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#7B837E]">
                  Category
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#7B837E]">
                  Price
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#7B837E]">
                  Stock
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#7B837E]">
                  Featured
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.16em] text-[#7B837E]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#EEE7DC]">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-14 text-center text-sm text-[#7B837E]"
                  >
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFE8DB] text-[#0F4C3A]">
                      <Package size={25} />
                    </div>

                    <p className="mt-4 font-semibold text-[#263D35]">
                      No products found
                    </p>

                    <p className="mt-1 text-sm text-[#8A918D]">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const isFeatured =
                    product.featured === true ||
                    product.isFeatured === true;

                  const stock = product.stock;

                  return (
                    <tr
                      key={product.id}
                      className="transition hover:bg-[#FCFAF7]"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={getProductImage(product)}
                            alt={product.name}
                            className="h-16 w-14 shrink-0 rounded-xl object-cover"
                          />

                          <div className="min-w-0">
                            <p className="max-w-[260px] truncate text-sm font-semibold text-[#263D35]">
                              {product.name}
                            </p>

                            <p className="mt-1 max-w-[260px] truncate text-xs text-[#8A918D]">
                              {product.slug || "No slug"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-[#5E6964]">
                        {product.category?.name || "Uncategorized"}
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-[#0F4C3A]">
                          {product.price !== undefined &&
                          product.price !== null &&
                          !Number.isNaN(Number(product.price))
                            ? `₹${Number(product.price).toLocaleString("en-IN")}`
                            : "N/A"}
                        </p>

                        {product.wholesalePrice !== undefined &&
                          product.wholesalePrice !== null &&
                          !Number.isNaN(Number(product.wholesalePrice)) && (
                            <p className="mt-1 text-xs text-[#8A918D]">
                              Wholesale: ₹
                              {Number(product.wholesalePrice).toLocaleString(
                                "en-IN",
                              )}
                            </p>
                          )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            typeof stock === "number" && stock <= 0
                              ? "bg-red-50 text-red-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {typeof stock === "number"
                            ? stock <= 0
                              ? "Out of stock"
                              : `${stock} available`
                            : "Not tracked"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                            isFeatured
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <Star
                            size={13}
                            fill={isFeatured ? "currentColor" : "none"}
                          />

                          {isFeatured ? "Featured" : "Standard"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
  type="button"
  onClick={() => navigate(`/admin/products/${product.id}/edit`)}
  className="rounded-lg border px-3 py-2 text-sm font-medium"
>
  Edit
</button>

                          <button
  type="button"
  title="Delete product"
  disabled={deletingProductId === product.id}
  onClick={() => void handleDeleteProduct(product)}
  className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
>
  <Trash2 size={17} />
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
    </section>
  );
}