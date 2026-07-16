import { Link } from "react-router-dom";
import SectionTitle from "../components/ui/SectionTitle";
import ProductCard from "../components/product/ProductCard";
import { products } from "../data/products";

function FeaturedCollections() {
  const featuredProducts = products.filter((product) => product.featured);

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <SectionTitle
        subtitle="Featured"
        title="Popular Collections"
        description="Explore our most loved handcrafted Chikankari collections for boutiques, wholesalers and retailers."
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Link
          to="/products"
          className="rounded-full bg-[#0F4C3A] px-8 py-4 font-semibold text-white transition hover:-translate-y-1 hover:bg-[#0A3D2F]"
        >
          View All Products
        </Link>
      </div>
    </section>
  );
}

export default FeaturedCollections;