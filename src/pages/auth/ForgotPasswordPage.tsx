import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import AuthInput from "../../components/auth/AuthInput";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthSubmitButton from "../../components/auth/AuthSubmitButton";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../../schemas/authSchemas";

export default function ForgotPasswordPage() {
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setServerError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));

      console.log("Forgot password:", values);

      setSubmittedEmail(values.email);
    } catch {
      setServerError(
        "We could not process your request. Please try again shortly.",
      );
    }
  };

  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="Forgot your password?"
      description="Enter your registered email address and we will send you secure instructions to reset your password."
    >
      {submittedEmail ? (
        <div
          role="status"
          className="rounded-[24px] border border-[#CFE0D8] bg-[#F1F8F4] p-6"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#0F4C3A] text-white">
            <CircleCheck className="h-6 w-6" />
          </div>

          <h2 className="font-serif text-2xl font-semibold text-[#123C31]">
            Check your inbox
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#617069]">
            If an account exists for{" "}
            <span className="font-semibold text-[#123C31]">
              {submittedEmail}
            </span>
            , password reset instructions have been sent.
          </p>

          <p className="mt-4 text-xs leading-5 text-[#7B8781]">
            For security, we show the same confirmation whether or not the
            email address is registered.
          </p>

          <Link
            to="/login"
            className="mt-6 inline-flex font-semibold text-[#0F4C3A] hover:underline"
          >
            Return to sign in
          </Link>
        </div>
      ) : (
        <>
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

            <AuthSubmitButton
              loading={isSubmitting}
              loadingText="Sending instructions..."
            >
              Send reset instructions
            </AuthSubmitButton>
          </form>

          <p className="mt-7 text-center text-sm text-[#6B756F]">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#0F4C3A] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
}