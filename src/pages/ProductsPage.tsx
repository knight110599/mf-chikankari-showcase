import ProductCard from "../components/product/ProductCard";
import { products } from "../data/products";

function ProductsPage() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.35em] text-[#C9A86A]">
          Shop Collection
        </p>

        <h1
          className="mt-3 text-5xl leading-tight text-[#0F4C3A] sm:text-6xl"
          style={{ fontFamily: "Cormorant Garamond" }}
        >
          All Products
        </h1>

        <p className="mt-5 text-lg leading-8 text-gray-600">
          Explore authentic Lucknowi Chikankari kurtis, suit sets, dupattas
          and handcrafted collections.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default ProductsPage;