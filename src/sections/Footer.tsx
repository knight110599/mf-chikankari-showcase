import {
  Camera,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

const quickLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Collections",
    href: "/#collections",
  },
  {
    label: "Brand Story",
    href: "/#brand-story",
  },
  {
    label: "Wholesale Process",
    href: "/#process",
  },
  {
    label: "Latest Arrivals",
    href: "/#gallery",
  },
  {
    label: "Contact",
    href: "/#contact",
  },
];

const collections = [
  {
    label: "Kurtis",
    href: "/products?category=Kurtis",
  },
  {
    label: "Suits",
    href: "/products?category=Suits",
  },
  {
    label: "Dupattas",
    href: "/products?category=Dupattas",
  },
  {
    label: "Co-ord Sets",
    href: "/products?category=Co-ord%20Sets",
  },
];

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="relative z-50 isolate bg-[#0F4C3A] text-white pointer-events-auto"
    >
      <div className="relative z-10 mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-14 py-20 sm:py-24 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr] lg:gap-16 lg:py-28">
          {/* Brand */}
          <div>
            <a
              href="/"
              aria-label="Go to MF Chikankari homepage"
              className="inline-block cursor-pointer transition-opacity duration-300 hover:opacity-80"
            >
              <h2
                className="text-4xl leading-none sm:text-5xl"
                style={{ fontFamily: "Cormorant Garamond" }}
              >
                MF Chikankari
              </h2>
            </a>

            <p
              className="mt-6 max-w-md text-sm leading-7 text-white/65 sm:text-base sm:leading-8"
              style={{ fontFamily: "Poppins" }}
            >
              Premium Lucknowi Chikankari collections crafted with elegance,
              tradition and timeless craftsmanship.
            </p>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Lucknow%2C%20Uttar%20Pradesh"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex cursor-pointer items-center gap-3 text-sm text-white/65 transition-colors duration-300 hover:text-[#D9B96E]"
              style={{ fontFamily: "Poppins" }}
            >
              <MapPin size={17} aria-hidden="true" />
              <span>Lucknow, Uttar Pradesh, India</span>
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className="text-2xl"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              Quick Links
            </h3>

            <div className="mt-4 h-px w-10 bg-[#C9A86A]" />

            <ul
              className="mt-6 space-y-3 text-sm text-white/65"
              style={{ fontFamily: "Poppins" }}
            >
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="inline-flex cursor-pointer transition-all duration-300 hover:translate-x-1 hover:text-[#D9B96E]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h3
              className="text-2xl"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              Collections
            </h3>

            <div className="mt-4 h-px w-10 bg-[#C9A86A]" />

            <ul
              className="mt-6 space-y-3 text-sm text-white/65"
              style={{ fontFamily: "Poppins" }}
            >
              {collections.map((collection) => (
                <li key={collection.label}>
                  <a
                    href={collection.href}
                    className="inline-flex cursor-pointer transition-all duration-300 hover:translate-x-1 hover:text-[#D9B96E]"
                  >
                    {collection.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3
              className="text-2xl"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              Contact
            </h3>

            <div className="mt-4 h-px w-10 bg-[#C9A86A]" />

            <div
              className="mt-6 space-y-4 text-sm text-white/65"
              style={{ fontFamily: "Poppins" }}
            >
              <a
                href="tel:+916386826199"
                className="flex cursor-pointer items-start gap-3 transition-colors duration-300 hover:text-[#D9B96E]"
              >
                <Phone
                  size={17}
                  className="mt-0.5 shrink-0"
                  aria-hidden="true"
                />

                <span>+91 63868 26199</span>
              </a>

              <a
                href="mailto:mfchikankari@example.com?subject=MF%20Chikankari%20Inquiry"
                className="flex cursor-pointer items-start gap-3 break-all transition-colors duration-300 hover:text-[#D9B96E]"
              >
                <Mail
                  size={17}
                  className="mt-0.5 shrink-0"
                  aria-hidden="true"
                />

                <span>mfchikankari@example.com</span>
              </a>

              <div className="flex items-center gap-3 pt-4">
                <a
                  href="https://www.instagram.com/YOUR_USERNAME"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit MF Chikankari on Instagram"
                  className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A86A] hover:bg-[#C9A86A] hover:text-[#0F4C3A]"
                >
                  <Camera size={18} aria-hidden="true" />
                </a>

                <a
                  href="https://wa.me/916386826199?text=Hello%20MF%20Chikankari%2C%20I%20am%20interested%20in%20your%20collection."
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Contact MF Chikankari on WhatsApp"
                  className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A86A] hover:bg-[#C9A86A] hover:text-[#0F4C3A]"
                >
                  <MessageCircle size={18} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="flex flex-col gap-3 border-t border-white/10 py-6 text-center text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between sm:text-left"
          style={{ fontFamily: "Poppins" }}
        >
          <a
            href="/"
            className="cursor-pointer transition-colors duration-300 hover:text-[#D9B96E]"
          >
            © {currentYear} MF Chikankari. All rights reserved.
          </a>

          <a
            href="https://alvora-launchpad.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer transition-colors duration-300 hover:text-[#D9B96E]"
          >
            Designed &amp; Developed by Alvora Studio
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;