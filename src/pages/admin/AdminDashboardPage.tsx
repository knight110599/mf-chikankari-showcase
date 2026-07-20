import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Boxes,
  FolderTree,
  Package,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

type Product = {
  id: string;
  name: string;
  slug?: string;
  image?: string;
  price?: number;
  stock?: number;
  isFeatured?: boolean;
  featured?: boolean;
  category?: {
    id?: string;
    name?: string;
  };
  createdAt?: string;
};

type Category = {
  id: string;
  name: string;
  slug?: string;
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

type CategoriesApiResponse = {
  success?: boolean;
  data?:
    | Category[]
    | {
        categories?: Category[];
      };
  categories?: Category[];
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

function extractCategories(response: CategoriesApiResponse): Category[] {
  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (
    response.data &&
    !Array.isArray(response.data) &&
    Array.isArray(response.data.categories)
  ) {
    return response.data.categories;
  }

  if (Array.isArray(response.categories)) {
    return response.categories;
  }

  return [];
}

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch(`${API_URL}/products`),
          fetch(`${API_URL}/categories`),
        ]);

        if (!productsResponse.ok) {
          throw new Error("Unable to load products.");
        }

        if (!categoriesResponse.ok) {
          throw new Error("Unable to load categories.");
        }

        const productsResult =
          (await productsResponse.json()) as ProductsApiResponse;

        const categoriesResult =
          (await categoriesResponse.json()) as CategoriesApiResponse;

        setProducts(extractProducts(productsResult));
        setCategories(extractCategories(categoriesResult));
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load dashboard data.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadDashboardData();
  }, []);

  const featuredProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          product.isFeatured === true || product.featured === true,
      ),
    [products],
  );

  const outOfStockProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          typeof product.stock === "number" && product.stock <= 0,
      ),
    [products],
  );

  const recentProducts = useMemo(
    () =>
      [...products]
        .sort((first, second) => {
          const firstDate = first.createdAt
            ? new Date(first.createdAt).getTime()
            : 0;

          const secondDate = second.createdAt
            ? new Date(second.createdAt).getTime()
            : 0;

          return secondDate - firstDate;
        })
        .slice(0, 5),
    [products],
  );

  const recentCategories = useMemo(
    () =>
      [...categories]
        .sort((first, second) => {
          const firstDate = first.createdAt
            ? new Date(first.createdAt).getTime()
            : 0;

          const secondDate = second.createdAt
            ? new Date(second.createdAt).getTime()
            : 0;

          return secondDate - firstDate;
        })
        .slice(0, 5),
    [categories],
  );

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      description: "Products available in catalog",
      icon: Package,
      to: "/admin/products",
    },
    {
      label: "Categories",
      value: categories.length,
      description: "Active product categories",
      icon: FolderTree,
      to: "/admin/categories",
    },
    {
      label: "Featured Products",
      value: featuredProducts.length,
      description: "Highlighted on storefront",
      icon: Sparkles,
      to: "/admin/products?filter=featured",
    },
    {
      label: "Out of Stock",
      value: outOfStockProducts.length,
      description: "Products requiring attention",
      icon: AlertTriangle,
      to: "/admin/products?filter=out-of-stock",
    },
  ];

  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#B38E49]">
          Store Overview
        </p>

        <h1 className="mt-2 font-serif text-4xl text-[#0F4C3A]">
          Dashboard
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#6D746F]">
          Monitor your product catalog, categories and inventory status.
        </p>
      </div>

      {errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, description, icon: Icon, to }) => (
          <Link
            key={label}
            to={to}
            className="group rounded-[24px] border border-[#E2D8C7] bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#C9A86A] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#C9A86A]/40"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[#6D746F] transition group-hover:text-[#0F4C3A]">
                  {label}
                </p>

                <p className="mt-3 font-serif text-4xl text-[#0F4C3A]">
                  {isLoading ? "—" : value}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EFE8DB] text-[#0F4C3A] transition group-hover:bg-[#0F4C3A] group-hover:text-white">
                <Icon size={23} />
              </div>
            </div>

            <p className="mt-4 text-xs leading-5 text-[#8A918D]">
              {description}
            </p>

            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#B38E49] opacity-0 transition group-hover:opacity-100">
              View details
            </p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <section className="rounded-[24px] border border-[#E2D8C7] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EFE8DB] text-[#0F4C3A]">
              <Boxes size={21} />
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0F4C3A]">
                Recent Products
              </h2>

              <p className="mt-1 text-sm text-[#7B837E]">
                Latest products added to your catalog
              </p>
            </div>
          </div>

          <div className="mt-6 divide-y divide-[#EEE7DC]">
            {isLoading ? (
              <p className="py-6 text-sm text-[#7B837E]">
                Loading products...
              </p>
            ) : recentProducts.length === 0 ? (
              <p className="py-6 text-sm text-[#7B837E]">
                No products found.
              </p>
            ) : (
              recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#263D35]">
                      {product.name}
                    </p>

                    <p className="mt-1 text-xs text-[#8A918D]">
                      {product.category?.name || "Uncategorized"}
                    </p>
                  </div>

                  <div className="text-right">
                    {typeof product.price === "number" && (
                      <p className="text-sm font-semibold text-[#0F4C3A]">
                        ₹{product.price.toLocaleString("en-IN")}
                      </p>
                    )}

                    <p className="mt-1 text-xs text-[#8A918D]">
                      Stock:{" "}
                      {typeof product.stock === "number"
                        ? product.stock
                        : "N/A"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-[24px] border border-[#E2D8C7] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EFE8DB] text-[#0F4C3A]">
              <FolderTree size={21} />
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#0F4C3A]">
                Recent Categories
              </h2>

              <p className="mt-1 text-sm text-[#7B837E]">
                Latest catalog groups
              </p>
            </div>
          </div>

          <div className="mt-6 divide-y divide-[#EEE7DC]">
            {isLoading ? (
              <p className="py-6 text-sm text-[#7B837E]">
                Loading categories...
              </p>
            ) : recentCategories.length === 0 ? (
              <p className="py-6 text-sm text-[#7B837E]">
                No categories found.
              </p>
            ) : (
              recentCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#263D35]">
                      {category.name}
                    </p>

                    <p className="mt-1 text-xs text-[#8A918D]">
                      {category.slug || "No slug"}
                    </p>
                  </div>

                  <FolderTree
                    size={18}
                    className="shrink-0 text-[#B38E49]"
                  />
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </section>
  );
}