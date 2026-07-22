import { useEffect, useState } from "react";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";
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
  suits: suitsImage,
  dupattas: dupattasImage,
};

function Collections() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
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

        setCategories(activeCategories);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load collections.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadCategories();
  }, []);

  const getCategoryImage = (category: Category) =>
    curatedImages[category.slug] ||
    category.imageUrl ||
    "https://placehold.co/1200x900?text=MF+Chikankari";

  return (
    <section
      id="collections"
      className="overflow-hidden bg-[#F8F5F0] py-20 sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-8 border-b border-[#D9C8A8] pb-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:pb-14">
          <div>
            <div className="mb-6 h-px w-16 bg-[#C9A86A]" />

            <p
              className="text-xs font-medium uppercase tracking-[0.38em] text-[#B38E49] sm:text-sm"
              style={{ fontFamily: "Poppins" }}
            >
              Our Collections
            </p>

            <h2
              className="mt-5 max-w-xl text-[46px] leading-[0.98] tracking-[-0.025em] text-[#0F4C3A] sm:text-6xl lg:text-[76px]"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              Crafted for
              <br />
              every expression
            </h2>
          </div>

          <div className="lg:pb-2 lg:pl-12">
            <p
              className="max-w-xl text-base leading-8 text-[#59635F] sm:text-lg"
              style={{ fontFamily: "Poppins" }}
            >
              Explore timeless silhouettes shaped by Lucknow’s celebrated
              Chikankari tradition—created for everyday elegance, special
              occasions and refined wardrobes.
            </p>

            <p
              className="mt-6 text-xs uppercase tracking-[0.28em] text-[#0F4C3A]"
              style={{ fontFamily: "Poppins" }}
            >
              Heritage craft • Contemporary elegance
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="mt-12 flex min-h-56 items-center justify-center gap-3 border border-[#E8DCC5] bg-white/60 text-[#0F4C3A]">
            <Loader2 size={22} className="animate-spin" />
            <span style={{ fontFamily: "Poppins" }}>
              Loading collections...
            </span>
          </div>
        )}

        {errorMessage && !isLoading && (
          <div className="mt-12 flex items-center gap-3 border border-red-200 bg-red-50 px-6 py-5 text-sm text-red-700">
            <AlertCircle size={20} />
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && categories.length > 0 && (
          <div className="mt-12 grid gap-5 lg:grid-cols-2 lg:gap-6">
            {categories.map((category, index) => {
              const isFeatured = index === 0;

              return (
                <Link
                  key={category.id}
                  to={`/categories/${category.slug}`}
                  className={`group relative isolate overflow-hidden bg-[#0F4C3A] ${
                    isFeatured
                      ? "min-h-[540px] lg:col-span-2 lg:min-h-[680px]"
                      : "min-h-[480px] lg:min-h-[560px]"
                  }`}
                >
                  <img
                    src={getCategoryImage(category)}
                    alt={`${category.name} collection`}
                    loading={isFeatured ? "eager" : "lazy"}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.045]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8 lg:p-10">
                    <p
                      className="text-[11px] uppercase tracking-[0.32em] text-white/75"
                      style={{ fontFamily: "Poppins" }}
                    >
                      {isFeatured
                        ? "Featured Collection"
                        : "Curated Collection"}
                    </p>

                    <div className="mt-3 flex items-end justify-between gap-6">
                      <div>
                        <h3
                          className={`leading-none text-white ${
                            isFeatured
                              ? "text-5xl sm:text-6xl lg:text-7xl"
                              : "text-4xl sm:text-5xl"
                          }`}
                          style={{ fontFamily: "Cormorant Garamond" }}
                        >
                          {category.name}
                        </h3>

                        {category.description && (
                          <p
                            className="mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base"
                            style={{ fontFamily: "Poppins" }}
                          >
                            {category.description}
                          </p>
                        )}
                      </div>

                      <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/50 text-white transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-[#0F4C3A] sm:flex">
                        <ArrowRight
                          size={19}
                          className="transition-transform duration-300 group-hover:translate-x-0.5"
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {!isLoading && !errorMessage && categories.length === 0 && (
          <div
            className="mt-12 border border-[#E8DCC5] bg-white/60 px-6 py-14 text-center text-[#59635F]"
            style={{ fontFamily: "Poppins" }}
          >
            No published collections are currently available.
          </div>
        )}
      </div>
    </section>
  );
}

export default Collections;