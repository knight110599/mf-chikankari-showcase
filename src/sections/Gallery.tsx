import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import blueSuit from "../assets/images/Gallery/blue-suit.png";
import brownSuit from "../assets/images/Gallery/brown-suit.jpg";
import darkRedSuit from "../assets/images/Gallery/dark-red-suit.jpg";
import greenSuit from "../assets/images/Gallery/green-suit.jpg";
import lightGreenSuit from "../assets/images/Gallery/light-green-suit.jpg";
import purpleSuit from "../assets/images/Gallery/purple-suit.jpg";
import whiteSuit from "../assets/images/Gallery/white-suit.jpg";

const gallery = [
  {
    image: blueSuit,
    title: "Blue Chikankari Suit",
    className:
      "md:col-span-2 md:row-span-2 md:min-h-[720px] lg:col-span-2 lg:row-span-2",
  },
  {
    image: brownSuit,
    title: "Brown Chikankari Suit",
    className: "min-h-[360px]",
  },
  {
    image: darkRedSuit,
    title: "Dark Red Chikankari Suit",
    className: "min-h-[360px]",
  },
  {
    image: greenSuit,
    title: "Green Chikankari Suit",
    className: "min-h-[420px]",
  },
  {
    image: lightGreenSuit,
    title: "Light Green Chikankari Suit",
    className: "min-h-[420px]",
  },
  {
    image: purpleSuit,
    title: "Purple Chikankari Suit",
    className: "min-h-[420px]",
  },
  {
    image: whiteSuit,
    title: "White Chikankari Suit",
    className: "min-h-[420px]",
  },
];

function Gallery() {
  return (
    <section
      id="gallery"
      className="overflow-hidden bg-white py-20 sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.25 }}
          className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-16"
        >
          <div>
            <div className="mb-6 h-px w-16 bg-[#C9A86A]" />

            <p
              className="text-xs font-medium uppercase tracking-[0.38em] text-[#B38E49] sm:text-sm"
              style={{ fontFamily: "Poppins" }}
            >
              The Collection
            </p>

            <h2
              className="mt-5 max-w-xl text-[46px] leading-[0.98] tracking-[-0.025em] text-[#0F4C3A] sm:text-6xl lg:text-[74px]"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              Crafted details,
              <br />
              timeless elegance.
            </h2>
          </div>

          <p
            className="max-w-2xl text-base leading-8 text-[#59635F] sm:text-lg lg:justify-self-end"
            style={{ fontFamily: "Poppins" }}
          >
            A closer look at our handcrafted Chikankari collections, shaped by
            delicate embroidery, refined fabrics and the enduring character of
            Lucknowi craft.
          </p>
        </motion.div>

        <div className="mt-14 grid auto-rows-[1fr] gap-5 md:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-6">
          {gallery.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.65,
                delay: index * 0.05,
                ease: "easeOut",
              }}
              viewport={{ once: true, amount: 0.15 }}
              className={`group relative overflow-hidden bg-[#E9E0D2] ${item.className}`}
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent transition-opacity duration-500 group-hover:opacity-90" />

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
                <div>
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/70"
                    style={{ fontFamily: "Poppins" }}
                  >
                    Look {String(index + 1).padStart(2, "0")}
                  </p>

                  <h3
                    className="mt-2 text-3xl leading-none text-white sm:text-4xl"
                    style={{ fontFamily: "Cormorant Garamond" }}
                  >
                    {item.title}
                  </h3>
                </div>

                <div className="flex h-11 w-11 shrink-0 translate-y-2 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <ArrowUpRight size={18} />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Gallery;