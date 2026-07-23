import { motion } from "framer-motion";
import {
  Brush,
  Handshake,
  PackageCheck,
  Scissors,
  Store,
  Truck,
} from "lucide-react";

const features = [
  {
    icon: Scissors,
    number: "01",
    title: "Hand Embroidery",
    description:
      "Authentic Lucknowi Chikankari craftsmanship with fine handcrafted detailing.",
  },
  {
    icon: PackageCheck,
    number: "02",
    title: "Premium Quality",
    description:
      "Soft fabrics, refined finishing and carefully selected materials for lasting comfort.",
  },
  {
    icon: Store,
    number: "03",
    title: "Wholesale Orders",
    description:
      "Special pricing and reliable bulk-order support for boutiques and resellers.",
  },
  {
    icon: Brush,
    number: "04",
    title: "Custom Designs",
    description:
      "Customized patterns and curated collections tailored to business requirements.",
  },
  {
    icon: Truck,
    number: "05",
    title: "Pan India Delivery",
    description:
      "Dependable delivery support for customers and wholesale partners across India.",
  },
  {
    icon: Handshake,
    number: "06",
    title: "Trusted Partnership",
    description:
      "Transparent pricing, dependable service and relationships designed for the long term.",
  },
];

function WhyChoose() {
  return (
    <section
      id="why-us"
      className="overflow-hidden bg-white py-20 sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.25 }}
            className="lg:sticky lg:top-32 lg:self-start"
          >
            <div className="mb-6 h-px w-16 bg-[#C9A86A]" />

            <p
              className="text-xs font-medium uppercase tracking-[0.38em] text-[#B38E49] sm:text-sm"
              style={{ fontFamily: "Poppins" }}
            >
              Why Choose Us
            </p>

            <h2
              className="mt-5 max-w-xl text-[46px] leading-[0.98] tracking-[-0.025em] text-[#0F4C3A] sm:text-6xl lg:text-[74px]"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              Crafted with care.
              <br />
              Built on trust.
            </h2>

            <p
              className="mt-8 max-w-lg text-base leading-8 text-[#59635F] sm:text-lg"
              style={{ fontFamily: "Poppins" }}
            >
              We combine traditional craftsmanship, refined materials and
              dependable service to create a seamless experience for individual
              customers, boutiques and wholesale partners.
            </p>

            <div className="mt-10 border-l border-[#D9C8A8] pl-6">
              <p
                className="text-5xl leading-none text-[#0F4C3A]"
                style={{ fontFamily: "Cormorant Garamond" }}
              >
                6
              </p>

              <p
                className="mt-2 text-xs font-medium uppercase tracking-[0.24em] text-[#8A918D]"
                style={{ fontFamily: "Poppins" }}
              >
                Reasons to choose MF
              </p>
            </div>
          </motion.div>

          <div className="border-t border-[#D9C8A8]">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.article
                  key={feature.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.06,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true, amount: 0.2 }}
                  className="group grid gap-5 border-b border-[#D9C8A8] py-7 sm:grid-cols-[72px_68px_1fr] sm:items-start sm:gap-6 sm:py-8"
                >
                  <span
                    className="text-xs font-semibold tracking-[0.24em] text-[#B38E49]"
                    style={{ fontFamily: "Poppins" }}
                  >
                    {feature.number}
                  </span>

                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#D9C8A8] text-[#0F4C3A] transition-all duration-300 group-hover:border-[#0F4C3A] group-hover:bg-[#0F4C3A] group-hover:text-white">
                    <Icon size={22} strokeWidth={1.5} />
                  </div>

                  <div>
                    <h3
                      className="text-3xl leading-none text-[#0F4C3A] transition-colors duration-300 group-hover:text-[#B38E49] sm:text-4xl"
                      style={{ fontFamily: "Cormorant Garamond" }}
                    >
                      {feature.title}
                    </h3>

                    <p
                      className="mt-3 max-w-2xl text-sm leading-7 text-[#6C746F] sm:text-base"
                      style={{ fontFamily: "Poppins" }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyChoose;