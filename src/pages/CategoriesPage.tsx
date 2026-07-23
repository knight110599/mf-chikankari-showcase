import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  FolderSearch,
  RefreshCcw,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

import kurtisImage from "../assets/images/collections/womens-kurtis.webp";
import suitsImage from "../assets/images/collections/chikankari-suits.webp";
import dupattasImage from "../assets/images/collections/dupattas.webp";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
};

type CategoriesResponse = {
  success?: boolean;
  message?: string;
  data?: Category[];
};

const curatedImages: Record<string, string> = {
  kurtis: kurtisImage,
  "womens-kurtis": kurtisImage,
  suits: suitsImage,
  "chikankari-suits": suitsImage,
  dupattas: dupattasImage,
};

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

function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await fetch(
          `${API_URL}/categories?includeInactive=false&limit=100`,
        );

        const result = (await response.json()) as CategoriesResponse;

        if (!response.ok) {
          throw new Error(
            result.message || "Unable to load collections.",
          );
        }

        const activeCategories = Array.isArray(result.data)
          ? result.data
              .filter((category) => category.isActive)
              .sort(
                (firstCategory, secondCategory) =>
                  firstCategory.sortOrder - secondCategory.sortOrder,
              )
          : [];

        if (isMounted) {
          setCategories(activeCategories);
        }
      } catch (error) {
        if (!isMounted) return;

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load collections.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadCategories();

    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  function getCategoryImage(category: Category) {
    return (
      curatedImages[category.slug] ||
      category.imageUrl ||
      "https://placehold.co/1200x900?text=MF+Chikankari"
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F5F0]">
      <section className="relative overflow-hidden border-b border-[#E8DCC5]">
        <div className="pointer-events-none absolute -left-32 top-16 h-80 w-80 rounded-full bg-[#C9A86A]/10 blur-3xl" />

        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#0F4C3A]/10 blur-3xl" />

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
                Crafted in Lucknow
              </span>
            </div>

            <h1
              className="mt-6 max-w-4xl text-5xl leading-[0.95] text-[#0F4C3A] sm:text-6xl lg:text-7xl xl:text-[88px]"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              Explore Our
              <span className="block italic text-[#9E7B39]">
                Signature Collections
              </span>
            </h1>

            <p
              className="mt-7 max-w-2xl text-sm leading-7 text-[#596862] sm:text-base sm:leading-8"
              style={{ fontFamily: "Poppins" }}
            >
              Discover handcrafted Chikankari categories designed for
              everyday elegance, festive dressing and timeless wardrobes.
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
                className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#A47E3B]"
                style={{ fontFamily: "Poppins" }}
              >
                Collection Directory
              </p>

              <p
                className="mt-3 text-5xl text-[#0F4C3A]"
                style={{ fontFamily: "Cormorant Garamond" }}
              >
                {isLoading ? "—" : categories.length}
              </p>

              <p
                className="mt-2 text-sm leading-6 text-[#6F7D78]"
                style={{ fontFamily: "Poppins" }}
              >
                Curated categories available to explore.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-14 sm:px-8 sm:py-18 lg:px-12 lg:py-24">
        <div className="flex flex-col gap-6 border-b border-[#D9C8A8] pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#A47E3B]"
              style={{ fontFamily: "Poppins" }}
            >
              Browse by category
            </p>

            <h2
              className="mt-3 text-4xl text-[#0F4C3A] sm:text-5xl"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              Find your perfect piece
            </h2>
          </div>

          {!isLoading && !errorMessage && (
            <p
              className="text-sm text-[#6F7D78]"
              style={{ fontFamily: "Poppins" }}
            >
              {categories.length}{" "}
              {categories.length === 1 ? "collection" : "collections"}
            </p>
          )}
        </div>

        {isLoading && (
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className={`overflow-hidden rounded-[30px] border border-[#E8DCC5] bg-white ${
                  index === 0 ? "lg:col-span-2" : ""
                }`}
              >
                <div
                  className={`animate-pulse bg-[#E9E3D9] ${
                    index === 0
                      ? "min-h-[520px] lg:min-h-[640px]"
                      : "min-h-[460px] lg:min-h-[540px]"
                  }`}
                />
              </div>
            ))}
          </div>
        )}

        {!isLoading && errorMessage && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-10 rounded-[32px] border border-red-200 bg-white px-6 py-14 text-center shadow-[0_20px_60px_rgba(127,29,29,0.06)] sm:px-10 sm:py-20"
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
              Unable to load collections
            </h2>

            <p
              className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#68756F]"
              style={{ fontFamily: "Poppins" }}
            >
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={() => setReloadKey((current) => current + 1)}
              className="mt-8 inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#0F4C3A] px-7 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0A3D2F] hover:shadow-lg"
              style={{ fontFamily: "Poppins" }}
            >
              <RefreshCcw size={17} aria-hidden="true" />
              Try Again
            </button>
          </motion.div>
        )}

        {!isLoading && !errorMessage && categories.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="mt-10 grid gap-6 lg:grid-cols-2"
          >
            {categories.map((category, index) => {
              const isFeatured = index === 0;

              return (
                <motion.div
                  key={category.id}
                  variants={fadeUp}
                  transition={{
                    duration: 0.55,
                    ease: "easeOut",
                  }}
                  className={isFeatured ? "lg:col-span-2" : ""}
                >
                  <Link
                    to={`/categories/${category.slug}`}
                    className={`group relative isolate block overflow-hidden rounded-[30px] bg-[#0F4C3A] shadow-[0_24px_70px_rgba(15,76,58,0.1)] ${
                      isFeatured
                        ? "min-h-[520px] lg:min-h-[680px]"
                        : "min-h-[470px] lg:min-h-[560px]"
                    }`}
                  >
                    <img
                      src={getCategoryImage(category)}
                      alt={`${category.name} collection`}
                      loading={isFeatured ? "eager" : "lazy"}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.045]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/5" />

                    <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6 sm:p-8">
                      <span
                        className="rounded-full border border-white/35 bg-black/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-md"
                        style={{ fontFamily: "Poppins" }}
                      >
                        {isFeatured
                          ? "Featured Collection"
                          : `Collection ${String(index + 1).padStart(2, "0")}`}
                      </span>

                      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/45 bg-white/10 text-white backdrop-blur-md transition duration-300 group-hover:border-white group-hover:bg-white group-hover:text-[#0F4C3A]">
                        <ArrowRight
                          size={19}
                          className="transition-transform duration-300 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </span>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
                      <p
                        className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/65"
                        style={{ fontFamily: "Poppins" }}
                      >
                        MF Chikankari
                      </p>

                      <h3
                        className={`mt-3 leading-none text-white ${
                          isFeatured
                            ? "text-5xl sm:text-6xl lg:text-7xl"
                            : "text-4xl sm:text-5xl"
                        }`}
                        style={{ fontFamily: "Cormorant Garamond" }}
                      >
                        {category.name}
                      </h3>

                      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <p
                          className="max-w-2xl text-sm leading-7 text-white/78 sm:text-base"
                          style={{ fontFamily: "Poppins" }}
                        >
                          {category.description ||
                            `Explore our handcrafted ${category.name.toLowerCase()} collection created with authentic Lucknowi Chikankari embroidery.`}
                        </p>

                        <span
                          className="inline-flex shrink-0 items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white"
                          style={{ fontFamily: "Poppins" }}
                        >
                          Explore Collection
                          <ArrowRight size={15} aria-hidden="true" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {!isLoading && !errorMessage && categories.length === 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-10 rounded-[32px] border border-[#E8DCC5] bg-white px-6 py-14 text-center shadow-[0_20px_60px_rgba(15,76,58,0.05)] sm:px-10 sm:py-20"
          >
            <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-[#F3EEE5] text-[#0F4C3A]">
              <FolderSearch size={30} aria-hidden="true" />
            </div>

            <p
              className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-[#A47E3B]"
              style={{ fontFamily: "Poppins" }}
            >
              No collections
            </p>

            <h2
              className="mt-3 text-4xl text-[#0F4C3A] sm:text-5xl"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              Collections are coming soon
            </h2>

            <p
              className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#68756F]"
              style={{ fontFamily: "Poppins" }}
            >
              No published collections are currently available.
            </p>

            <Link
              to="/products"
              className="mt-8 inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#0F4C3A] px-7 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0A3D2F] hover:shadow-lg"
              style={{ fontFamily: "Poppins" }}
            >
              Browse All Products
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </motion.div>
        )}
      </section>

      <section className="border-t border-[#E8DCC5] bg-[#0F4C3A]">
        <div className="mx-auto grid max-w-[1500px] gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:px-12 lg:py-18">
          <div>
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D8BC80]"
              style={{ fontFamily: "Poppins" }}
            >
              Complete Collection
            </p>

            <h2
              className="mt-3 text-4xl text-white sm:text-5xl"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              Prefer to browse everything?
            </h2>

            <p
              className="mt-3 max-w-2xl text-sm leading-7 text-white/70"
              style={{ fontFamily: "Poppins" }}
            >
              Explore all available products across every Chikankari
              category in one place.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex min-h-14 w-fit items-center justify-center gap-3 rounded-full bg-white px-8 text-sm font-semibold text-[#0F4C3A] transition hover:-translate-y-0.5 hover:bg-[#F4ECDD] hover:shadow-lg"
            style={{ fontFamily: "Poppins" }}
          >
            View All Products
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default CategoriesPage;