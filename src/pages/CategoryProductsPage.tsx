import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  FolderSearch,
  RefreshCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

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

function CategoryProductsPage() {
  const { slug } = useParams<{ slug: string }>();

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
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
              : "Unable to load category products.",
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


  const categoryProducts = useMemo(() => {
    if (!slug) return [];

    return products.filter(
      (product) =>
        product.category.slug.toLowerCase() === slug.toLowerCase(),
    );
  }, [products, slug]);

  const categoryName = useMemo(() => {
    const matchedCategory = products.find(
      (product) =>
        product.category.slug.toLowerCase() === slug?.toLowerCase(),
    );

    if (matchedCategory) {
      return matchedCategory.category.name;
    }

    if (!slug) {
      return "Category";
    }

    return slug
      .split("-")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1),
      )
      .join(" ");
  }, [products, slug]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const result = categoryProducts.filter((product) =>
      product.name.toLowerCase().includes(normalizedSearch),
    );

    return [...result].sort((firstProduct, secondProduct) => {
      switch (sortBy) {
        case "price-low":
          return (
            Number(firstProduct.price) -
            Number(secondProduct.price)
          );

        case "price-high":
          return (
            Number(secondProduct.price) -
            Number(firstProduct.price)
          );

        case "name-asc":
          return firstProduct.name.localeCompare(
            secondProduct.name,
          );

        case "name-desc":
          return secondProduct.name.localeCompare(
            firstProduct.name,
          );

        default:
          return 0;
      }
    });
  }, [categoryProducts, search, sortBy]);

  const displayedProducts = filteredProducts.slice(
    0,
    visibleCount,
  );

  const hasActiveFilters =
    search.trim() !== "" || sortBy !== "default";

  function clearFilters() {
    setSearch("");
    setSortBy("default");
    setVisibleCount(PRODUCTS_PER_PAGE);
  }

  return (
    <main className="min-h-screen bg-[#F8F5F0]">
      <section className="border-b border-[#E8DCC5] bg-white/40">
        <div className="mx-auto max-w-[1500px] px-5 py-4 sm:px-8 lg:px-12">
          <div
            className="flex flex-wrap items-center gap-2 text-xs text-[#77827E]"
            style={{ fontFamily: "Poppins" }}
          >
            <Link
              to="/"
              className="transition hover:text-[#0F4C3A]"
            >
              Home
            </Link>

            <span>/</span>

            <Link
              to="/categories"
              className="transition hover:text-[#0F4C3A]"
            >
              Categories
            </Link>

            <span>/</span>

            <span className="font-medium text-[#0F4C3A]">
              {categoryName}
            </span>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-[#E8DCC5]">
        <div className="pointer-events-none absolute -left-28 top-12 h-80 w-80 rounded-full bg-[#C9A86A]/10 blur-3xl" />

        <div className="pointer-events-none absolute -right-28 bottom-0 h-96 w-96 rounded-full bg-[#0F4C3A]/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-[1500px] gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:px-12 lg:py-28">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
          >
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0F4C3A] transition hover:text-[#A47E3B]"
              style={{ fontFamily: "Poppins" }}
            >
              <ArrowLeft size={15} aria-hidden="true" />
              Back to Categories
            </Link>

            <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#C9A86A]/40 bg-white/70 px-4 py-2 backdrop-blur-sm">
              <Sparkles
                size={15}
                className="text-[#C9A86A]"
                aria-hidden="true"
              />

              <span
                className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#0F4C3A]"
                style={{ fontFamily: "Poppins" }}
              >
                Handcrafted Collection
              </span>
            </div>

            <h1
              className="mt-6 max-w-4xl text-5xl leading-[0.95] text-[#0F4C3A] sm:text-6xl lg:text-7xl xl:text-[88px]"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              {categoryName}
              <span className="block italic text-[#9E7B39]">
                Collection
              </span>
            </h1>

            <p
              className="mt-7 max-w-2xl text-sm leading-7 text-[#596862] sm:text-base sm:leading-8"
              style={{ fontFamily: "Poppins" }}
            >
              Explore our handcrafted{" "}
              {categoryName.toLowerCase()} created with authentic
              Lucknowi embroidery, refined fabrics and timeless
              silhouettes.
            </p>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: 28,
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
            className="lg:justify-self-end"
          >
            <div className="rounded-[30px] border border-[#E8DCC5] bg-white/75 p-6 backdrop-blur-sm sm:p-8">
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#A47E3B]"
                style={{ fontFamily: "Poppins" }}
              >
                Collection Overview
              </p>

              <p
                className="mt-3 text-5xl text-[#0F4C3A]"
                style={{ fontFamily: "Cormorant Garamond" }}
              >
                {loading ? "—" : categoryProducts.length}
              </p>

              <p
                className="mt-2 text-sm leading-6 text-[#6F7D78]"
                style={{ fontFamily: "Poppins" }}
              >
                {categoryProducts.length === 1
                  ? "Handcrafted product"
                  : "Handcrafted products"}{" "}
                in this collection.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
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
          className="overflow-hidden rounded-[30px] border border-[#E8DCC5] bg-white shadow-[0_20px_70px_rgba(15,76,58,0.06)]"
        >
          <div className="flex flex-col gap-4 border-b border-[#E8DCC5] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0F4C3A] text-white">
                <SlidersHorizontal size={18} aria-hidden="true" />
              </div>

              <div>
                <h2
                  className="text-2xl leading-none text-[#0F4C3A]"
                  style={{ fontFamily: "Cormorant Garamond" }}
                >
                  Refine Collection
                </h2>

                <p
                  className="mt-1 text-xs text-[#77827E]"
                  style={{ fontFamily: "Poppins" }}
                >
                  Search and arrange products your way.
                </p>
              </div>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-full border border-[#D9C8A8] px-4 text-xs font-medium text-[#0F4C3A] transition hover:border-[#0F4C3A] hover:bg-[#0F4C3A] hover:text-white sm:self-auto"
                style={{ fontFamily: "Poppins" }}
              >
                <X size={15} aria-hidden="true" />
                Clear Filters
              </button>
            )}
          </div>

          <div className="grid gap-5 p-5 sm:p-7 md:grid-cols-2">
            <div>
              <label
                htmlFor="category-product-search"
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
                  id="category-product-search"
                  type="search"
                  value={search}
                  onChange={(event) => {
  setSearch(event.target.value);
  setVisibleCount(PRODUCTS_PER_PAGE);
}}
                  placeholder={`Search ${categoryName.toLowerCase()}...`}
                  className="h-13 w-full rounded-2xl border border-[#DDD1BB] bg-[#FBF9F5] py-3 pl-11 pr-4 text-sm text-[#263D35] outline-none transition placeholder:text-[#9AA39F] focus:border-[#0F4C3A] focus:bg-white focus:ring-4 focus:ring-[#0F4C3A]/5"
                  style={{ fontFamily: "Poppins" }}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="category-product-sort"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#0F4C3A]"
                style={{ fontFamily: "Poppins" }}
              >
                Sort By
              </label>

              <select
                id="category-product-sort"
                value={sortBy}
                onChange={(event) => {
  setSortBy(event.target.value);
  setVisibleCount(PRODUCTS_PER_PAGE);
}}
                className="h-13 w-full cursor-pointer rounded-2xl border border-[#DDD1BB] bg-[#FBF9F5] px-4 py-3 text-sm text-[#263D35] outline-none transition focus:border-[#0F4C3A] focus:bg-white focus:ring-4 focus:ring-[#0F4C3A]/5"
                style={{ fontFamily: "Poppins" }}
              >
                <option value="default">Featured First</option>
                <option value="price-low">
                  Price: Low to High
                </option>
                <option value="price-high">
                  Price: High to Low
                </option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        </motion.div>

        {loading && (
          <div className="mt-12">
            <div className="mb-7 flex items-center justify-between">
              <div className="h-5 w-44 animate-pulse rounded-full bg-[#E9E1D4]" />

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

        {!loading && error && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-12 rounded-[32px] border border-red-200 bg-white px-6 py-14 text-center shadow-[0_20px_60px_rgba(127,29,29,0.06)] sm:px-10 sm:py-20"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-700">
              <AlertCircle size={28} aria-hidden="true" />
            </div>

            <p
              className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-[#A47E3B]"
              style={{ fontFamily: "Poppins" }}
            >
              Something went wrong
            </p>

            <h2
              className="mt-3 text-4xl text-[#0F4C3A] sm:text-5xl"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              Unable to load products
            </h2>

            <p
              className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#68756F]"
              style={{ fontFamily: "Poppins" }}
            >
              {error}
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() =>
                  setReloadKey((current) => current + 1)
                }
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-[#0F4C3A] px-7 text-sm font-semibold text-[#0F4C3A] transition hover:bg-[#0F4C3A] hover:text-white"
                style={{ fontFamily: "Poppins" }}
              >
                <RefreshCcw size={17} aria-hidden="true" />
                Try Again
              </button>

              <Link
                to="/products"
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#0F4C3A] px-7 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0A3D2F] hover:shadow-lg"
                style={{ fontFamily: "Poppins" }}
              >
                View All Products
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <>
            <div className="mt-12 flex flex-col gap-4 border-b border-[#DED4C3] pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p
                  className="text-xs font-medium uppercase tracking-[0.22em] text-[#A47E3B]"
                  style={{ fontFamily: "Poppins" }}
                >
                  Curated Pieces
                </p>

                <h2
                  className="mt-2 text-3xl text-[#0F4C3A] sm:text-4xl"
                  style={{ fontFamily: "Cormorant Garamond" }}
                >
                  {hasActiveFilters
                    ? "Matching Products"
                    : `${categoryName} Products`}
                </h2>
              </div>

              <div
                className="rounded-full border border-[#D9C8A8] bg-white px-4 py-2 text-xs text-[#596862]"
                style={{ fontFamily: "Poppins" }}
              >
                Showing{" "}
                <span className="font-semibold text-[#0F4C3A]">
                  {displayedProducts.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-[#0F4C3A]">
                  {filteredProducts.length}
                </span>
              </div>
            </div>

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

            {visibleCount < filteredProducts.length && (
              <div className="mt-14 text-center">
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
                        current + PRODUCTS_PER_PAGE,
                    )
                  }
                  className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#0F4C3A] px-8 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0A3D2F] hover:shadow-[0_15px_35px_rgba(15,76,58,0.22)]"
                  style={{ fontFamily: "Poppins" }}
                >
                  Load More Products
                  <ArrowRight size={17} aria-hidden="true" />
                </button>
              </div>
            )}
          </>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-12 rounded-[32px] border border-[#E8DCC5] bg-white px-6 py-14 text-center shadow-[0_20px_60px_rgba(15,76,58,0.05)] sm:px-10 sm:py-20"
          >
            <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-[#F3EEE5] text-[#0F4C3A]">
              <FolderSearch size={30} aria-hidden="true" />
            </div>

            <p
              className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-[#A47E3B]"
              style={{ fontFamily: "Poppins" }}
            >
              No products found
            </p>

            <h2
              className="mt-3 text-4xl text-[#0F4C3A] sm:text-5xl"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              {hasActiveFilters
                ? "No matching products"
                : "Collection coming soon"}
            </h2>

            <p
              className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#68756F]"
              style={{ fontFamily: "Poppins" }}
            >
              {hasActiveFilters
                ? "Try a different search term or reset the current filters."
                : `Products for the ${categoryName} collection will be added soon.`}
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-[#0F4C3A] px-7 text-sm font-semibold text-[#0F4C3A] transition hover:bg-[#0F4C3A] hover:text-white"
                  style={{ fontFamily: "Poppins" }}
                >
                  <X size={17} aria-hidden="true" />
                  Reset Filters
                </button>
              )}

              <Link
                to="/products"
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#0F4C3A] px-7 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0A3D2F] hover:shadow-lg"
                style={{ fontFamily: "Poppins" }}
              >
                View All Products
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        )}
      </section>
    </main>
  );
}

export default CategoryProductsPage;