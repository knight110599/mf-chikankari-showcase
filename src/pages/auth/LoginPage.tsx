import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthInput from "../../components/auth/AuthInput";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthSubmitButton from "../../components/auth/AuthSubmitButton";
import { useAuth } from "../../context/useAuth";
import {
  loginSchema,
  type LoginFormValues,
} from "../../schemas/authSchemas";

interface LoginLocationState {
  from?: {
    pathname?: string;
    search?: string;
    hash?: string;
  };
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
  setServerError("");

  try {
    await login(values);

    const state = location.state as LoginLocationState | null;
    const from = state?.from;

    const destination = from?.pathname
      ? `${from.pathname}${from.search ?? ""}${from.hash ?? ""}`
      : "/account";

    navigate(destination, {
      replace: true,
      state: null,
    });
  } catch (error) {
    setServerError(
      error instanceof Error
        ? error.message
        : "We could not sign you in. Please try again.",
    );
  }
};

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to your account"
      description="Access your orders, saved addresses, favourites and wholesale account."
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
        noValidate
      >
        {serverError ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
          >
            {serverError}
          </div>
        ) : null}

        <AuthInput
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          icon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register("email")}
        />

        <AuthInput
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="Enter your password"
          icon={<LockKeyhole className="h-4 w-4" />}
          error={errors.password?.message}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="text-[#7C8A84] transition hover:text-[#0F4C3A]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          }
          {...register("password")}
        />

        <div className="flex items-center justify-between gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-[#5E6A64]">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-[#CFC4B2] accent-[#0F4C3A]"
              {...register("rememberMe")}
            />
            Remember me
          </label>

          <Link
            to="/forgot-password"
            className="text-sm font-semibold text-[#0F4C3A] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <AuthSubmitButton
          loading={isSubmitting}
          loadingText="Signing in..."
        >
          Sign in
        </AuthSubmitButton>
      </form>

      <p className="mt-7 text-center text-sm text-[#6B756F]">
        New to MF Chikankari?{" "}
        <Link
          to="/signup"
          className="font-semibold text-[#0F4C3A] hover:underline"
        >
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}