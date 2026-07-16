import { Link } from "react-router-dom";
import { Award, HeartHandshake, Scissors, Users } from "lucide-react";

function AboutPage() {
  const values = [
    {
      icon: <Scissors size={28} />,
      title: "Handcrafted Excellence",
      description:
        "Every piece is carefully handcrafted by experienced Lucknowi artisans using traditional Chikankari embroidery techniques.",
    },
    {
      icon: <Award size={28} />,
      title: "Premium Quality",
      description:
        "We use carefully selected fabrics and maintain strict quality checks before every order is dispatched.",
    },
    {
      icon: <Users size={28} />,
      title: "Wholesale Expertise",
      description:
        "Trusted by retailers, boutiques and resellers across India with reliable wholesale support.",
    },
    {
      icon: <HeartHandshake size={28} />,
      title: "Customer First",
      description:
        "Our focus is to build long-term relationships through honest service, transparent pricing and dependable support.",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="border-b border-[#E8DCC5] bg-[#F8F5F0]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <p
            className="text-sm uppercase tracking-[0.35em] text-[#C9A86A]"
            style={{ fontFamily: "Poppins" }}
          >
            Our Story
          </p>

          <h1
            className="mt-4 max-w-4xl text-5xl leading-tight text-[#0F4C3A] sm:text-6xl lg:text-7xl"
            style={{ fontFamily: "Cormorant Garamond" }}
          >
            Preserving the Heritage of Lucknowi Chikankari
          </h1>

          <p
            className="mt-8 max-w-3xl text-lg leading-8 text-gray-600"
            style={{ fontFamily: "Poppins" }}
          >
            MF Chikankari is dedicated to celebrating the timeless beauty of
            authentic Lucknowi embroidery. We work closely with skilled artisans
            to create elegant handcrafted collections for boutiques,
            wholesalers and fashion retailers across India.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p
              className="text-sm uppercase tracking-[0.35em] text-[#C9A86A]"
              style={{ fontFamily: "Poppins" }}
            >
              Heritage
            </p>

            <h2
              className="mt-3 text-5xl text-[#0F4C3A]"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              Tradition Meets Modern Fashion
            </h2>
          </div>

          <div
            className="space-y-6 text-lg leading-8 text-gray-600"
            style={{ fontFamily: "Poppins" }}
          >
            <p>
              Inspired by the rich heritage of Lucknow, our collections blend
              traditional craftsmanship with contemporary fashion. Every design
              reflects elegance, comfort and authenticity.
            </p>

            <p>
              Whether you are a boutique owner, retailer or wholesale buyer, we
              are committed to providing premium handcrafted products with
              consistent quality and dependable service.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:grid-cols-2 lg:grid-cols-4 lg:px-12">
          {[
            ["500+", "Designs"],
            ["1000+", "Happy Customers"],
            ["25+", "Artisans"],
            ["Pan India", "Delivery"],
          ].map(([number, label]) => (
            <div
              key={label}
              className="rounded-[28px] border border-[#E8DCC5] bg-[#F8F5F0] p-8 text-center"
            >
              <h3
                className="text-5xl text-[#0F4C3A]"
                style={{ fontFamily: "Cormorant Garamond" }}
              >
                {number}
              </h3>

              <p
                className="mt-3 text-gray-600"
                style={{ fontFamily: "Poppins" }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12">
        <div className="text-center">
          <p
            className="text-sm uppercase tracking-[0.35em] text-[#C9A86A]"
            style={{ fontFamily: "Poppins" }}
          >
            Why Choose Us
          </p>

          <h2
            className="mt-3 text-5xl text-[#0F4C3A]"
            style={{ fontFamily: "Cormorant Garamond" }}
          >
            Built on Quality & Trust
          </h2>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-[28px] border border-[#E8DCC5] bg-white p-8 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="text-[#C9A86A]">{value.icon}</div>

              <h3
                className="mt-5 text-3xl text-[#0F4C3A]"
                style={{ fontFamily: "Cormorant Garamond" }}
              >
                {value.title}
              </h3>

              <p
                className="mt-4 leading-7 text-gray-600"
                style={{ fontFamily: "Poppins" }}
              >
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#E8DCC5] bg-[#0F4C3A] py-20">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <h2
            className="text-5xl text-white"
            style={{ fontFamily: "Cormorant Garamond" }}
          >
            Let's Build Your Collection Together
          </h2>

          <p
            className="mt-6 text-lg leading-8 text-white/80"
            style={{ fontFamily: "Poppins" }}
          >
            Discover handcrafted Lucknowi Chikankari collections designed for
            boutiques, retailers and wholesale businesses.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/products"
              className="rounded-full bg-white px-8 py-4 font-semibold text-[#0F4C3A] transition hover:scale-105"
            >
              Explore Products
            </Link>

            <Link
              to="/contact"
              className="rounded-full border border-white px-8 py-4 font-semibold text-white transition hover:bg-white hover:text-[#0F4C3A]"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default AboutPage;