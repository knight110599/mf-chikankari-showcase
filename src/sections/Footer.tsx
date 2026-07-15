import { Camera, MessageCircle, Mail, Phone } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-[#0F4C3A] text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-8 py-20 lg:grid-cols-4 lg:px-12">

        {/* Brand */}
        <div>
          <h2
            className="text-4xl"
            style={{ fontFamily: "Cormorant Garamond" }}
          >
            MF Chikankari
          </h2>

          <p
            className="mt-5 leading-8 text-gray-300"
            style={{ fontFamily: "Poppins" }}
          >
            Premium Lucknowi Chikankari collections crafted with elegance,
            tradition and timeless craftsmanship.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-5 text-xl font-semibold">Quick Links</h3>

          <ul className="space-y-3 text-gray-300">
            <li><a href="#">Home</a></li>
            <li><a href="#collections">Collections</a></li>
            <li><a href="#brand-story">Brand Story</a></li>
            <li><a href="#wholesale-process">Wholesale Process</a></li>
            <li><a href="#gallery">Gallery</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        {/* Collections */}
        <div>
          <h3 className="mb-5 text-xl font-semibold">Collections</h3>

          <ul className="space-y-3 text-gray-300">
            <li>Kurtis</li>
            <li>Suits</li>
            <li>Dupattas</li>
            <li>Co-ord Sets</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-5 text-xl font-semibold">Contact</h3>

          <div className="space-y-4 text-gray-300">

            <a
  href="tel:+916386826199"
  className="flex items-center gap-3 hover:text-[#C9A86A] transition"
>
  <Phone size={18} />
  <span>+91 63868 26199</span>
</a>

            <a
  href="mailto:mfchikankari@example.com?subject=Wholesale%20Inquiry"
  className="flex items-center gap-3 hover:text-[#C9A86A] transition"
>
  <Mail size={18} />
  <span>mfchikankari@example.com</span>
</a>

            <div className="flex gap-4 pt-5">
  <a
    href="https://www.instagram.com/YOUR_USERNAME"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Camera />
  </a>

  <a
    href="https://wa.me/916386826199"
    target="_blank"
    rel="noopener noreferrer"
  >
    <MessageCircle />
  </a>
</div>
          </div>
        </div>

      </div>

      <div className="border-t border-white/10 py-6 text-center text-sm text-gray-300">
        © 2026 MF Chikankari
Designed & Developed by Alvora Studio
      </div>
    </footer>
  );
}

export default Footer;