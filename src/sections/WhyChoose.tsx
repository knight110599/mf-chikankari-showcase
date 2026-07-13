import SectionTitle from "../components/ui/SectionTitle";
import FeatureCard from "../components/ui/FeatureCard";

function WhyChoose() {
  return (
    <section
      id="why-us"
      className="mx-auto max-w-7xl px-8 py-24 lg:px-12"
    >
      <SectionTitle
        subtitle="Why Choose Us"
        title="Why MF Chikankari"
        description="We bring together traditional Lucknowi craftsmanship, premium quality fabrics and reliable wholesale service for boutiques and resellers across India."
      />

      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          icon="🧵"
          title="Hand Embroidery"
          description="Every design reflects authentic Lucknowi Chikankari craftsmanship with fine handcrafted detailing."
        />

        <FeatureCard
          icon="✨"
          title="Premium Quality"
          description="Soft fabrics, elegant finishing and carefully selected materials for lasting comfort."
        />

        <FeatureCard
          icon="🏪"
          title="Wholesale Orders"
          description="Special pricing and bulk order support for retailers, boutiques and resellers."
        />

        <FeatureCard
          icon="🎨"
          title="Custom Designs"
          description="We also provide customized patterns and collections based on business requirements."
        />

        <FeatureCard
          icon="🚚"
          title="Pan India Delivery"
          description="Reliable delivery network to serve customers and wholesale partners across India."
        />

        <FeatureCard
          icon="🤝"
          title="Trusted Partnership"
          description="We focus on long-term relationships through transparent pricing and dependable service."
        />
      </div>
    </section>
  );
}

export default WhyChoose;