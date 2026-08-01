import {
  ChevronRight,
  LogOut,
  Mail,
  MapPin,
  Package,
  ShieldCheck,
  Store,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const accountSections = [
  {
    title: "Orders",
    description: "View your purchases and delivery progress.",
    icon: Package,
    status: "No orders yet",
  },
  {
    title: "Saved addresses",
    description: "Manage delivery and billing addresses.",
    icon: MapPin,
    status: "No addresses saved",
  },
  {
    title: "Wholesale access",
    description: "Check your dealer and wholesale account status.",
    icon: Store,
    status: "Not requested",
  },
];

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userName = user?.name?.trim() || "MF Customer";
  const userEmail = user?.email || "Email not available";
  const userRole = user?.role || "customer";

  const initials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((name: string) => name.charAt(0).toUpperCase())
    .join("");

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <main className="min-h-screen bg-[#F8F5F0] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9B7B3D]">
            My account
          </p>

          <h1 className="mt-3 font-serif text-4xl font-semibold text-[#123C31] sm:text-5xl">
            Welcome, {userName}
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-[#6B756F]">
            Manage your account details, orders, delivery addresses and
            wholesale access from one place.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="h-fit rounded-[28px] border border-[#E8DCC5] bg-white p-6 shadow-sm sm:p-7">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0F4C3A] font-serif text-xl font-semibold text-white">
              {initials || <UserRound className="h-7 w-7" />}
            </div>

            <h2 className="mt-5 font-serif text-2xl font-semibold text-[#123C31]">
              {userName}
            </h2>

            <div className="mt-3 flex items-start gap-2 text-sm text-[#6B756F]">
              <Mail className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="break-all">{userEmail}</span>
            </div>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#F0F6F3] px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#0F4C3A]">
              <ShieldCheck className="h-4 w-4" />
              {userRole} account
            </div>

            <div className="mt-8 border-t border-[#E8DCC5] pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9B7B3D]">
                Account status
              </p>

              <div className="mt-3 flex items-center justify-between rounded-2xl bg-[#FCFAF6] px-4 py-3">
                <span className="text-sm text-[#6B756F]">
                  Authentication
                </span>

                <span className="text-sm font-semibold text-[#0F4C3A]">
                  Active
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#D9C8A8] text-sm font-semibold text-[#0F4C3A] transition hover:border-[#0F4C3A] hover:bg-[#F3F7F5]"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </aside>

          <section className="rounded-[28px] border border-[#E8DCC5] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F2EADB] text-[#9B7B3D]">
                <UserRound className="h-6 w-6" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9B7B3D]">
                  Dashboard
                </p>

                <h2 className="font-serif text-2xl font-semibold text-[#123C31]">
                  Account overview
                </h2>
              </div>
            </div>

            <div className="mt-8 grid gap-4">
              {accountSections.map((section) => {
                const Icon = section.icon;

                return (
                  <article
                    key={section.title}
                    className="group flex flex-col gap-5 rounded-[22px] border border-[#E8DCC5] bg-[#FCFAF6] p-5 transition hover:border-[#C9A86A] sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#0F4C3A] shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div>
                        <h3 className="font-serif text-xl font-semibold text-[#123C31]">
                          {section.title}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-[#6B756F]">
                          {section.description}
                        </p>

                        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#9B7B3D]">
                          {section.status}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="hidden h-5 w-5 shrink-0 text-[#B7A787] transition group-hover:translate-x-1 group-hover:text-[#0F4C3A] sm:block" />
                  </article>
                );
              })}
            </div>

            <div className="mt-8 rounded-[24px] border border-dashed border-[#D9C8A8] bg-[#FCFAF6] px-6 py-10 text-center">
              <Package className="mx-auto h-10 w-10 text-[#B7A787]" />

              <h3 className="mt-4 font-serif text-xl font-semibold text-[#123C31]">
                Start exploring our collection
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6B756F]">
                Once you place an order, its details and delivery progress will
                appear inside your account.
              </p>

              <button
                type="button"
                onClick={() => navigate("/products")}
                className="mt-6 rounded-full bg-[#0F4C3A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0B3F30]"
              >
                Explore collection
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}