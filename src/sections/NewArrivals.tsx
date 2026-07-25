import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

import ProductCard from "../components/product/ProductCard";
import {
  getNewArrivalProducts,
  type ApiProduct,
} from "../services/product.service";

function NewArrivals() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadNewArrivalProducts() {
      try {
        setLoading(true);
        setError(null);

        const response = await getNewArrivalProducts();

        if (isMounted) {
          setProducts(response.data);
        }
      } catch (caughtError) {
        if (isMounted) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Unable to load new arrival products.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadNewArrivalProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      id="new-arrivals"
      className="overflow-hidden bg-white py-20 sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.25 }}
          className="grid gap-8 border-b border-[#D9C8A8] pb-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-16 lg:pb-14"
        >
          <div>
            <div className="mb-6 h-px w-16 bg-[#C9A86A]" />

            <p
              className="text-xs font-medium uppercase tracking-[0.38em] text-[#B38E49] sm:text-sm"
              style={{ fontFamily: "Poppins" }}
            >
              New Arrivals
            </p>

            <h2
              className="mt-5 max-w-xl text-[46px] leading-[0.98] tracking-[-0.025em] text-[#0F4C3A] sm:text-6xl lg:text-[74px]"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              Fresh pieces,
              <br />
              timeless elegance.
            </h2>
          </div>

          <div className="lg:justify-self-end">
            <p
              className="max-w-2xl text-base leading-8 text-[#59635F] sm:text-lg"
              style={{ fontFamily: "Poppins" }}
            >
              Explore our latest handcrafted Chikankari designs, created with
              delicate embroidery, refined fabrics and the enduring character
              of Lucknowi craft.
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
        </motion.div>

        {loading ? (
          <div className="mt-12 flex min-h-64 items-center justify-center gap-3 border border-[#D9C8A8] bg-[#F8F5F0] text-[#0F4C3A]">
            <Loader2 size={22} className="animate-spin" />

            <p style={{ fontFamily: "Poppins" }}>
              Loading new arrivals...
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
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.65,
                  delay: index * 0.05,
                  ease: "easeOut",
                }}
                viewport={{ once: true, amount: 0.15 }}
              >
                <ProductCard
  product={product}
  showFeaturedBadge={false}
  showNewArrivalBadge
/>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="mt-12 border border-[#D9C8A8] bg-[#F8F5F0] p-12 text-center">
            <h3
              className="text-4xl text-[#0F4C3A]"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              No New Arrivals
            </h3>

            <p
              className="mt-3 text-gray-600"
              style={{ fontFamily: "Poppins" }}
            >
              New arrival products will appear here once they are published.
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

export default NewArrivals;