import {
  Brush,
  Handshake,
  PackageCheck,
  Scissors,
  Store,
  Truck,
} from "lucide-react";
import SectionTitle from "../components/ui/SectionTitle";
import FeatureCard from "../components/ui/FeatureCard";

const features = [
  {
    icon: <Scissors size={26} />,
    title: "Hand Embroidery",
    description:
      "Every design reflects authentic Lucknowi Chikankari craftsmanship with fine handcrafted detailing.",
  },
  {
    icon: <PackageCheck size={26} />,
    title: "Premium Quality",
    description:
      "Soft fabrics, elegant finishing and carefully selected materials for lasting comfort.",
  },
  {
    icon: <Store size={26} />,
    title: "Wholesale Orders",
    description:
      "Special pricing and bulk order support for retailers, boutiques and resellers.",
  },
  {
    icon: <Brush size={26} />,
    title: "Custom Designs",
    description:
      "We also provide customized patterns and collections based on business requirements.",
  },
  {
    icon: <Truck size={26} />,
    title: "Pan India Delivery",
    description:
      "Reliable delivery support for customers and wholesale partners across India.",
  },
  {
    icon: <Handshake size={26} />,
    title: "Trusted Partnership",
    description:
      "We focus on long-term relationships through transparent pricing and dependable service.",
  },
];

function WhyChoose() {
  return (
    <section
      id="why-us"
      className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20 lg:px-12 lg:py-24"
    >
      <SectionTitle
        subtitle="Why Choose Us"
        title="Why MF Chikankari"
        description="We bring together traditional Lucknowi craftsmanship, premium quality fabrics and reliable wholesale service for boutiques and resellers across India."
      />

      <div className="mt-10 grid items-stretch gap-5 sm:mt-12 md:grid-cols-2 md:gap-6 lg:mt-14 lg:grid-cols-3 lg:gap-8">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
}

export default WhyChoose;