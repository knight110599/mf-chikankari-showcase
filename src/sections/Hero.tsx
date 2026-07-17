import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Scissors,
  Sparkles,
  Store,
  Truck,
} from "lucide-react";
import heroKurti from "../assets/images/products/hero-kurti.png";

const highlights = [
  {
    icon: <Sparkles size={22} />,
    title: "500+ Designs",
    description: "Latest Collections",
    accent: true,
  },
  {
    icon: <Truck size={22} />,
    title: "Pan India",
    description: "Wholesale Delivery",
  },
  {
    icon: <Scissors size={22} />,
    title: "Handcrafted",
    description: "Authentic Chikankari",
  },
  {
    icon: <Store size={22} />,
    title: "Trusted Since 1998",
    description: "Lucknow Heritage",
  },
];

function Hero() {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-112px)] max-w-7xl items-center gap-12 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:px-12">
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-2xl"
      >
        <p
          className="mb-4 text-xs uppercase tracking-[0.35em] text-[#C9A86A] sm:text-sm sm:tracking-[0.4em]"
          style={{ fontFamily: "Poppins" }}
        >
          Lucknow • Since 1998
        </p>

        <h1
          className="text-5xl leading-[1.05] text-[#0F4C3A] sm:text-6xl lg:text-7xl"
          style={{ fontFamily: "Cormorant Garamond" }}
        >
          Authentic
          <br />
          Lucknowi
          <br />
          Chikankari
        </h1>

        <p
          className="mt-6 max-w-xl text-base leading-8 text-[#555] sm:text-lg"
          style={{ fontFamily: "Poppins" }}
        >
          Premium Lucknowi Chikankari kurtis, suits and handcrafted
          collections for wholesalers, boutiques and resellers across India.
        </p>

        {/* Mobile image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-8 lg:hidden"
        >
          <div className="mx-auto w-full max-w-[390px] overflow-hidden rounded-[30px] border border-[#D9C8A8] bg-[#EFE8DB] p-4 shadow-xl">
            <img
              src={heroKurti}
              alt="Handcrafted MF Chikankari outfit"
              className="aspect-[4/5] h-full w-full object-cover"
            />
          </div>
        </motion.div>

        {/* Actions */}
        <div className="mt-9 flex flex-col gap-4 sm:flex-row">
          <Link
            to="/products"
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#0F4C3A] px-8 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0A3D2F] hover:shadow-lg"
            style={{ fontFamily: "Poppins" }}
          >
            Explore Products
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/contact"
            className="inline-flex min-h-14 items-center justify-center rounded-full border border-[#0F4C3A] px-8 font-medium text-[#0F4C3A] transition-all duration-300 hover:bg-[#0F4C3A] hover:text-white"
            style={{ fontFamily: "Poppins" }}
          >
            Contact Us
          </Link>
        </div>

        {/* Highlights */}
        <div
          className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2"
          style={{ fontFamily: "Poppins" }}
        >
          {highlights.map((item) => (
            <div
              key={item.title}
              className="flex min-h-[92px] items-center gap-4 rounded-2xl border border-[#E8DCC5] bg-white/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F8F5F0] ${
                  item.accent ? "text-[#C9A86A]" : "text-[#0F4C3A]"
                }`}
              >
                {item.icon}
              </div>

              <div>
                <h2 className="font-semibold text-[#0F4C3A]">
                  {item.title}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Desktop image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="hidden justify-end lg:flex"
      >
        <div className="h-[560px] w-full max-w-[440px] overflow-hidden rounded-[40px] border border-[#D9C8A8] bg-[#EFE8DB] p-6 shadow-2xl">
          <img
            src={heroKurti}
            alt="Handcrafted MF Chikankari outfit"
            className="h-full w-full object-cover"
          />
        </div>
      </motion.div>
    </section>
  );
}

export default Hero;