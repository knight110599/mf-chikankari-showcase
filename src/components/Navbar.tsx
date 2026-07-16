import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navItems = [
  {
    name: "Home",
    to: "/",
  },
  {
    name: "Products",
    to: "/products",
  },
  {
    name: "Categories",
    to: "/categories",
  },
  {
    name: "About",
    to: "/about",
  },
  {
    name: "Contact",
    to: "/contact",
  },
];

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#E8DCC5] bg-[#F8F5F0]/90 backdrop-blur-md">
      <div className="mx-auto flex h-24 w-full max-w-7xl items-center justify-between px-5 sm:px-8 md:h-28 lg:px-12">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="flex flex-col transition-transform duration-300 hover:scale-[1.02]"
        >
          <span
            className="text-[10px] uppercase tracking-[0.35em] text-[#C9A86A] sm:text-[11px] sm:tracking-[0.4em]"
            style={{ fontFamily: "Poppins" }}
          >
            Lucknow
          </span>

          <span
            className="text-2xl leading-none text-[#0F4C3A] sm:text-3xl md:text-4xl"
            style={{ fontFamily: "Cormorant Garamond" }}
          >
            MF Chikankari
          </span>

          <span
            className="text-[10px] tracking-[0.22em] text-[#6A2435] sm:text-xs sm:tracking-[0.25em]"
            style={{ fontFamily: "Poppins" }}
          >
            HANDICRAFT
          </span>
        </Link>

        {/* Desktop Navigation */}
        <ul
          className="hidden items-center gap-8 md:flex lg:gap-10"
          style={{ fontFamily: "Poppins" }}
        >
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `group relative pb-1 text-[15px] font-medium transition-colors duration-300 ${
                    isActive
                      ? "text-[#0F4C3A]"
                      : "text-[#555] hover:text-[#0F4C3A]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.name}

                    <span
                      className={`absolute -bottom-1 left-0 h-[2px] bg-[#C9A86A] transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="rounded-full border border-[#0F4C3A] px-5 py-2 text-sm font-medium text-[#0F4C3A] transition-all duration-300 hover:bg-[#0F4C3A] hover:text-white"
            style={{ fontFamily: "Poppins" }}
          >
            Dealer Login
          </Link>

          <a
            href="https://wa.me/916386826199?text=Hello%20MF%20Chikankari%2C%20I%20would%20like%20to%20know%20more%20about%20your%20collections."
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#0F4C3A] px-5 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-[#0A3D2F]"
            style={{ fontFamily: "Poppins" }}
          >
            WhatsApp
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="flex h-11 w-11 items-center justify-center rounded-full text-[#0F4C3A] transition hover:bg-[#EFE8DB] md:hidden"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <div className="absolute left-0 top-24 w-full border-t border-[#E8DCC5] bg-[#F8F5F0] shadow-lg md:hidden">
          <ul
            className="flex flex-col px-5 py-6 sm:px-8"
            style={{ fontFamily: "Poppins" }}
          >
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex min-h-12 items-center border-b border-[#E8DCC5]/70 text-base transition-colors ${
                      isActive
                        ? "font-semibold text-[#0F4C3A]"
                        : "text-[#555] hover:text-[#0F4C3A]"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}

            <li className="mt-6 grid gap-3">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#0F4C3A] px-5 text-sm font-medium text-[#0F4C3A]"
              >
                Dealer Login
              </Link>

              <a
                href="https://wa.me/916386826199?text=Hello%20MF%20Chikankari%2C%20I%20would%20like%20to%20know%20more%20about%20your%20collections."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#0F4C3A] px-5 text-sm font-medium text-white"
              >
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;