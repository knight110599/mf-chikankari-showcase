import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import { products } from "../data/products";

function CategoryProductsPage() {
  const { slug } = useParams();

  const categoryName = slug
    ? slug.charAt(0).toUpperCase() + slug.slice(1)
    : "";

  const filteredProducts = products.filter(
    (product) => product.category.toLowerCase() === slug?.toLowerCase(),
  );

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="mb-8 text-sm text-gray-500">
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
        <p className="text-sm uppercase tracking-[0.35em] text-[#C9A86A]">
          Category
        </p>

        <h1
          className="mt-3 text-5xl leading-tight text-[#0F4C3A] sm:text-6xl"
          style={{ fontFamily: "Cormorant Garamond" }}
        >
          {categoryName}
        </h1>

        <p className="mt-5 text-lg leading-8 text-gray-600">
          Explore our handcrafted {categoryName.toLowerCase()} collection.
        </p>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-[28px] border border-[#E8DCC5] bg-white p-8">
          <h2
            className="text-3xl text-[#0F4C3A]"
            style={{ fontFamily: "Cormorant Garamond" }}
          >
            No products found
          </h2>

          <p className="mt-3 text-gray-600">
            Products for this category will be added soon.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex rounded-full bg-[#0F4C3A] px-6 py-3 text-white"
          >
            View All Products
          </Link>
        </div>
      )}
    </section>
  );
}

export default CategoryProductsPage;