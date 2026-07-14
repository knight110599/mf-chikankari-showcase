import { useState } from "react";
import { Menu, X } from "lucide-react";
function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#E8DCC5] bg-[#F8F5F0]/90 backdrop-blur-md">
      <div className="mx-auto flex h-24 md:h-28 w-full max-w-7xl items-center justify-between px-8 lg:px-12">

        {/* Logo */}
        <a
          href="#"
          className="flex flex-col transition-transform duration-300 hover:scale-[1.02]"
        >
          <span
            className="text-[11px] uppercase tracking-[0.4em] text-[#C9A86A]"
            style={{ fontFamily: "Poppins" }}
          >
            Lucknow
          </span>

          <h1
            className="text-3xl md:text-4xl leading-none text-[#0F4C3A]"
            style={{ fontFamily: "Cormorant Garamond" }}
          >
            MF Chikankari
          </h1>

          <span
            className="text-xs tracking-[0.25em] text-[#6A2435]"
            style={{ fontFamily: "Poppins" }}
          >
            HANDICRAFT
          </span>
        </a>

        {/* Navigation */}
        <ul
  className="hidden items-center gap-10 md:flex"
  style={{ fontFamily: "Poppins" }}
>
  {[
    {
    name: "Home",
    href: "#home",
    active: true,
  },
  {
    name: "About",
    href: "#about",
    active: false,
  },
  {
    name: "Collections",
    href: "#collections",
    active: false,
  },
  {
    name: "Gallery",
    href: "#gallery",
    active: false,
  },
  {
    name: "Contact",
    href: "#contact",
    active: false,
  }].map((item) => (
    <li key={item.name}>
      <a
        href={item.href}
        className={`group relative pb-1 text-[15px] font-medium transition-all duration-300 ${
          item.active
            ? "text-[#0F4C3A]"
            : "text-[#555] hover:text-[#0F4C3A]"
        }`}
      >
        {item.name}

        <span
          className={`absolute left-0 -bottom-1 h-[2px] bg-[#C9A86A] transition-all duration-300 ${
            item.active ? "w-full" : "w-0 group-hover:w-full"
          }`}
        />
      </a>
    </li>
  ))}
</ul>

        {/* Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            className="rounded-full border border-[#0F4C3A] px-5 py-2 text-sm font-medium text-[#0F4C3A] transition-all duration-300 hover:bg-[#0F4C3A] hover:text-white"
            style={{ fontFamily: "Poppins" }}
          >
            Dealer Login
          </button>

          <button
            className="rounded-full bg-[#0F4C3A] px-5 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-105"
            style={{ fontFamily: "Poppins" }}
          >
            WhatsApp
          </button>
        </div>
<div className="hidden md:flex items-center gap-3"></div>
{/* Mobile Menu Button */}
<button
  onClick={() => setOpen(!open)}
  className="md:hidden text-[#0F4C3A]"
>
  {open ? <X size={28} /> : <Menu size={28} />}
</button>
      </div>
      {open && (
  <div className="absolute left-0 top-28 w-full border-t border-[#E8DCC5] bg-[#F8F5F0] md:hidden">
    <ul className="flex flex-col gap-6 px-8 py-8">
      {[
        {
          name: "Home",
          href: "#home",
        },
        {
          name: "About",
          href: "#about",
        },
        {
          name: "Collections",
          href: "#collections",
        },
        {
          name: "Gallery",
          href: "#gallery",
        },
        {
          name: "Contact",
          href: "#contact",
        },
      ].map((item) => (
        <li key={item.name}>
          <a
            href={item.href}
            onClick={() => setOpen(false)}
            className="text-[#555] hover:text-[#0F4C3A]"
          >
            {item.name}
          </a>
        </li>
      ))}
    </ul>
  </div>
)}
    </nav>
  );
}

export default Navbar;