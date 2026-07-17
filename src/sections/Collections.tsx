import { Link } from "react-router-dom";
import kurtis from "/src/assets/images/kurtis.jpg";
import suits from "/src/assets/images/suits.jpg";
import dupattas from "/src/assets/images/dupattas.jpg";

const collections = [
  {
    title: "Women's Kurtis",
    desc: "Elegant everyday and festive Chikankari kurtis.",
    image: kurtis,
    slug: "kurtis",
  },
  {
    title: "Chikankari Suits",
    desc: "Premium handcrafted suit sets for refined occasions.",
    image: suits,
    slug: "suits",
  },
  {
    title: "Dupattas",
    desc: "Finely embroidered dupattas crafted with traditional detail.",
    image: dupattas,
    slug: "dupattas",
  },
];

function Collections() {
  return (
    <section
      id="collections"
      className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20 lg:px-12 lg:py-24"
    >
      <div className="max-w-3xl">
        <p
          className="text-xs uppercase tracking-[0.35em] text-[#C9A86A] sm:text-sm"
          style={{ fontFamily: "Poppins" }}
        >
          Our Collection
        </p>

        <h2
          className="mt-3 text-4xl leading-tight text-[#0F4C3A] sm:text-5xl lg:text-6xl"
          style={{ fontFamily: "Cormorant Garamond" }}
        >
          Crafted for Every Occasion
        </h2>

        <p
          className="mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg"
          style={{ fontFamily: "Poppins" }}
        >
          Discover our handcrafted Lucknowi Chikankari collection, specially
          curated for boutiques, wholesalers and retailers.
        </p>
      </div>

      <div className="mt-10 grid items-stretch gap-6 sm:mt-12 md:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-8">
        {collections.map((item) => (
          <Link
            key={item.title}
            to={`/categories/${item.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-[#E8DCC5] bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-[#D8C29A] hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#0F4C3A] focus:ring-offset-4"
          >
            <div className="relative h-72 overflow-hidden sm:h-80">
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />

              <div className="absolute bottom-5 left-5 right-5">
                <span
                  className="inline-flex rounded-full bg-white/90 px-4 py-2 text-xs font-medium text-[#0F4C3A] backdrop-blur-sm"
                  style={{ fontFamily: "Poppins" }}
                >
                  Handcrafted Collection
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-6 sm:p-7 lg:p-8">
              <h3
                className="text-3xl leading-tight text-[#0F4C3A]"
                style={{ fontFamily: "Cormorant Garamond" }}
              >
                {item.title}
              </h3>

              <p
                className="mt-3 flex-1 text-sm leading-6 text-gray-600 sm:text-base"
                style={{ fontFamily: "Poppins" }}
              >
                {item.desc}
              </p>

              <span
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0F4C3A] transition-colors duration-300 group-hover:text-[#C9A86A]"
                style={{ fontFamily: "Poppins" }}
              >
                View Collection

                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Collections;