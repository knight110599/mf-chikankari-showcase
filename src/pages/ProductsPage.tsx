import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  Filter,
  PackageSearch,
  RefreshCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

import ProductCard from "../components/product/ProductCard";
import {
  getProducts,
  type ApiProduct,
} from "../services/product.service";

const PRODUCTS_PER_PAGE = 6;

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

function ProductsPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [fabric, setFabric] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [visibleCount, setVisibleCount] =
    useState(PRODUCTS_PER_PAGE);

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);

        const response = await getProducts();

        if (isMounted) {
          setProducts(response.data);
        }
      } catch (caughtError) {
        if (isMounted) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Products could not be loaded.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  useEffect(() => {
    setVisibleCount(PRODUCTS_PER_PAGE);
  }, [search, category, fabric, sortBy]);

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          products
            .map((product) => product.category?.name)
            .filter(
              (item): item is string => Boolean(item),
            ),
        ),
      ),
    ],
    [products],
  );

  const fabrics = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          products
            .map((product) => product.fabric)
            .filter(
              (item): item is string => Boolean(item),
            ),
        ),
      ),
    ],
    [products],
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    const result = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(normalizedSearch);

      const matchesCategory =
        category === "All" ||
        product.category?.name === category;

      const matchesFabric =
        fabric === "All" || product.fabric === fabric;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesFabric
      );
    });

    return [...result].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return Number(a.price) - Number(b.price);

        case "price-high":
          return Number(b.price) - Number(a.price);

        case "name-asc":
          return a.name.localeCompare(b.name);

        case "name-desc":
          return b.name.localeCompare(a.name);

        default:
          return 0;
      }
    });
  }, [products, search, category, fabric, sortBy]);

  const displayedProducts = filteredProducts.slice(
    0,
    visibleCount,
  );

  const hasActiveFilters =
    search.trim() !== "" ||
    category !== "All" ||
    fabric !== "All" ||
    sortBy !== "default";

  const clearFilters = useCallback(() => {
    setSearch("");
    setCategory("All");
    setFabric("All");
    setSortBy("default");
    setVisibleCount(PRODUCTS_PER_PAGE);
  }, []);

  function retryLoading() {
    setReloadKey((current) => current + 1);
  }

  return (
    <main className="min-h-screen bg-[#F8F5F0]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#E8DCC5]">
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#C9A86A]/10 blur-3xl" />

        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#0F4C3A]/10 blur-3xl" />

        <div className="mx-auto grid max-w-[1500px] gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:px-12 lg:py-28">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
            className="relative z-10 max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A86A]/40 bg-white/70 px-4 py-2 backdrop-blur-sm">
              <Sparkles
                size={15}
                className="text-[#C9A86A]"
                aria-hidden="true"
              />

              <span
                className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#0F4C3A]"
                style={{ fontFamily: "Poppins" }}
              >
                Handcrafted in Lucknow
              </span>
            </div>

            <h1
              className="mt-6 max-w-4xl text-5xl leading-[0.95] text-[#0F4C3A] sm:text-6xl lg:text-7xl xl:text-[88px]"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              Explore Our
              <span className="block italic text-[#9E7B39]">
                Chikankari Collection
              </span>
            </h1>

            <p
              className="mt-7 max-w-2xl text-sm leading-7 text-[#52635D] sm:text-base sm:leading-8"
              style={{ fontFamily: "Poppins" }}
            >
              Discover authentic Lucknowi kurtis, suits,
              dupattas and coordinated sets created with
              refined embroidery, premium fabrics and
              generations of craftsmanship.
            </p>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.15,
              ease: "easeOut",
            }}
            className="relative z-10 lg:justify-self-end"
          >
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-[26px] border border-[#E8DCC5] bg-white/75 p-5 backdrop-blur-sm sm:p-6">
                <p
                  className="text-3xl text-[#0F4C3A] sm:text-4xl"
                  style={{
                    fontFamily: "Cormorant Garamond",
                  }}
                >
                  {loading ? "—" : products.length}
                </p>

                <p
                  className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#6F7D78]"
                  style={{ fontFamily: "Poppins" }}
                >
                  Products
                </p>
              </div>

              <div className="rounded-[26px] border border-[#E8DCC5] bg-[#0F4C3A] p-5 text-white sm:p-6">
                <p
                  className="text-3xl sm:text-4xl"
                  style={{
                    fontFamily: "Cormorant Garamond",
                  }}
                >
                  {loading
                    ? "—"
                    : Math.max(categories.length - 1, 0)}
                </p>

                <p
                  className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/65"
                  style={{ fontFamily: "Poppins" }}
                >
                  Collections
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        {/* Filters */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.1,
          }}
          variants={fadeUp}
          transition={{
            duration: 0.6,
          }}
          className="relative overflow-hidden rounded-[30px] border border-[#E8DCC5] bg-white shadow-[0_20px_70px_rgba(15,76,58,0.06)]"
        >
          <div className="flex flex-col gap-4 border-b border-[#E8DCC5] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0F4C3A] text-white">
                <SlidersHorizontal
                  size={18}
                  aria-hidden="true"
                />
              </div>

              <div>
                <h2
                  className="text-2xl leading-none text-[#0F4C3A]"
                  style={{
                    fontFamily: "Cormorant Garamond",
                  }}
                >
                  Find Your Style
                </h2>

                <p
                  className="mt-1 text-xs text-[#77827E]"
                  style={{ fontFamily: "Poppins" }}
                >
                  Search, filter and sort the collection.
                </p>
              </div>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                disabled={loading}
                className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-full border border-[#D9C8A8] px-4 text-xs font-medium text-[#0F4C3A] transition hover:border-[#0F4C3A] hover:bg-[#0F4C3A] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
                style={{ fontFamily: "Poppins" }}
              >
                <X size={15} aria-hidden="true" />
                Clear all
              </button>
            )}
          </div>

          <div className="grid gap-5 p-5 sm:p-7 md:grid-cols-2 lg:grid-cols-4">
            <div className="md:col-span-2 lg:col-span-1">
              <label
                htmlFor="product-search"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#0F4C3A]"
                style={{ fontFamily: "Poppins" }}
              >
                Search
              </label>

              <div className="relative">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8E9A95]"
                  aria-hidden="true"
                />

                <input
                  id="product-search"
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search products..."
                  className="h-13 w-full rounded-2xl border border-[#DDD1BB] bg-[#FBF9F5] py-3 pl-11 pr-4 text-sm text-[#263D35] outline-none transition placeholder:text-[#9AA39F] focus:border-[#0F4C3A] focus:bg-white focus:ring-4 focus:ring-[#0F4C3A]/5"
                  style={{ fontFamily: "Poppins" }}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="category-filter"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#0F4C3A]"
                style={{ fontFamily: "Poppins" }}
              >
                Category
              </label>

              <select
                id="category-filter"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                disabled={loading}
                className="h-13 w-full cursor-pointer rounded-2xl border border-[#DDD1BB] bg-[#FBF9F5] px-4 py-3 text-sm text-[#263D35] outline-none transition focus:border-[#0F4C3A] focus:bg-white focus:ring-4 focus:ring-[#0F4C3A]/5 disabled:cursor-not-allowed disabled:opacity-60"
                style={{ fontFamily: "Poppins" }}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item === "All"
                      ? "All Categories"
                      : item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="fabric-filter"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#0F4C3A]"
                style={{ fontFamily: "Poppins" }}
              >
                Fabric
              </label>

              <select
                id="fabric-filter"
                value={fabric}
                onChange={(event) =>
                  setFabric(event.target.value)
                }
                disabled={loading}
                className="h-13 w-full cursor-pointer rounded-2xl border border-[#DDD1BB] bg-[#FBF9F5] px-4 py-3 text-sm text-[#263D35] outline-none transition focus:border-[#0F4C3A] focus:bg-white focus:ring-4 focus:ring-[#0F4C3A]/5 disabled:cursor-not-allowed disabled:opacity-60"
                style={{ fontFamily: "Poppins" }}
              >
                {fabrics.map((item) => (
                  <option key={item} value={item}>
                    {item === "All"
                      ? "All Fabrics"
                      : item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="sort-products"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#0F4C3A]"
                style={{ fontFamily: "Poppins" }}
              >
                Sort By
              </label>

              <select
                id="sort-products"
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value)
                }
                disabled={loading}
                className="h-13 w-full cursor-pointer rounded-2xl border border-[#DDD1BB] bg-[#FBF9F5] px-4 py-3 text-sm text-[#263D35] outline-none transition focus:border-[#0F4C3A] focus:bg-white focus:ring-4 focus:ring-[#0F4C3A]/5 disabled:cursor-not-allowed disabled:opacity-60"
                style={{ fontFamily: "Poppins" }}
              >
                <option value="default">
                  Featured first
                </option>
                <option value="price-low">
                  Price: Low to High
                </option>
                <option value="price-high">
                  Price: High to Low
                </option>
                <option value="name-asc">
                  Name: A to Z
                </option>
                <option value="name-desc">
                  Name: Z to A
                </option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="mt-12">
            <div className="mb-7 flex items-center justify-between">
              <div className="h-5 w-40 animate-pulse rounded-full bg-[#E9E1D4]" />

              <div className="h-5 w-24 animate-pulse rounded-full bg-[#E9E1D4]" />
            </div>

            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-[28px] border border-[#E8DCC5] bg-white"
                >
                  <div className="aspect-[4/5] animate-pulse bg-[#ECE7DE]" />

                  <div className="space-y-4 p-5">
                    <div className="h-3 w-24 animate-pulse rounded-full bg-[#E9E1D4]" />

                    <div className="h-6 w-3/4 animate-pulse rounded-full bg-[#E9E1D4]" />

                    <div className="h-5 w-1/3 animate-pulse rounded-full bg-[#E9E1D4]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-12 overflow-hidden rounded-[32px] border border-red-200/80 bg-white px-6 py-14 text-center shadow-[0_20px_60px_rgba(127,29,29,0.06)] sm:px-10 sm:py-20"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-700">
              <RefreshCcw
                size={27}
                aria-hidden="true"
              />
            </div>

            <p
              className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-[#A47E3B]"
              style={{ fontFamily: "Poppins" }}
            >
              Something went wrong
            </p>

            <h2
              className="mt-3 text-4xl text-[#0F4C3A] sm:text-5xl"
              style={{
                fontFamily: "Cormorant Garamond",
              }}
            >
              Unable to load products
            </h2>

            <p
              className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#68756F] sm:text-base"
              style={{ fontFamily: "Poppins" }}
            >
              {error}
            </p>

            <button
              type="button"
              onClick={retryLoading}
              className="mt-8 inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#0F4C3A] px-7 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0A3D2F] hover:shadow-lg"
              style={{ fontFamily: "Poppins" }}
            >
              <RefreshCcw
                size={17}
                aria-hidden="true"
              />
              Try Again
            </button>
          </motion.div>
        )}

        {/* Results */}
        {!loading && !error && (
          <>
            <div className="mt-12 flex flex-col gap-4 border-b border-[#DED4C3] pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p
                  className="text-xs font-medium uppercase tracking-[0.22em] text-[#A47E3B]"
                  style={{ fontFamily: "Poppins" }}
                >
                  Curated Collection
                </p>

                <h2
                  className="mt-2 text-3xl text-[#0F4C3A] sm:text-4xl"
                  style={{
                    fontFamily: "Cormorant Garamond",
                  }}
                >
                  {hasActiveFilters
                    ? "Matching Products"
                    : "All Products"}
                </h2>
              </div>

              <div
                className="inline-flex w-fit items-center gap-2 rounded-full border border-[#D9C8A8] bg-white px-4 py-2 text-xs text-[#596862]"
                style={{ fontFamily: "Poppins" }}
              >
                <Filter
                  size={14}
                  className="text-[#A47E3B]"
                  aria-hidden="true"
                />

                Showing{" "}
                <span className="font-semibold text-[#0F4C3A]">
                  {displayedProducts.length}
                </span>
                of{" "}
                <span className="font-semibold text-[#0F4C3A]">
                  {filteredProducts.length}
                </span>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.08,
                      },
                    },
                  }}
                  className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {displayedProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      variants={fadeUp}
                      transition={{
                        duration: 0.45,
                        ease: "easeOut",
                      }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>

                {visibleCount <
                  filteredProducts.length && (
                  <div className="mt-14 flex flex-col items-center">
                    <p
                      className="mb-4 text-xs uppercase tracking-[0.18em] text-[#78837F]"
                      style={{ fontFamily: "Poppins" }}
                    >
                      More handcrafted pieces await
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setVisibleCount(
                          (current) =>
                            current +
                            PRODUCTS_PER_PAGE,
                        )
                      }
                      className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#0F4C3A] px-8 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#0A3D2F] hover:shadow-[0_15px_35px_rgba(15,76,58,0.22)]"
                      style={{ fontFamily: "Poppins" }}
                    >
                      Load More Products

                      <ArrowDown
                        size={17}
                        className="transition-transform duration-300 group-hover:translate-y-1"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="mt-10 rounded-[32px] border border-[#E8DCC5] bg-white px-6 py-14 text-center shadow-[0_20px_60px_rgba(15,76,58,0.05)] sm:px-10 sm:py-20"
              >
                <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-[#F3EEE5] text-[#0F4C3A]">
                  <PackageSearch
                    size={30}
                    aria-hidden="true"
                  />
                </div>

                <p
                  className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-[#A47E3B]"
                  style={{ fontFamily: "Poppins" }}
                >
                  No matches
                </p>

                <h2
                  className="mt-3 text-4xl text-[#0F4C3A] sm:text-5xl"
                  style={{
                    fontFamily: "Cormorant Garamond",
                  }}
                >
                  No products found
                </h2>

                <p
                  className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#68756F] sm:text-base"
                  style={{ fontFamily: "Poppins" }}
                >
                  Try a different search term or remove
                  some filters to explore more products.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-8 inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#0F4C3A] px-7 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0A3D2F] hover:shadow-lg"
                  style={{ fontFamily: "Poppins" }}
                >
                  <X size={17} aria-hidden="true" />
                  Reset Filters
                </button>
              </motion.div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default ProductsPage;