import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import AuthInput from "../../components/auth/AuthInput";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthSubmitButton from "../../components/auth/AuthSubmitButton";
import { useAuth } from "../../context/useAuth";
import {
  signupSchema,
  type SignupFormValues,
} from "../../schemas/authSchemas";

export default function SignupPage() {
  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [serverError, setServerError] =
    useState("");

  const navigate = useNavigate();
  const { signup } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (
    values: SignupFormValues,
  ) => {
    setServerError("");

    try {
      await signup({
  firstName: values.firstName.trim(),
  lastName: values.lastName.trim(),
  email: values.email.trim().toLowerCase(),
  phone: values.phone.trim(),
  password: values.password,
  confirmPassword: values.confirmPassword,
  acceptTerms: values.acceptTerms,
});

      navigate("/account", {
        replace: true,
      });
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Your account could not be created. Please try again shortly.",
      );
    }
  };

  return (
    <AuthLayout
      eyebrow="Create your account"
      title="Join MF Chikankari"
      description="Save your favourites, track orders and unlock a more personalised shopping experience."
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

        <div className="grid gap-5 sm:grid-cols-2">
          <AuthInput
            label="First name"
            type="text"
            autoComplete="given-name"
            placeholder="Akash"
            icon={
              <UserRound className="h-4 w-4" />
            }
            error={errors.firstName?.message}
            {...register("firstName")}
          />

          <AuthInput
            label="Last name"
            type="text"
            autoComplete="family-name"
            placeholder="Verma"
            icon={
              <UserRound className="h-4 w-4" />
            }
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>

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
          label="Mobile number"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          maxLength={10}
          placeholder="9876543210"
          icon={<Phone className="h-4 w-4" />}
          error={errors.phone?.message}
          {...register("phone")}
        />

        <AuthInput
          label="Password"
          type={
            showPassword
              ? "text"
              : "password"
          }
          autoComplete="new-password"
          placeholder="Create a secure password"
          icon={
            <LockKeyhole className="h-4 w-4" />
          }
          error={errors.password?.message}
          rightElement={
            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (current) => !current,
                )
              }
              className="text-[#7C8A84] transition hover:text-[#0F4C3A]"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
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

        <AuthInput
          label="Confirm password"
          type={
            showConfirmPassword
              ? "text"
              : "password"
          }
          autoComplete="new-password"
          placeholder="Enter your password again"
          icon={
            <LockKeyhole className="h-4 w-4" />
          }
          error={errors.confirmPassword?.message}
          rightElement={
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  (current) => !current,
                )
              }
              className="text-[#7C8A84] transition hover:text-[#0F4C3A]"
              aria-label={
                showConfirmPassword
                  ? "Hide confirmed password"
                  : "Show confirmed password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          }
          {...register("confirmPassword")}
        />

        <div>
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#5E6A64]">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 shrink-0 rounded border-[#CFC4B2] accent-[#0F4C3A]"
              {...register("acceptTerms")}
            />

            <span>
              I agree to the{" "}
              <Link
                to="/terms"
                className="font-semibold text-[#0F4C3A] hover:underline"
              >
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy-policy"
                className="font-semibold text-[#0F4C3A] hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          {errors.acceptTerms?.message ? (
            <p className="mt-2 text-sm text-red-600">
              {errors.acceptTerms.message}
            </p>
          ) : null}
        </div>

        <AuthSubmitButton
          loading={isSubmitting}
          loadingText="Creating account..."
        >
          Create account
        </AuthSubmitButton>
      </form>

      <p className="mt-7 text-center text-sm text-[#6B756F]">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-[#0F4C3A] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}