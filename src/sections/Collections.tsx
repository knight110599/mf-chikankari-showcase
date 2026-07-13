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

        <div className="rounded-[32px] border border-[#E8DCC5] bg-white p-8 shadow-sm">
          <h3 className="text-2xl text-[#0F4C3A]">Women's Kurtis</h3>
          <p className="mt-3 text-gray-500">
            Elegant everyday & festive wear.
          </p>
        </div>

        <div className="rounded-[32px] border border-[#E8DCC5] bg-white p-8 shadow-sm">
          <h3 className="text-2xl text-[#0F4C3A]">Chikankari Suits</h3>
          <p className="mt-3 text-gray-500">
            Premium handcrafted suit sets.
          </p>
        </div>

        <div className="rounded-[32px] border border-[#E8DCC5] bg-white p-8 shadow-sm">
          <h3 className="text-2xl text-[#0F4C3A]">Dupattas</h3>
          <p className="mt-3 text-gray-500">
            Fine embroidered dupattas.
          </p>
        </div>

      </div>
    </section>
  );
}

export default Collections;