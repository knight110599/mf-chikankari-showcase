import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import SectionTitle from "../components/ui/SectionTitle";
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
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <SectionTitle
        subtitle="Featured"
        title="Popular Collections"
        description="Explore our most loved handcrafted Chikankari collections for boutiques, wholesalers and retailers."
      />

      {loading ? (
        <div className="mt-12 rounded-[28px] border border-[#E8DCC5] bg-white p-10 text-center">
          <p
            className="text-gray-600"
            style={{ fontFamily: "Poppins" }}
          >
            Loading featured products...
          </p>
        </div>
      ) : error ? (
        <div className="mt-12 rounded-[28px] border border-red-200 bg-white p-10 text-center">
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
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-[28px] border border-[#E8DCC5] bg-white p-10 text-center">
          <h3
            className="text-3xl text-[#0F4C3A]"
            style={{ fontFamily: "Cormorant Garamond" }}
          >
            No Featured Products
          </h3>

          <p
            className="mt-3 text-gray-600"
            style={{ fontFamily: "Poppins" }}
          >
            Featured products will appear here once they are added.
          </p>
        </div>
      )}

      <div className="mt-12 flex justify-center">
        <Link
          to="/products"
          className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#0F4C3A] px-8 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#0A3D2F] hover:shadow-lg"
          style={{ fontFamily: "Poppins" }}
        >
          View All Products
        </Link>
      </div>
    </section>
  );
}

export default FeaturedCollections;