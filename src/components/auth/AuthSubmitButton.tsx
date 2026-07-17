import { LoaderCircle } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

interface AuthSubmitButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
}

export default function AuthSubmitButton({
  children,
  loading = false,
  loadingText = "Please wait...",
  disabled,
  className = "",
  ...buttonProps
}: AuthSubmitButtonProps) {
  return (
    <button
      {...buttonProps}
      type="submit"
      disabled={disabled || loading}
      className={[
        "flex h-13 w-full items-center justify-center gap-2 rounded-2xl",
        "bg-[#0F4C3A] px-5 text-sm font-semibold text-white",
        "shadow-[0_14px_35px_rgba(15,76,58,0.18)]",
        "transition duration-200 hover:bg-[#0B3F30]",
        "focus:outline-none focus:ring-4 focus:ring-[#0F4C3A]/20",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      ].join(" ")}
    >
      {loading ? (
        <>
          <LoaderCircle className="h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}