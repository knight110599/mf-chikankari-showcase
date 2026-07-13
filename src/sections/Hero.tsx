import heroKurti from "../assets/Images/Products/hero-kurti.png";

function Hero() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-112px)] max-w-7xl items-center px-8 lg:px-12">
      {/* Left Side */}
      <div className="max-w-xl">
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
          Chikankari
          <br />
          Handicraft
        </h1>

        <p
          className="mt-6 text-lg leading-8 text-[#555]"
          style={{ fontFamily: "Poppins" }}
        >
          Premium Lucknowi Chikankari Kurtis, Suits &
          Handcrafted Collections for wholesalers,
          boutiques and resellers across India.
        </p>

        <div className="mt-10 flex gap-4">
          <button className="rounded-full bg-[#0F4C3A] px-8 py-4 text-white">
            Explore Collection
          </button>

          <button className="rounded-full border border-[#0F4C3A] px-8 py-4 text-[#0F4C3A]">
            Contact Us
          </button>
        </div>
      </div>
<div
  className="mt-10 grid grid-cols-2 gap-5"
  style={{ fontFamily: "Poppins" }}
>
  <div className="flex items-center gap-3">
    <span className="text-2xl">✨</span>
    <div>
      <h4 className="font-semibold text-[#0F4C3A]">500+ Designs</h4>
      <p className="text-sm text-gray-500">Latest Collections</p>
    </div>
  </div>

  <div className="flex items-center gap-3">
    <span className="text-2xl">🚚</span>
    <div>
      <h4 className="font-semibold text-[#0F4C3A]">Pan India</h4>
      <p className="text-sm text-gray-500">Wholesale Delivery</p>
    </div>
  </div>

  <div className="flex items-center gap-3">
    <span className="text-2xl">🧵</span>
    <div>
      <h4 className="font-semibold text-[#0F4C3A]">Handcrafted</h4>
      <p className="text-sm text-gray-500">Authentic Chikankari</p>
    </div>
  </div>

  <div className="flex items-center gap-3">
    <span className="text-2xl">🏪</span>
    <div>
      <h4 className="font-semibold text-[#0F4C3A]">Trusted Since 1998</h4>
      <p className="text-sm text-gray-500">Lucknow Heritage</p>
    </div>
  </div>
</div>
      {/* Right Side */}
      <div className="flex h-[520px] w-[420px] items-center justify-center overflow-hidden rounded-[40px] border border-[#D9C8A8] bg-[#EFE8DB] p-6 shadow-xl">
        <img
          src={heroKurti}
          alt="MF Chikankari Kurti"
          className="relative flex h-[520px] w-[420px] items-center justify-center overflow-hidden rounded-[40px] border border-[#D9C8A8] bg-white p-6 shadow-2xl"
        />
      </div>
    </section>
  );
}

export default Hero;