import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import brandStory from "../assets/images/brand-story.jpg";

const storyHighlights = [
  {
    number: "01",
    title: "Authentic Craft",
    description:
      "Traditional Lucknowi Chikankari techniques carried forward with care.",
  },
  {
    number: "02",
    title: "Premium Fabrics",
    description:
      "Thoughtfully selected materials designed for comfort and elegance.",
  },
  {
    number: "03",
    title: "Wholesale Ready",
    description:
      "Curated collections created for boutiques, retailers and resellers.",
  },
];

function BrandStory() {
  return (
    <section
      id="brand-story"
      className="overflow-hidden bg-[#F8F5F0] py-20 sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.25 }}
            className="relative"
          >
            <div className="absolute -left-8 top-12 hidden h-48 w-48 rounded-full bg-[#C9A86A]/15 blur-3xl lg:block" />

            <div className="relative overflow-hidden rounded-[32px] bg-[#E9E0D2] shadow-xl">
              <img
                src={brandStory}
                alt="Traditional Lucknowi Chikankari craftsmanship"
                className="aspect-[4/5] h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

              <div className="absolute bottom-8 left-8 border border-white/40 bg-white/90 px-7 py-5 backdrop-blur-md sm:bottom-8 sm:left-8">
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#B38E49]"
                  style={{ fontFamily: "Poppins" }}
                >
                  Rooted in Lucknow
                </p>

                <p
                  className="mt-2 text-4xl leading-none text-[#0F4C3A] sm:text-4xl"
                  style={{ fontFamily: "Cormorant Garamond" }}
                >
                  Since 1998
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.25 }}
          >
            <div className="mb-6 h-px w-16 bg-[#C9A86A]" />

            <p
              className="text-xs font-medium uppercase tracking-[0.38em] text-[#B38E49] sm:text-sm"
              style={{ fontFamily: "Poppins" }}
            >
              Our Story
            </p>

            <h2
              className="mt-5 max-w-3xl text-[46px] leading-[0.98] tracking-[-0.025em] text-[#0F4C3A] sm:text-6xl lg:text-[76px]"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              A legacy shaped
              <br />
              by hand
            </h2>

            <div
              className="mt-8 space-y-6 text-base leading-8 text-[#59635F] sm:text-lg"
              style={{ fontFamily: "Poppins" }}
            >
              <p>
                MF Chikankari celebrates the enduring beauty of traditional
                Lucknowi embroidery through carefully crafted silhouettes,
                premium fabrics and refined contemporary design.
              </p>

              <p>
                From individual customers to boutiques and wholesale partners,
                every collection is created to deliver authenticity, quality
                and timeless elegance.
              </p>
            </div>

            <div className="mt-10 border-y border-[#D9C8A8]">
              {storyHighlights.map((item) => (
                <div
                  key={item.number}
                  className="grid gap-4 border-b border-[#D9C8A8] py-6 last:border-b-0 sm:grid-cols-[72px_1fr] sm:items-start"
                >
                  <span
                    className="text-xs font-semibold tracking-[0.22em] text-[#B38E49]"
                    style={{ fontFamily: "Poppins" }}
                  >
                    {item.number}
                  </span>

                  <div>
                    <h3
                      className="text-3xl leading-none text-[#0F4C3A]"
                      style={{ fontFamily: "Cormorant Garamond" }}
                    >
                      {item.title}
                    </h3>

                    <p
                      className="mt-3 max-w-xl text-sm leading-7 text-[#6C746F]"
                      style={{ fontFamily: "Poppins" }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/products"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#0F4C3A] px-7 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#0A3D2F]"
                style={{ fontFamily: "Poppins" }}
              >
                Explore Collection

                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/contact"
                className="inline-flex min-h-14 items-center justify-center rounded-full border border-[#0F4C3A] px-7 text-sm font-semibold text-[#0F4C3A] transition-all duration-300 hover:bg-[#0F4C3A] hover:text-white"
                style={{ fontFamily: "Poppins" }}
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default BrandStory;