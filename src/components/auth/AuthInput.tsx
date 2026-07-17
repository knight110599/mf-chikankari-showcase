import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  (
    {
      label,
      error,
      icon,
      rightElement,
      id,
      className = "",
      ...inputProps
    },
    ref,
  ) => {
    const inputId = id ?? inputProps.name;

    return (
      <div className="space-y-2">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-[#183F35]"
        >
          {label}
        </label>

        <div className="relative">
          {icon ? (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#7C8A84]">
              {icon}
            </div>
          ) : null}

          <input
            {...inputProps}
            ref={ref}
            id={inputId}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={[
              "h-13 w-full rounded-2xl border bg-white/80 text-[15px] text-[#183F35]",
              "outline-none transition duration-200",
              "placeholder:text-[#9BA59F]",
              "focus:border-[#0F4C3A] focus:bg-white focus:ring-4 focus:ring-[#0F4C3A]/10",
              error
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                : "border-[#DDD2BF]",
              icon ? "pl-12" : "pl-4",
              rightElement ? "pr-12" : "pr-4",
              className,
            ].join(" ")}
          />

          {rightElement ? (
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
              {rightElement}
            </div>
          ) : null}
        </div>

        {error ? (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-sm text-red-600"
          >
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

AuthInput.displayName = "AuthInput";

export default AuthInput;