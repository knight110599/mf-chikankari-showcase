import { LogOut, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminUser");

    navigate("/admin/login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-[#F4F1EB] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 rounded-[28px] border border-[#E2D8C7] bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F4C3A] text-white">
              <ShieldCheck size={24} />
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B38E49]">
              Secure Admin Area
            </p>

            <h1 className="mt-2 font-serif text-4xl text-[#0F4C3A]">
              Admin Dashboard
            </h1>

            <p className="mt-3 text-sm text-[#6D746F]">
              Protected admin route is working successfully.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 rounded-2xl border border-[#D8CCB9] px-5 py-3 text-sm font-semibold text-[#0F4C3A] transition hover:bg-[#F3EEE5]"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}