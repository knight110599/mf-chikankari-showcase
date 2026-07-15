import heroKurti from "../assets/images/products/hero-kurti.png";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Truck,
  Scissors,
  Store,
} from "lucide-react";

function Hero() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-112px)] max-w-7xl flex-col items-center gap-16 px-8 py-16 lg:flex-row lg:px-12">
      {/* Left Side */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 max-w-2xl"
      >
        <p
          className="mb-4 text-sm uppercase tracking-[0.4em] text-[#C9A86A]"
          style={{ fontFamily: "Poppins" }}
        >
          Lucknow • Since 1998
        </p>

        <h1
          className="text-6xl leading-tight text-[#0F4C3A]"
          style={{ fontFamily: "Cormorant Garamond" }}
        >
          Authentic
          <br />
          Lucknowi
          <br />
          Chikankari
        </h1>

        <p
          className="mt-6 text-lg leading-8 text-[#555]"
          style={{ fontFamily: "Poppins" }}
        >
          Premium Lucknowi Chikankari Kurtis, Suits &
          Handcrafted Collections for wholesalers,
          boutiques and resellers across India.
        </p>
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.8 }}
  className="mt-8 flex justify-center lg:hidden"
>
  <div className="w-full max-w-[340px] overflow-hidden rounded-[30px] border border-[#D9C8A8] bg-[#EFE8DB] p-4 shadow-xl">
    <img
      src={heroKurti}
      alt="MF Chikankari Kurti"
      className="h-auto w-full object-contain"
    />
  </div>
</motion.div>
        <div className="mt-10 flex gap-4">
  <a
    href="#collections"
    className="flex items-center gap-2 rounded-full bg-[#0F4C3A] px-8 py-4 text-white transition hover:scale-105 hover:bg-[#0a3d2f]"
  >
    Explore Collection
    <ArrowRight size={18} />
  </a>

  <a
    href="#contact"
    className="rounded-full border border-[#0F4C3A] px-8 py-4 text-[#0F4C3A] transition hover:bg-[#0F4C3A] hover:text-white"
  >
    Contact Us
  </a>
</div>

        <div
          className="mt-10 flex flex-col gap-4 sm:flex-row"
          style={{ fontFamily: "Poppins" }}
        >
          <div className="flex items-center gap-4 rounded-xl border border-[#E8DCC5] bg-white/50 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg">
            <span className="text-2xl"><Sparkles className="text-[#C9A86A]" /></span>
            <div>
              <h4 className="font-semibold text-[#0F4C3A]">500+ Designs</h4>
              <p className="text-sm text-gray-500">Latest Collections</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-[#E8DCC5] bg-white/50 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg">
            <span className="text-2xl"><Truck className="text-[#0F4C3A]" /></span>
            <div>
              <h4 className="font-semibold text-[#0F4C3A]">Pan India</h4>
              <p className="text-sm text-gray-500">Wholesale Delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-[#E8DCC5] bg-white/50 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg">
            <span className="text-2xl"><Scissors className="text-[#0F4C3A]" /></span>
            <div>
              <h4 className="font-semibold text-[#0F4C3A]">Handcrafted</h4>
              <p className="text-sm text-gray-500">Authentic Chikankari</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-[#E8DCC5] bg-white/50 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg">
            <span className="text-2xl"><Store className="text-[#0F4C3A]" /></span>
            <div>
              <h4 className="font-semibold text-[#0F4C3A]">Trusted Since 1998</h4>
              <p className="text-sm text-gray-500">Lucknow Heritage</p>
            </div>
          </div>
        </div>
      </motion.div>
      {/* Right Side */}
      {/* Right Side - Desktop */}
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 1 }}
  className="hidden flex-1 justify-center lg:flex lg:justify-end"
>
  <div className="h-[520px] w-[420px] overflow-hidden rounded-[40px] border border-[#D9C8A8] bg-[#EFE8DB] p-6 shadow-2xl">
    <img
      src={heroKurti}
      alt="MF Chikankari Kurti"
      className="h-full w-full object-contain"
    />
  </div>
</motion.div>
    </section>
  );
}

export default Hero;