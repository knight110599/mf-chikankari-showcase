import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  LogOut,
  Menu,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";

import { useAuth } from "../context/useAuth";
import { useCart } from "../context/useCart";

const navItems = [
  { name: "Home", to: "/" },
  { name: "Products", to: "/products" },
  { name: "Categories", to: "/categories" },
  { name: "About", to: "/about" },
  { name: "Contact", to: "/contact" },
];

const whatsappUrl =
  "https://wa.me/916386826199?text=Hello%20MF%20Chikankari%2C%20I%20would%20like%20to%20know%20more%20about%20your%20collections.";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useCart();

  const isHomePage = location.pathname === "/";
  const isTransparent =
    isHomePage && !scrolled && !open;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
      );
    };
  }, []);

  const closeMenu = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/", { replace: true });
  };

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        isTransparent
          ? "border-b border-transparent bg-[#F8F5F0]/80 backdrop-blur-md"
          : "border-b border-[#E8DCC5] bg-[#F8F5F0]/95 shadow-[0_8px_30px_rgba(15,76,58,0.06)] backdrop-blur-xl"
      }`}
    >
      <div
        className={`mx-auto hidden w-full max-w-7xl items-center justify-between px-8 transition-all duration-500 md:flex lg:px-12 ${
          scrolled || !isHomePage
            ? "h-20 md:h-24"
            : "h-24 md:h-28"
        }`}
      >
        <DesktopBrandLogo />

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
                      : "text-[#4F5753] hover:text-[#0F4C3A]"
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
                className="inline-flex h-11 max-w-52 items-center gap-2 rounded-full border border-[#D9C8A8] bg-[#F8F5F0]/55 px-5 text-sm font-semibold text-[#0F4C3A] backdrop-blur-md transition hover:border-[#0F4C3A] hover:bg-[#F8F5F0]"
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
                className="inline-flex h-11 items-center rounded-full border border-[#D9C8A8] bg-[#F8F5F0]/55 px-5 text-sm font-semibold text-[#0F4C3A] backdrop-blur-md transition hover:border-[#0F4C3A] hover:bg-[#F8F5F0]"
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

          <CartIconButton
            cartCount={cartCount}
            mobile={false}
          />

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#0F4C3A] px-5 py-2 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0A3D2F] hover:shadow-lg"
            style={{ fontFamily: "Poppins" }}
          >
            WhatsApp
          </a>
        </div>
      </div>

      <div
        className={`flex w-full items-center justify-between px-3 transition-all duration-300 sm:px-5 md:hidden ${
          scrolled || !isHomePage
            ? "h-[76px]"
            : "h-[88px]"
        }`}
      >
        <MobileBrandLogo onClick={closeMenu} />

        <div className="flex shrink-0 items-center gap-2">
          <CartIconButton
            cartCount={cartCount}
            mobile
            onClick={closeMenu}
          />

          <button
            type="button"
            onClick={() =>
              setOpen((current) => !current)
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#0F4C3A] transition hover:bg-[#EFE8DB]/80"
            aria-label={
              open
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? (
              <X size={25} />
            ) : (
              <Menu size={25} />
            )}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-navigation"
          className="absolute left-0 top-full w-full border-t border-[#E8DCC5] bg-[#F8F5F0]/98 shadow-xl backdrop-blur-xl md:hidden"
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

            <li>
              <NavLink
                to="/cart"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `flex min-h-12 items-center justify-between border-b border-[#E8DCC5]/70 text-base transition-colors ${
                    isActive
                      ? "font-semibold text-[#0F4C3A]"
                      : "text-[#555] hover:text-[#0F4C3A]"
                  }`
                }
              >
                <span className="inline-flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Cart
                </span>

                {cartCount > 0 && (
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#6A2435] px-2 text-xs font-bold text-white">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </NavLink>
            </li>

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

function DesktopBrandLogo() {
  return (
    <Link
      to="/"
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
        style={{
          fontFamily: "Cormorant Garamond",
        }}
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
  );
}

function MobileBrandLogo({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="min-w-0 pr-2"
      aria-label="MF Chikankari home"
    >
      <span
        className="block text-[8px] uppercase tracking-[0.3em] text-[#C9A86A] min-[380px]:text-[9px]"
        style={{ fontFamily: "Poppins" }}
      >
        Lucknow
      </span>

      <span
        className="block truncate text-[23px] leading-[0.95] text-[#0F4C3A] min-[380px]:text-[26px]"
        style={{
          fontFamily: "Cormorant Garamond",
        }}
      >
        MF Chikankari
      </span>

      <span
        className="block text-[8px] tracking-[0.19em] text-[#6A2435] min-[380px]:text-[9px]"
        style={{ fontFamily: "Poppins" }}
      >
        HANDICRAFT
      </span>
    </Link>
  );
}

function CartIconButton({
  cartCount,
  mobile,
  onClick,
}: {
  cartCount: number;
  mobile: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      to="/cart"
      onClick={onClick}
      className={
        mobile
          ? "relative z-10 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D9C8A8] bg-white/80 text-[#0F4C3A] shadow-sm transition hover:bg-[#EFE8DB]"
          : "relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#D9C8A8] bg-[#F8F5F0]/55 text-[#0F4C3A] backdrop-blur-md transition hover:border-[#0F4C3A] hover:bg-[#F8F5F0]"
      }
      aria-label={`Shopping cart with ${cartCount} items`}
    >
      <ShoppingBag className="h-5 w-5" />

      {cartCount > 0 && (
        <span
          className={
            mobile
              ? "absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#6A2435] px-1 text-[10px] font-bold leading-none text-white ring-2 ring-[#F8F5F0]"
              : "absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#6A2435] px-1 text-[10px] font-bold leading-none text-white"
          }
        >
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
    </Link>
  );
}

export default Navbar;