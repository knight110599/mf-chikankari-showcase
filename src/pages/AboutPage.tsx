import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  HeartHandshake,
  MapPin,
  Scissors,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const values = [
  {
    icon: Scissors,
    number: "01",
    title: "Handcrafted Excellence",
    description:
      "Every piece is carefully handcrafted by experienced Lucknowi artisans using traditional Chikankari embroidery techniques.",
  },
  {
    icon: Award,
    number: "02",
    title: "Premium Quality",
    description:
      "We use carefully selected fabrics and maintain strict quality checks before every order is dispatched.",
  },
  {
    icon: Users,
    number: "03",
    title: "Wholesale Expertise",
    description:
      "Trusted by retailers, boutiques and resellers across India with reliable wholesale support.",
  },
  {
    icon: HeartHandshake,
    number: "04",
    title: "Customer First",
    description:
      "Our focus is to build long-term relationships through honest service, transparent pricing and dependable support.",
  },
];

const statistics = [
  {
    value: "500+",
    label: "Designs",
    description: "Traditional and contemporary silhouettes.",
  },
  {
    value: "1000+",
    label: "Happy Customers",
    description: "Retail and wholesale buyers served.",
  },
  {
    value: "25+",
    label: "Artisans",
    description: "Skilled hands preserving the craft.",
  },
  {
    value: "Pan India",
    label: "Delivery",
    description: "Reliable dispatch across the country.",
  },
];

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F8F5F0]">
      {/* Hero */}
      <section className="relative border-b border-[#E8DCC5]">
        <div className="pointer-events-none absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-[#C9A86A]/10 blur-3xl" />

        <div className="pointer-events-none absolute -right-40 bottom-0 h-[460px] w-[460px] rounded-full bg-[#0F4C3A]/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-[1500px] gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:px-12 lg:py-28">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A86A]/40 bg-white/70 px-4 py-2 backdrop-blur-sm">
              <Sparkles
                size={15}
                className="text-[#C9A86A]"
                aria-hidden="true"
              />

              <span
                className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#0F4C3A]"
                style={{ fontFamily: "Poppins" }}
              >
                Our Story
              </span>
            </div>

            <h1
              className="mt-7 max-w-5xl text-5xl leading-[0.95] tracking-[-0.025em] text-[#0F4C3A] sm:text-6xl lg:text-7xl xl:text-[90px]"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              Preserving the soul of
              <span className="block italic text-[#9E7B39]">
                Lucknowi Chikankari
              </span>
            </h1>

            <p
              className="mt-8 max-w-3xl text-sm leading-7 text-[#596862] sm:text-base sm:leading-8"
              style={{ fontFamily: "Poppins" }}
            >
              MF Chikankari celebrates the timeless beauty of authentic
              Lucknowi embroidery by bringing traditional craftsmanship into
              refined, contemporary wardrobes.
            </p>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.15,
              ease: "easeOut",
            }}
            className="lg:justify-self-end"
          >
            <div className="max-w-md rounded-[32px] border border-[#E8DCC5] bg-white/75 p-7 shadow-[0_24px_70px_rgba(15,76,58,0.07)] backdrop-blur-sm sm:p-9">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0F4C3A] text-white">
                <MapPin size={22} aria-hidden="true" />
              </div>

              <p
                className="mt-7 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#A47E3B]"
                style={{ fontFamily: "Poppins" }}
              >
                Rooted in Lucknow
              </p>

              <p
                className="mt-3 text-3xl leading-tight text-[#0F4C3A]"
                style={{ fontFamily: "Cormorant Garamond" }}
              >
                Crafted with heritage, created for today.
              </p>

              <p
                className="mt-5 text-sm leading-7 text-[#6C7974]"
                style={{ fontFamily: "Poppins" }}
              >
                We work closely with skilled artisans to create elegant
                handcrafted collections for boutiques, retailers and
                wholesale buyers across India.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            variants={fadeUp}
            transition={{
              duration: 0.65,
            }}
          >
            <div className="mb-6 h-px w-16 bg-[#C9A86A]" />

            <p
              className="text-xs font-semibold uppercase tracking-[0.34em] text-[#A47E3B]"
              style={{ fontFamily: "Poppins" }}
            >
              Our Heritage
            </p>

            <h2
              className="mt-5 max-w-xl text-5xl leading-[0.98] text-[#0F4C3A] sm:text-6xl"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              Tradition meets
              <span className="block italic text-[#9E7B39]">
                modern expression
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            variants={fadeUp}
            transition={{
              duration: 0.65,
              delay: 0.1,
            }}
            className="border-l border-[#D9C8A8] pl-6 sm:pl-10 lg:pl-14"
          >
            <div
              className="space-y-7 text-base leading-8 text-[#596862]"
              style={{ fontFamily: "Poppins" }}
            >
              <p>
                Inspired by the rich heritage of Lucknow, our collections
                combine traditional craftsmanship with contemporary fashion.
                Every design reflects elegance, comfort and authenticity.
              </p>

              <p>
                Each garment passes through skilled hands that understand the
                patience, precision and character of genuine Chikankari
                embroidery.
              </p>

              <p>
                Whether you are a boutique owner, retailer or wholesale buyer,
                we are committed to delivering premium handcrafted products
                with consistent quality and dependable service.
              </p>
            </div>

            <div
              className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-[#E8DCC5] pt-7 text-xs font-medium uppercase tracking-[0.2em] text-[#0F4C3A]"
              style={{ fontFamily: "Poppins" }}
            >
              <span>Authentic Craft</span>
              <span>Selected Fabrics</span>
              <span>Quality Assured</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[#E8DCC5] bg-white">
        <div className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.15,
            }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="grid gap-px overflow-hidden rounded-[30px] border border-[#E8DCC5] bg-[#E8DCC5] sm:grid-cols-2 lg:grid-cols-4"
          >
            {statistics.map((statistic) => (
              <motion.div
                key={statistic.label}
                variants={fadeUp}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                }}
                className="bg-[#F8F5F0] p-7 sm:p-8 lg:min-h-[250px]"
              >
                <p
                  className="text-5xl leading-none text-[#0F4C3A] sm:text-6xl"
                  style={{ fontFamily: "Cormorant Garamond" }}
                >
                  {statistic.value}
                </p>

                <p
                  className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-[#A47E3B]"
                  style={{ fontFamily: "Poppins" }}
                >
                  {statistic.label}
                </p>

                <p
                  className="mt-4 text-sm leading-7 text-[#6D7974]"
                  style={{ fontFamily: "Poppins" }}
                >
                  {statistic.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          variants={fadeUp}
          transition={{
            duration: 0.65,
          }}
          className="mx-auto max-w-3xl text-center"
        >
          <p
            className="text-xs font-semibold uppercase tracking-[0.34em] text-[#A47E3B]"
            style={{ fontFamily: "Poppins" }}
          >
            Why Choose Us
          </p>

          <h2
            className="mt-5 text-5xl leading-none text-[#0F4C3A] sm:text-6xl"
            style={{ fontFamily: "Cormorant Garamond" }}
          >
            Built on quality,
            <span className="block italic text-[#9E7B39]">
              trust and craftsmanship
            </span>
          </h2>

          <p
            className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-[#68756F] sm:text-base"
            style={{ fontFamily: "Poppins" }}
          >
            Every part of our process is shaped by respect for the craft and
            responsibility towards our customers.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.1,
          }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="mt-14 grid gap-6 md:grid-cols-2"
        >
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <motion.article
                key={value.title}
                variants={fadeUp}
                transition={{
                  duration: 0.55,
                  ease: "easeOut",
                }}
                className="group relative overflow-hidden rounded-[30px] border border-[#E8DCC5] bg-white p-7 shadow-[0_18px_50px_rgba(15,76,58,0.04)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(15,76,58,0.1)] sm:p-9"
              >
                <div className="absolute right-7 top-6 text-6xl text-[#0F4C3A]/5 sm:text-7xl">
                  {value.number}
                </div>

                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#F3EEE5] text-[#A47E3B] transition duration-300 group-hover:bg-[#0F4C3A] group-hover:text-white">
                  <Icon size={24} aria-hidden="true" />
                </div>

                <h3
                  className="relative mt-7 text-3xl text-[#0F4C3A] sm:text-4xl"
                  style={{ fontFamily: "Cormorant Garamond" }}
                >
                  {value.title}
                </h3>

                <p
                  className="relative mt-4 max-w-xl text-sm leading-7 text-[#68756F]"
                  style={{ fontFamily: "Poppins" }}
                >
                  {value.description}
                </p>

                <div className="relative mt-8 h-px w-full overflow-hidden bg-[#E8DCC5]">
                  <div className="h-full w-0 bg-[#C9A86A] transition-all duration-500 group-hover:w-full" />
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-[#0F4C3A]">
        <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full border border-white/10" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          variants={fadeUp}
          transition={{
            duration: 0.65,
          }}
          className="relative mx-auto max-w-5xl px-5 py-20 text-center sm:px-8 sm:py-24 lg:py-28"
        >
          <p
            className="text-xs font-semibold uppercase tracking-[0.34em] text-[#D8BC80]"
            style={{ fontFamily: "Poppins" }}
          >
            Work With Us
          </p>

          <h2
            className="mx-auto mt-5 max-w-4xl text-5xl leading-[0.98] text-white sm:text-6xl lg:text-7xl"
            style={{ fontFamily: "Cormorant Garamond" }}
          >
            Let&apos;s build your collection
            <span className="block italic text-[#D8BC80]">
              together
            </span>
          </h2>

          <p
            className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-white/70 sm:text-base sm:leading-8"
            style={{ fontFamily: "Poppins" }}
          >
            Discover handcrafted Lucknowi Chikankari collections created for
            boutiques, retailers and wholesale businesses.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/products"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-white px-8 text-sm font-semibold text-[#0F4C3A] transition hover:-translate-y-0.5 hover:bg-[#F4ECDD] hover:shadow-lg"
              style={{ fontFamily: "Poppins" }}
            >
              Explore Products
              <ArrowRight size={17} aria-hidden="true" />
            </Link>

            <Link
              to="/contact"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/60 px-8 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-[#0F4C3A]"
              style={{ fontFamily: "Poppins" }}
            >
              Contact Us
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

export default AboutPage;