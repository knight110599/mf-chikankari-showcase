import { Link } from "react-router-dom";
import kurtis from "../assets/images/kurtis.jpg";
import suits from "../assets/images/suits.jpg";
import dupattas from "../assets/images/dupattas.jpg";

const categories = [
  {
    name: "Kurtis",
    slug: "kurtis",
    description: "Everyday and festive Lucknowi Chikankari kurtis.",
    image: kurtis,
  },
  {
    name: "Suits",
    slug: "suits",
    description: "Premium handcrafted suit sets for elegant occasions.",
    image: suits,
  },
  {
    name: "Dupattas",
    slug: "dupattas",
    description: "Fine embroidered dupattas with traditional detailing.",
    image: dupattas,
  },
];

function CategoriesPage() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="max-w-3xl">
        <p
          className="text-sm uppercase tracking-[0.35em] text-[#C9A86A]"
          style={{ fontFamily: "Poppins" }}
        >
          Shop by Category
        </p>

        <h1
          className="mt-3 text-5xl leading-tight text-[#0F4C3A] sm:text-6xl"
          style={{ fontFamily: "Cormorant Garamond" }}
        >
          Explore Our Collections
        </h1>

        <p
          className="mt-5 text-base leading-7 text-gray-600 sm:text-lg"
          style={{ fontFamily: "Poppins" }}
        >
          Browse authentic Lucknowi Chikankari products by category and find
          the right collection for retail or wholesale requirements.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {categories.map((category) => (
          <Link
            key={category.slug}
            to={`/categories/${category.slug}`}
            className="group overflow-hidden rounded-[28px] border border-[#E8DCC5] bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
          >
            <div className="relative h-80 overflow-hidden bg-[#EFE8DB]">
              <img
                src={category.image}
                alt={`${category.name} collection`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h2
                  className="text-4xl text-white"
                  style={{ fontFamily: "Cormorant Garamond" }}
                >
                  {category.name}
                </h2>
              </div>
            </div>

            <div className="p-6">
              <p
                className="leading-7 text-gray-600"
                style={{ fontFamily: "Poppins" }}
              >
                {category.description}
              </p>

              <span
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0F4C3A] transition-colors group-hover:text-[#C9A86A]"
                style={{ fontFamily: "Poppins" }}
              >
                View Products
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

export default CategoriesPage;