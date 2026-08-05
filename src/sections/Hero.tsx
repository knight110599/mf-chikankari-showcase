import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import heroHome from "../assets/images/hero/hero-home.webp";

function Hero() {
  return (
    <section className="overflow-hidden bg-[#F8F5F0]">
      <div className="mx-auto max-w-[1750px] px-3 pb-8 pt-3 sm:px-6 sm:pb-12 sm:pt-4 lg:px-10 lg:pb-16">
        <div className="grid overflow-hidden border border-[#E8DCC5] bg-[#F8F5F0] shadow-[0_24px_70px_rgba(15,76,58,0.12)] lg:min-h-[640px] lg:grid-cols-[42%_58%]">
          {/* Mobile image first / Desktop image right */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 1.05,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative order-1 min-h-[360px] sm:min-h-[500px] lg:order-2 lg:min-h-[660px]"
          >
            <img
              src={heroHome}
              alt="Woman wearing handcrafted Lucknowi Chikankari in a heritage setting"
              className="absolute inset-0 h-full w-full object-cover object-[48%_center] sm:object-[48%_center] lg:object-[45%_center]"
            />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent p-5 sm:p-8">
              <p
                className="text-[10px] uppercase tracking-[0.28em] text-white/90 sm:text-xs sm:tracking-[0.32em]"
                style={{
                  fontFamily: "Poppins",
                }}
              >
                Heritage • Craft • Elegance
              </p>
            </div>
          </motion.div>

          {/* Mobile content second / Desktop content left */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.12,
              ease: "easeOut",
            }}
            className="relative z-10 order-2 flex flex-col justify-center px-6 py-12 sm:px-10 sm:py-16 lg:order-1 lg:px-16 lg:py-24 xl:px-24"
          >
            <div className="mb-6 h-px w-16 bg-[#C9A86A] sm:mb-8 sm:w-20" />

            <p
              className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#B38E49] sm:text-sm sm:tracking-[0.42em]"
              style={{
                fontFamily: "Poppins",
              }}
            >
              Lucknow • Since 1998
            </p>

            <h1
              className="mt-5 max-w-[520px] text-[42px] leading-[0.98] tracking-[-0.035em] text-[#0F4C3A] sm:text-6xl lg:text-[72px]"
              style={{
                fontFamily:
                  "Cormorant Garamond",
              }}
            >
              Timeless Chikankari,
              <br />
              Crafted in Lucknow
            </h1>

            <p
              className="mt-6 max-w-lg text-[15px] leading-7 text-[#4F5A56] sm:mt-7 sm:text-lg sm:leading-8"
              style={{
                fontFamily: "Poppins",
              }}
            >
              Discover handcrafted Lucknowi
              Chikankari shaped by heritage,
              refined craftsmanship and
              contemporary elegance.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                to="/products"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#0F4C3A] px-8 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0A3D2F] hover:shadow-xl"
                style={{
                  fontFamily: "Poppins",
                }}
              >
                Explore Collection

                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/contact"
                className="inline-flex min-h-14 items-center justify-center rounded-full border border-[#0F4C3A]/50 px-8 font-medium text-[#0F4C3A] transition-all duration-300 hover:bg-[#0F4C3A] hover:text-white"
                style={{
                  fontFamily: "Poppins",
                }}
              >
                Contact Us
              </Link>
            </div>

            <div
              className="mt-10 grid grid-cols-3 gap-3 border-t border-[#D9C8A8] pt-6 sm:gap-4"
              style={{
                fontFamily: "Poppins",
              }}
            >
              <div>
                <p className="text-lg font-semibold text-[#0F4C3A] sm:text-xl">
                  1998
                </p>

                <p className="mt-1 text-[11px] leading-5 text-[#6A746F] sm:text-xs">
                  Heritage since
                </p>
              </div>

              <div>
                <p className="text-lg font-semibold text-[#0F4C3A] sm:text-xl">
                  500+
                </p>

                <p className="mt-1 text-[11px] leading-5 text-[#6A746F] sm:text-xs">
                  Original designs
                </p>
              </div>

              <div>
                <p className="text-lg font-semibold text-[#0F4C3A] sm:text-xl">
                  Pan India
                </p>

                <p className="mt-1 text-[11px] leading-5 text-[#6A746F] sm:text-xs">
                  Delivery network
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;