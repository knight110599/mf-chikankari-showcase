import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BadgeCheck,
  Boxes,
  ClipboardList,
  PackageCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

const processSteps = [
  {
    number: "01",
    icon: ShoppingBag,
    title: "Browse Collection",
    description:
      "Explore our curated range of handcrafted Chikankari pieces and shortlist the styles that fit your store.",
  },
  {
    number: "02",
    icon: ClipboardList,
    title: "Share Requirement",
    description:
      "Tell us your preferred designs, quantities, sizes and any specific wholesale requirements.",
  },
  {
    number: "03",
    icon: Boxes,
    title: "Confirm Your Order",
    description:
      "We confirm availability, wholesale pricing, minimum quantity and the expected delivery timeline.",
  },
  {
    number: "04",
    icon: PackageCheck,
    title: "Quality Inspection",
    description:
      "Every item is carefully checked for fabric quality, embroidery detailing and finishing before dispatch.",
  },
  {
    number: "05",
    icon: Truck,
    title: "Secure Delivery",
    description:
      "Your order is packed securely and delivered to your business anywhere across India.",
  },
];

function WholesaleProcess() {
  return (
    <section
      id="process"
      className="overflow-hidden bg-[#F8F5F0] py-20 sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
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
              How It Works
            </p>

            <h2
              className="mt-5 max-w-xl text-[46px] leading-[0.98] tracking-[-0.025em] text-[#0F4C3A] sm:text-6xl lg:text-[74px]"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              Wholesale,
              <br />
              made simple.
            </h2>

            <p
              className="mt-8 max-w-lg text-base leading-8 text-[#59635F] sm:text-lg"
              style={{ fontFamily: "Poppins" }}
            >
              From selecting your collection to final delivery, our process is
              designed to stay clear, reliable and easy for every wholesale
              partner.
            </p>

            <div className="mt-10 flex items-start gap-4 border-l border-[#D9C8A8] pl-6">
              <BadgeCheck
                size={24}
                strokeWidth={1.5}
                className="mt-1 shrink-0 text-[#0F4C3A]"
              />

              <div>
                <p
                  className="text-2xl leading-none text-[#0F4C3A]"
                  style={{ fontFamily: "Cormorant Garamond" }}
                >
                  Transparent at every step
                </p>

                <p
                  className="mt-3 max-w-sm text-sm leading-7 text-[#6C746F]"
                  style={{ fontFamily: "Poppins" }}
                >
                  Clear product availability, pricing and timelines before the
                  order is confirmed.
                </p>
              </div>
            </div>

            <a
              href="https://wa.me/916386826199?text=Hello%20MF%20Chikankari%2C%20I%20am%20interested%20in%20your%20wholesale%20collection.%20Please%20share%20the%20catalogue%20and%20pricing."
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-10 inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#0F4C3A] px-7 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#0A3D2F]"
              style={{ fontFamily: "Poppins" }}
            >
              Start Wholesale Order

              <ArrowUpRight
                size={18}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </motion.div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute bottom-0 left-7 top-0 hidden w-px bg-[#D9C8A8] sm:block"
            />

            <div className="space-y-6 sm:space-y-8">
              {processSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <motion.article
                    key={step.number}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.07,
                      ease: "easeOut",
                    }}
                    viewport={{ once: true, amount: 0.2 }}
                    className="group relative grid gap-5 border-b border-[#D9C8A8] pb-7 sm:grid-cols-[58px_1fr] sm:gap-8 sm:pb-8"
                  >
                    <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-[#D9C8A8] bg-[#F8F5F0] text-[#0F4C3A] transition-all duration-300 group-hover:border-[#0F4C3A] group-hover:bg-[#0F4C3A] group-hover:text-white">
                      <Icon size={22} strokeWidth={1.5} />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p
                          className="text-xs font-semibold uppercase tracking-[0.24em] text-[#B38E49]"
                          style={{ fontFamily: "Poppins" }}
                        >
                          Step {step.number}
                        </p>

                        <span
                          className="text-5xl leading-none text-[#E0D5C3] transition-colors duration-300 group-hover:text-[#C9A86A]"
                          style={{ fontFamily: "Cormorant Garamond" }}
                        >
                          {step.number}
                        </span>
                      </div>

                      <h3
                        className="mt-2 text-3xl leading-none text-[#0F4C3A] transition-colors duration-300 group-hover:text-[#B38E49] sm:text-4xl"
                        style={{ fontFamily: "Cormorant Garamond" }}
                      >
                        {step.title}
                      </h3>

                      <p
                        className="mt-4 max-w-2xl text-sm leading-7 text-[#6C746F] sm:text-base"
                        style={{ fontFamily: "Poppins" }}
                      >
                        {step.description}
                      </p>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WholesaleProcess;