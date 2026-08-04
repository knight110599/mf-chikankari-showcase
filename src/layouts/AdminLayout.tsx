import { useState } from "react";
import {
  Boxes,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  Users,
  X,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    to: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    to: "/admin/products",
    icon: Package,
  },
  {
    label: "Categories",
    to: "/admin/categories",
    icon: FolderTree,
  },
  {
    label: "Orders",
    to: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    label: "Customers",
    to: "/admin/customers",
    icon: Users,
  },
  {
    label: "Inventory",
    to: "/admin/inventory",
    icon: Boxes,
  },
  {
    label: "Wholesale",
    to: "/admin/wholesale",
    icon: Building2,
  },
];
type AdminUser = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  let adminUser: AdminUser | null = null;

  const storedUser = localStorage.getItem("adminUser");

  if (storedUser) {
    try {
      adminUser = JSON.parse(storedUser) as AdminUser;
    } catch {
      localStorage.removeItem("adminUser");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminUser");

    navigate("/admin/login", {
      replace: true,
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F1EB]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#0B3B2F] text-white shadow-2xl transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex h-24 items-center justify-between border-b border-white/10 px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D3B36F]">
              Lucknow
            </p>

            <h1 className="mt-1 font-serif text-2xl">
              MF Chikankari
            </h1>

            <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/45">
              Admin Panel
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-xl p-2 text-white/70 transition hover:bg-white/10 hover:text-white md:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#D3B36F] text-[#0B3B2F] shadow-md"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={19} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-red-500/15 hover:text-red-200"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-h-screen md:pl-72">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#E2D8C7] bg-[#F8F5F0]/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-[#DDD2C0] bg-white p-2.5 text-[#0F4C3A] shadow-sm md:hidden"
              aria-label="Open sidebar"
            >
              <Menu size={21} />
            </button>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B38E49]">
                Administration
              </p>

              <p className="mt-1 text-sm text-[#6D746F]">
                Manage your store operations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-[#163D31]">
                {adminUser?.firstName || "Admin"}{" "}
                {adminUser?.lastName || "User"}
              </p>

              <p className="text-xs text-[#7B837E]">
                {adminUser?.email || "Administrator"}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0F4C3A] text-sm font-bold text-white shadow-sm">
              {(adminUser?.firstName?.[0] || "A").toUpperCase()}
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}