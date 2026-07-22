import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, FolderTree, Loader2 } from "lucide-react";
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

function CategoriesPage() {
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
          result.message || "Unable to load categories.",
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
          : "Unable to load categories.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  void loadCategories();
}, []);
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="max-w-3xl">
        <p
          className="text-sm uppercase tracking-[0.35em] text-[#C9A86A]"
          style={{ fontFamily: "Poppins" }}
        >
          Shop by Category
        </p>

        <h1
          className="mt-3 text-5xl leading-tight text-[#0F4C3A] sm:text-6xl"
          style={{ fontFamily: "Cormorant Garamond" }}
        >
          Explore Our Collections
        </h1>

        <p
          className="mt-5 text-base leading-7 text-gray-600 sm:text-lg"
          style={{ fontFamily: "Poppins" }}
        >
          Browse authentic Lucknowi Chikankari products by category and find
          the right collection for retail or wholesale requirements.
        </p>
      </div>
{isLoading && (
  <div className="mt-12 flex items-center justify-center gap-3 rounded-[28px] border border-[#E8DCC5] bg-white px-6 py-12 text-[#0F4C3A]">
    <Loader2 size={22} className="animate-spin" />
    <span>Loading categories...</span>
  </div>
)}

{errorMessage && !isLoading && (
  <div className="mt-12 flex items-center gap-3 rounded-[28px] border border-red-200 bg-red-50 px-6 py-5 text-sm text-red-700">
    <AlertCircle size={20} />
    {errorMessage}
  </div>
)}

{!isLoading && !errorMessage && categories.length === 0 && (
  <div className="mt-12 rounded-[28px] border border-[#E8DCC5] bg-white px-6 py-12 text-center">
    <FolderTree
      size={30}
      className="mx-auto text-[#0F4C3A]"
    />

    <p className="mt-4 font-semibold text-[#0F4C3A]">
      No categories available
    </p>

    <p className="mt-2 text-sm text-gray-600">
      Categories will appear here once they are published.
    </p>
  </div>
)}
      {!isLoading && !errorMessage && categories.length > 0 && (
  <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
    {categories.map((category) => (
          <Link
            key={category.slug}
            to={`/categories/${category.slug}`}
            className="group overflow-hidden rounded-[28px] border border-[#E8DCC5] bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
          >
            <div className="relative h-80 overflow-hidden bg-[#EFE8DB]">
              <img
                src={
  category.imageUrl ||
  "https://placehold.co/800x1000?text=MF+Chikankari"
}
                alt={`${category.name} collection`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h2
                  className="text-4xl text-white"
                  style={{ fontFamily: "Cormorant Garamond" }}
                >
                  {category.name}
                </h2>
              </div>
            </div>

            <div className="p-6">
              <p
                className="leading-7 text-gray-600"
                style={{ fontFamily: "Poppins" }}
              >
                {category.description}
              </p>

              <span
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0F4C3A] transition-colors group-hover:text-[#C9A86A]"
                style={{ fontFamily: "Poppins" }}
              >
                View Products
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </div>
          </Link>
        ))}
      </div>
      )}
    </section>
  );
}

export default CategoriesPage;