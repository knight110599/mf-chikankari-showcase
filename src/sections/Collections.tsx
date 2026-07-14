import kurtis from "@/assets/images/kurtis.jpg";
import suits from "@/assets/images/suits.jpg";
import dupattas from "@/assets/images/dupattas.jpg";
function Collections() {
  return (
    <section
      id="collections"
      className="mx-auto max-w-7xl px-8 py-24 lg:px-12"
    >
      <p
        className="text-sm uppercase tracking-[0.35em] text-[#C9A86A]"
        style={{ fontFamily: "Poppins" }}
      >
        Our Collection
      </p>

      <h2
        className="mt-3 text-5xl text-[#0F4C3A]"
        style={{ fontFamily: "Cormorant Garamond" }}
      >
        Crafted for Every Occasion
      </h2>

      <p
        className="mt-5 max-w-2xl text-lg text-gray-600"
        style={{ fontFamily: "Poppins" }}
      >
        Discover our handcrafted Lucknowi Chikankari collection,
        specially curated for boutiques, wholesalers and retailers.
      </p>

      <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

  {[
    {
      title: "Women's Kurtis",
      desc: "Elegant everyday & festive wear.",
      image: kurtis,
    },
    {
      title: "Chikankari Suits",
      desc: "Premium handcrafted suit sets.",
      image: suits,
    },
    {
      title: "Dupattas",
      desc: "Fine embroidered dupattas.",
      image: dupattas,
    },
  ].map((item) => (
    <div
      key={item.title}
      className="group overflow-hidden rounded-[32px] border border-[#E8DCC5] bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
    >

      <div className="h-56 overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
      </div>

      <div className="p-8">
        <h3
          className="text-2xl text-[#0F4C3A]"
          style={{ fontFamily: "Cormorant Garamond" }}
        >
          {item.title}
        </h3>

        <p
          className="mt-3 text-gray-500"
          style={{ fontFamily: "Poppins" }}
        >
          {item.desc}
        </p>
      </div>

    </div>
  ))}

</div>
    </section>
  );
}

export default Collections;