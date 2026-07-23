import { useEffect, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import {
  getFeaturedProducts,
  type ApiProduct,
} from "../services/product.service";

function FeaturedCollections() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadFeaturedProducts() {
      try {
        setLoading(true);
        setError(null);

        const response = await getFeaturedProducts();

        if (isMounted) {
          setProducts(response.data);
        }
      } catch (caughtError) {
        if (isMounted) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Unable to load featured products.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadFeaturedProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="overflow-hidden bg-[#EFE8DB] py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-8 border-b border-[#D9C8A8] pb-10 lg:grid-cols-[1fr_0.9fr] lg:items-end lg:pb-14">
          <div>
            <div className="mb-6 h-px w-16 bg-[#C9A86A]" />

            <p
              className="text-xs font-medium uppercase tracking-[0.38em] text-[#B38E49] sm:text-sm"
              style={{ fontFamily: "Poppins" }}
            >
              Featured Pieces
            </p>

            <h2
              className="mt-5 max-w-3xl text-[46px] leading-[0.98] tracking-[-0.025em] text-[#0F4C3A] sm:text-6xl lg:text-[76px]"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              Chosen for
              <br />
              modern wardrobes
            </h2>
          </div>

          <div className="lg:pb-2 lg:pl-12">
            <p
              className="max-w-xl text-base leading-8 text-[#59635F] sm:text-lg"
              style={{ fontFamily: "Poppins" }}
            >
              Discover our most admired Chikankari pieces, selected for their
              craftsmanship, versatility and timeless appeal.
            </p>

            <Link
              to="/products"
              className="group mt-7 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#0F4C3A] transition-colors duration-300 hover:text-[#B38E49]"
              style={{ fontFamily: "Poppins" }}
            >
              Explore all products

              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="mt-12 flex min-h-64 items-center justify-center gap-3 border border-[#D9C8A8] bg-white/60 text-[#0F4C3A]">
            <Loader2 size={22} className="animate-spin" />

            <p style={{ fontFamily: "Poppins" }}>
              Loading featured products...
            </p>
          </div>
        ) : error ? (
          <div className="mt-12 border border-red-200 bg-red-50 p-10 text-center">
            <h3
              className="text-3xl text-[#0F4C3A]"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              Unable to load products
            </h3>

            <p
              className="mt-3 text-gray-600"
              style={{ fontFamily: "Poppins" }}
            >
              {error}
            </p>
          </div>
        ) : products.length > 0 ? (
          <div className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-16">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="mt-12 border border-[#D9C8A8] bg-white/60 p-12 text-center">
            <h3
              className="text-4xl text-[#0F4C3A]"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              No Featured Products
            </h3>

            <p
              className="mt-3 text-gray-600"
              style={{ fontFamily: "Poppins" }}
            >
              Featured products will appear here once they are published.
            </p>
          </div>
        )}

        <div className="mt-14 flex justify-center lg:hidden">
          <Link
            to="/products"
            className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#0F4C3A] px-8 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#0A3D2F]"
            style={{ fontFamily: "Poppins" }}
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedCollections;