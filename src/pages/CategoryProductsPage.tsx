import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import {
  getProducts,
  type ApiProduct,
} from "../services/product.service";

function CategoryProductsPage() {
  const { slug } = useParams<{ slug: string }>();

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  }, []);

  const filteredProducts = useMemo(() => {
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

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div
        className="mb-8 text-sm text-gray-500"
        style={{ fontFamily: "Poppins" }}
      >
        <Link to="/" className="hover:text-[#0F4C3A]">
          Home
        </Link>

        <span className="mx-2">/</span>

        <Link to="/categories" className="hover:text-[#0F4C3A]">
          Categories
        </Link>

        <span className="mx-2">/</span>

        <span className="text-[#0F4C3A]">{categoryName}</span>
      </div>

      <div className="max-w-3xl">
        <p
          className="text-sm uppercase tracking-[0.35em] text-[#C9A86A]"
          style={{ fontFamily: "Poppins" }}
        >
          Category
        </p>

        <h1
          className="mt-3 text-5xl leading-tight text-[#0F4C3A] sm:text-6xl"
          style={{ fontFamily: "Cormorant Garamond" }}
        >
          {categoryName}
        </h1>

        <p
          className="mt-5 text-lg leading-8 text-gray-600"
          style={{ fontFamily: "Poppins" }}
        >
          Explore our handcrafted {categoryName.toLowerCase()} collection.
        </p>
      </div>

      {loading && (
        <div className="mt-12 rounded-[28px] border border-[#E8DCC5] bg-white p-10 text-center">
          <p
            className="text-gray-600"
            style={{ fontFamily: "Poppins" }}
          >
            Loading category products...
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="mt-12 rounded-[28px] border border-red-200 bg-white p-8 text-center sm:p-12">
          <h2
            className="text-3xl text-[#0F4C3A]"
            style={{ fontFamily: "Cormorant Garamond" }}
          >
            Unable to load products
          </h2>

          <p
            className="mt-3 text-gray-600"
            style={{ fontFamily: "Poppins" }}
          >
            {error}
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex rounded-full bg-[#0F4C3A] px-6 py-3 font-semibold text-white transition hover:bg-[#0A3D2F]"
            style={{ fontFamily: "Poppins" }}
          >
            View All Products
          </Link>
        </div>
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <div className="mt-12 rounded-[28px] border border-[#E8DCC5] bg-white p-8 text-center sm:p-12">
          <h2
            className="text-3xl text-[#0F4C3A]"
            style={{ fontFamily: "Cormorant Garamond" }}
          >
            No products found
          </h2>

          <p
            className="mt-3 text-gray-600"
            style={{ fontFamily: "Poppins" }}
          >
            Products for this category will be added soon.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex rounded-full bg-[#0F4C3A] px-6 py-3 font-semibold text-white transition hover:bg-[#0A3D2F]"
            style={{ fontFamily: "Poppins" }}
          >
            View All Products
          </Link>
        </div>
      )}
    </section>
  );
}

export default CategoryProductsPage;