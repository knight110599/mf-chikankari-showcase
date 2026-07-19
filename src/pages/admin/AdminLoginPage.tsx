import { useState } from "react";
import {
  Boxes,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  LogIn,
  Mail,
  PackageSearch,
  ShieldCheck,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const adminLoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must contain at least 6 characters"),
});

type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

type LoginResponse = {
  success: boolean;
  message?: string;
  accessToken?: string;
  token?: string;
  user?: {
    id: string;
    name?: string;
    email: string;
    role: string;
  };
};

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: AdminLoginFormData) => {
    setServerError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = (await response.json()) as LoginResponse;

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to login");
      }

      if (result.user?.role !== "ADMIN") {
        throw new Error("You are not authorized to access the admin panel.");
      }

      const token = result.accessToken || result.token;

      if (token) {
        localStorage.setItem("adminAccessToken", token);
      }

      localStorage.setItem("adminUser", JSON.stringify(result.user));

      setSuccessMessage("Admin login successful.");
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  return (
  <main className="min-h-screen bg-[#0B2F24] px-4 py-8 sm:px-6 lg:px-8">
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-[#103C2F] shadow-[0_35px_90px_rgba(0,0,0,0.35)] lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden border-r border-white/10 p-12 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-[#C9A86A]/30 bg-[#C9A86A]/10 px-4 py-2 text-sm text-[#E5D3A7]">
              <ShieldCheck size={18} />
              Restricted Administration
            </div>

            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#C9A86A]">
              MF Chikankari
            </p>

            <h1 className="mt-5 max-w-lg font-serif text-5xl leading-tight text-white">
              Admin Control Panel
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-white/65">
              Securely manage products, categories, inventory, pricing and store
              operations from one protected workspace.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <PackageSearch className="text-[#C9A86A]" size={24} />
              <p className="mt-4 font-medium text-white">Catalog Control</p>
              <p className="mt-2 text-sm leading-6 text-white/50">
                Manage products and categories.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <Boxes className="text-[#C9A86A]" size={24} />
              <p className="mt-4 font-medium text-white">Inventory Access</p>
              <p className="mt-2 text-sm leading-6 text-white/50">
                Track stock and wholesale settings.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#F8F5F0] p-6 sm:p-10 lg:p-12">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0F4C3A] text-white shadow-lg">
                <ShieldCheck size={30} />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#B38E49]">
                Authorized Access Only
              </p>

              <h2 className="mt-3 font-serif text-4xl text-[#0F4C3A]">
                Admin Sign In
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#6D746F]">
                Enter your administrator credentials to continue.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
              noValidate
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#263D35]"
                >
                  Admin Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7B857F]"
                  />

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="admin@mfchikankari.com"
                    {...register("email")}
                    className={`w-full rounded-2xl border bg-white py-3.5 pl-12 pr-4 text-sm text-[#263D35] outline-none transition focus:ring-4 ${
                      errors.email
                        ? "border-red-400 focus:ring-red-100"
                        : "border-[#D9CEBC] focus:border-[#0F4C3A] focus:ring-[#0F4C3A]/10"
                    }`}
                  />
                </div>

                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#263D35]"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7B857F]"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter admin password"
                    {...register("password")}
                    className={`w-full rounded-2xl border bg-white py-3.5 pl-12 pr-12 text-sm text-[#263D35] outline-none transition focus:ring-4 ${
                      errors.password
                        ? "border-red-400 focus:ring-red-100"
                        : "border-[#D9CEBC] focus:border-[#0F4C3A] focus:ring-[#0F4C3A]/10"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7B857F] transition hover:text-[#0F4C3A]"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {serverError && (
                <div
                  role="alert"
                  className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {serverError}
                </div>
              )}

              {successMessage && (
                <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {successMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0F4C3A] px-5 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-[#0B3C2E] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Access Admin Panel
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 rounded-2xl border border-[#E2D8C7] bg-white/70 p-4 text-center">
              <p className="text-xs leading-5 text-[#7B837E]">
                This portal is monitored and restricted to authorized
                administrators only.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>
);
}