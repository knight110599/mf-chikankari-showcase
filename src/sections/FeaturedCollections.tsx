import SectionTitle from "../components/ui/SectionTitle";
import ProductCard from "../components/ui/ProductCard";

function FeaturedCollections() {
  return (
    <section className="mx-auto max-w-7xl px-8 py-24 lg:px-12">
      <SectionTitle
        subtitle="Featured"
        title="Popular Collections"
        description="Explore our most loved handcrafted Chikankari collections for boutiques, wholesalers and retailers."
      />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <ProductCard title="Women's Kurtis" count="120+ Designs" />
        <ProductCard title="Luxury Suit Sets" count="85+ Designs" />
        <ProductCard title="Dupattas" count="60+ Designs" />
        <ProductCard title="Men's Kurtas" count="40+ Designs" />
        <ProductCard title="Co-ord Sets" count="35+ Designs" />
        <ProductCard title="New Arrivals" count="Updated Weekly" />
      </div>
    </section>
  );
}

export default FeaturedCollections;