import { useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";
import {
  LogOut,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

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

const whatsappUrl =
  "https://wa.me/916386826199?text=Hello%20MF%20Chikankari%2C%20I%20would%20like%20to%20know%20more%20about%20your%20collections.";

function Navbar() {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const {
    isAuthenticated,
    user,
    logout,
  } = useAuth();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/", { replace: true });
  };

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#E8DCC5] bg-[#F8F5F0]/90 backdrop-blur-md">
      <div className="mx-auto flex h-24 w-full max-w-7xl items-center justify-between px-5 sm:px-8 md:h-28 lg:px-12">
        <Link
          to="/"
          onClick={closeMenu}
          className="flex flex-col transition-transform duration-300 hover:scale-[1.02]"
          aria-label="MF Chikankari home"
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
                        isActive
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated ? (
            <>
              <Link
                to="/account"
                className="inline-flex h-11 max-w-52 items-center gap-2 rounded-full border border-[#D9C8A8] px-5 text-sm font-semibold text-[#0F4C3A] transition hover:border-[#0F4C3A] hover:bg-[#0F4C3A]/5"
              >
                <UserRound className="h-4 w-4 shrink-0" />

                <span className="truncate">
                  {user?.name || "My Account"}
                </span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-[#0F4C3A] px-5 text-sm font-semibold text-white transition hover:bg-[#0B3F30]"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex h-11 items-center rounded-full border border-[#D9C8A8] px-5 text-sm font-semibold text-[#0F4C3A] transition hover:border-[#0F4C3A] hover:bg-[#0F4C3A]/5"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="inline-flex h-11 items-center rounded-full bg-[#0F4C3A] px-5 text-sm font-semibold text-white transition hover:bg-[#0B3F30]"
              >
                Sign up
              </Link>
            </>
          )}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#0F4C3A] px-5 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-[#0A3D2F]"
            style={{ fontFamily: "Poppins" }}
          >
            WhatsApp
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="flex h-11 w-11 items-center justify-center rounded-full text-[#0F4C3A] transition hover:bg-[#EFE8DB] md:hidden"
          aria-label={
            open
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div
          id="mobile-navigation"
          className="absolute left-0 top-24 w-full border-t border-[#E8DCC5] bg-[#F8F5F0] shadow-lg md:hidden"
        >
          <ul
            className="flex flex-col px-5 py-6 sm:px-8"
            style={{ fontFamily: "Poppins" }}
          >
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  onClick={closeMenu}
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
              {isAuthenticated ? (
                <>
                  <Link
                    to="/account"
                    onClick={closeMenu}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#0F4C3A] px-5 text-sm font-semibold text-[#0F4C3A]"
                  >
                    <UserRound className="h-4 w-4" />

                    <span className="max-w-56 truncate">
                      {user?.name || "My Account"}
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#6A2435] px-5 text-sm font-semibold text-white transition hover:bg-[#541C2A]"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#0F4C3A] px-5 text-sm font-semibold text-[#0F4C3A]"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    onClick={closeMenu}
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#0F4C3A] px-5 text-sm font-semibold text-white"
                  >
                    Create Account
                  </Link>
                </>
              )}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
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