import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import brandStory from "../assets/images/brand-story.jpg";

function BrandStory() {
  return (
    <section
      id="brand-story"
      className="bg-white py-24"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-8 lg:grid-cols-2 lg:px-12">

        {/* Left Image */}

        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute -left-6 -top-6 h-40 w-40 rounded-full bg-[#C9A86A]/20 blur-3xl"></div>

          <div className="overflow-hidden rounded-[40px] border border-[#E8DCC5] bg-[#F8F5F0] p-5 shadow-2xl">

            <img
              src={brandStory}
              alt="MF Chikankari"
              className="h-[620px] w-full rounded-[28px] object-cover"
            />

          </div>
        </motion.div>

        {/* Right Content */}

        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >

          <p
            className="mb-4 text-sm uppercase tracking-[0.4em] text-[#C9A86A]"
            style={{ fontFamily: "Poppins" }}
          >
            Our Story
          </p>

          <h2
            className="text-6xl leading-tight text-[#0F4C3A]"
            style={{ fontFamily: "Cormorant Garamond" }}
          >
            Authentic Lucknowi
            <br />
            Chikankari,
            <br />
            Crafted with Passion
          </h2>

          <p
            className="mt-8 text-lg leading-9 text-[#555]"
            style={{ fontFamily: "Poppins" }}
          >
            MF Chikankari celebrates the timeless beauty of traditional
            Lucknowi embroidery by bringing together skilled craftsmanship,
            premium fabrics and elegant contemporary designs.
          </p>

          <p
            className="mt-6 text-lg leading-9 text-[#555]"
            style={{ fontFamily: "Poppins" }}
          >
            Whether you are a boutique owner, reseller or fashion enthusiast,
            our collections are thoughtfully curated to deliver quality,
            authenticity and elegance in every piece.
          </p>

          <div className="mt-10 grid gap-5">
            <div className="flex items-start gap-4">
              <CheckCircle className="mt-1 text-[#0F4C3A]" size={22} />

              <div>
                <h3
                  className="text-xl text-[#0F4C3A]"
                  style={{ fontFamily: "Cormorant Garamond" }}
                >
                  Authentic Hand Embroidery
                </h3>

                <p
                  className="mt-2 text-[#666]"
                  style={{ fontFamily: "Poppins" }}
                >
                  Crafted with traditional Lucknowi Chikankari techniques.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle className="mt-1 text-[#0F4C3A]" size={22} />

              <div>
                <h3
                  className="text-xl text-[#0F4C3A]"
                  style={{ fontFamily: "Cormorant Garamond" }}
                >
                  Premium Quality Fabrics
                </h3>

                <p
                  className="mt-2 text-[#666]"
                  style={{ fontFamily: "Poppins" }}
                >
                  Comfortable, elegant and carefully selected materials.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle className="mt-1 text-[#0F4C3A]" size={22} />

              <div>
                <h3
                  className="text-xl text-[#0F4C3A]"
                  style={{ fontFamily: "Cormorant Garamond" }}
                >
                  Wholesale Friendly
                </h3>

                <p
                  className="mt-2 text-[#666]"
                  style={{ fontFamily: "Poppins" }}
                >
                  Supporting boutiques and resellers with premium collections.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle className="mt-1 text-[#0F4C3A]" size={22} />

              <div>
                <h3
                  className="text-xl text-[#0F4C3A]"
                  style={{ fontFamily: "Cormorant Garamond" }}
                >
                  Pan India Delivery
                </h3>

                <p
                  className="mt-2 text-[#666]"
                  style={{ fontFamily: "Poppins" }}
                >
                  Delivering handcrafted elegance across the country.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex gap-5">
            <button
              className="rounded-full bg-[#0F4C3A] px-8 py-4 text-white transition duration-300 hover:scale-105"
              style={{ fontFamily: "Poppins" }}
            >
              Explore Collection
            </button>

            <button
              className="rounded-full border border-[#0F4C3A] px-8 py-4 text-[#0F4C3A] transition duration-300 hover:bg-[#0F4C3A] hover:text-white"
              style={{ fontFamily: "Poppins" }}
            >
              Contact Us
            </button>
          </div>

        </motion.div>
      </div>
    </section>
  );
}

export default BrandStory;