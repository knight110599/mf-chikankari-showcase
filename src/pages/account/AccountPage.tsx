import {
  LogOut,
  Mail,
  Package,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <main className="min-h-screen bg-[#F8F5F0] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9B7B3D]">
            My account
          </p>

          <h1 className="mt-3 font-serif text-4xl font-semibold text-[#123C31] sm:text-5xl">
            Welcome, {user?.name}
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-[#6B756F]">
            Manage your personal details, orders, saved addresses and wholesale
            access.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <aside className="rounded-[28px] border border-[#E8DCC5] bg-white p-6 shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0F4C3A] text-white">
              <UserRound className="h-7 w-7" />
            </div>

            <h2 className="mt-5 font-serif text-2xl font-semibold text-[#123C31]">
              {user?.name}
            </h2>

            <div className="mt-3 flex items-center gap-2 text-sm text-[#6B756F]">
              <Mail className="h-4 w-4" />
              <span className="break-all">{user?.email}</span>
            </div>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#F0F6F3] px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#0F4C3A]">
              <ShieldCheck className="h-4 w-4" />
              {user?.role} account
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
                <Package className="h-6 w-6" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9B7B3D]">
                  Orders
                </p>

                <h2 className="font-serif text-2xl font-semibold text-[#123C31]">
                  Your order history
                </h2>
              </div>
            </div>

            <div className="mt-10 rounded-[24px] border border-dashed border-[#D9C8A8] bg-[#FCFAF6] px-6 py-12 text-center">
              <Package className="mx-auto h-10 w-10 text-[#B7A787]" />

              <h3 className="mt-4 font-serif text-xl font-semibold text-[#123C31]">
                No orders yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6B756F]">
                Once you place your first order, its details and delivery
                progress will appear here.
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