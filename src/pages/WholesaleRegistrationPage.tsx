import {
  AlertCircle,
  Building2,
  CheckCircle2,
  LoaderCircle,
  Store,
} from "lucide-react";
import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import { apiRequest } from "../lib/api";

type ApplicationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

interface WholesaleApplication {
  id: string;
  businessName: string;
  businessType: string | null;
  businessPhone: string | null;
  businessEmail: string | null;
  gstNumber: string | null;
  panNumber: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  expectedMonthlyOrderValue: number | null;
  notes: string | null;
  status: ApplicationStatus;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

interface WholesaleApplicationResponse {
  success: boolean;
  message: string;
  data: WholesaleApplication | null;
}

interface WholesaleFormState {
  businessName: string;
  businessType: string;
  businessPhone: string;
  businessEmail: string;
  gstNumber: string;
  panNumber: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  expectedMonthlyOrderValue: string;
  notes: string;
}

const INITIAL_FORM: WholesaleFormState = {
  businessName: "",
  businessType: "",
  businessPhone: "",
  businessEmail: "",
  gstNumber: "",
  panNumber: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  expectedMonthlyOrderValue: "",
  notes: "",
};



function getStatusClasses(status: ApplicationStatus) {
  if (status === "APPROVED") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "REJECTED") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

export default function WholesaleRegistrationPage() {
  const [form, setForm] =
    useState<WholesaleFormState>(INITIAL_FORM);

  const [application, setApplication] =
    useState<WholesaleApplication | null>(null);

  const [isCheckingStatus, setIsCheckingStatus] =
    useState(true);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const loadApplication = async () => {
        try {
          const response =
            await apiRequest<WholesaleApplicationResponse>(
              "/wholesale/me",
              {
            
              },
            );

          setApplication(response.data);
        } catch (error) {
          if (
            error instanceof Error &&
            error.message !== "Authentication required."
          ) {
            setErrorMessage(error.message);
          }
        } finally {
          setIsCheckingStatus(false);
        }
      };

      void loadApplication();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  const updateField = (
    field: keyof WholesaleFormState,
    value: string,
  ) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!form.businessName.trim()) {
      setErrorMessage("Business name is required.");
      return;
    }

    if (!form.addressLine1.trim()) {
      setErrorMessage("Business address is required.");
      return;
    }

    if (
      !form.city.trim() ||
      !form.state.trim() ||
      !form.postalCode.trim()
    ) {
      setErrorMessage(
        "City, state and postal code are required.",
      );
      return;
    }

    const expectedMonthlyOrderValue =
      form.expectedMonthlyOrderValue.trim()
        ? Number(form.expectedMonthlyOrderValue)
        : undefined;

    if (
      expectedMonthlyOrderValue !== undefined &&
      (!Number.isInteger(expectedMonthlyOrderValue) ||
        expectedMonthlyOrderValue < 0)
    ) {
      setErrorMessage(
        "Expected monthly order value must be a whole number.",
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const response =
        await apiRequest<WholesaleApplicationResponse>(
          "/wholesale/apply",
          {
            method: "POST",
        
            body: JSON.stringify({
              businessName: form.businessName.trim(),
              businessType:
                form.businessType.trim() || undefined,
              businessPhone:
                form.businessPhone.trim() || undefined,
              businessEmail:
                form.businessEmail.trim() || undefined,
              gstNumber:
                form.gstNumber.trim().toUpperCase() ||
                undefined,
              panNumber:
                form.panNumber.trim().toUpperCase() ||
                undefined,
              addressLine1: form.addressLine1.trim(),
              addressLine2:
                form.addressLine2.trim() || undefined,
              city: form.city.trim(),
              state: form.state.trim(),
              postalCode: form.postalCode.trim(),
              country: form.country.trim() || "India",
              expectedMonthlyOrderValue,
              notes: form.notes.trim() || undefined,
            }),
          },
        );

      setApplication(response.data);
      setSuccessMessage(response.message);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to submit wholesale application.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingStatus) {
    return (
      <main className="min-h-[65vh] bg-[#F8F5F0] px-4 py-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center rounded-[32px] border border-[#E2D8C7] bg-white px-6 py-20 text-center shadow-sm">
          <LoaderCircle
            size={30}
            className="animate-spin text-[#0F4C3A]"
          />

          <p className="mt-4 text-sm text-[#6D746F]">
            Checking wholesale application status...
          </p>
        </div>
      </main>
    );
  }

  if (application) {
    return (
      <main className="min-h-[65vh] bg-[#F8F5F0] px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-[#E2D8C7] bg-white p-7 shadow-sm sm:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF3F0] text-[#0F4C3A]">
            {application.status === "APPROVED" ? (
              <CheckCircle2 size={27} />
            ) : (
              <Building2 size={27} />
            )}
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#B38E49]">
            Wholesale Application
          </p>

          <h1 className="mt-2 font-serif text-4xl text-[#0F4C3A]">
            {application.businessName}
          </h1>

          <div
            className={`mt-6 inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${getStatusClasses(
              application.status,
            )}`}
          >
            {application.status}
          </div>

          {application.status === "PENDING" && (
            <p className="mt-6 leading-7 text-[#6D746F]">
              Your application has been received and is
              waiting for admin review. Retail pricing will
              remain active until approval.
            </p>
          )}

          {application.status === "APPROVED" && (
            <p className="mt-6 leading-7 text-[#6D746F]">
              Your wholesale account is approved. Wholesale
              pricing will be available after your account
              session is refreshed or you log in again.
            </p>
          )}

          {application.status === "REJECTED" && (
            <>
              <p className="mt-6 leading-7 text-[#6D746F]">
                Your application was not approved. You may
                update the details and submit it again.
              </p>

              {application.rejectionReason && (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
                  <strong>Reason:</strong>{" "}
                  {application.rejectionReason}
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setApplication(null);
                  setSuccessMessage("");
                  setErrorMessage("");
                }}
                className="mt-7 rounded-2xl bg-[#0F4C3A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0B3B2F]"
              >
                Update and reapply
              </button>
            </>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#F8F5F0] px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF3F0] text-[#0F4C3A]">
            <Store size={26} />
          </div>

          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.22em] text-[#B38E49]">
            Partner With Us
          </p>

          <h1 className="mt-3 font-serif text-4xl text-[#0F4C3A] sm:text-5xl">
            Wholesale Registration
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#6D746F]">
            Submit your business details for wholesale
            approval. Approved partners receive wholesale
            pricing and minimum-order access.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-[32px] border border-[#E2D8C7] bg-white p-6 shadow-sm sm:p-9"
        >
          {errorMessage && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0"
              />
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0"
              />
              {successMessage}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Business name"
              required
              value={form.businessName}
              onChange={(value) =>
                updateField("businessName", value)
              }
              placeholder="Your business name"
            />

            <Field
              label="Business type"
              value={form.businessType}
              onChange={(value) =>
                updateField("businessType", value)
              }
              placeholder="Retail store, boutique, reseller"
            />

            <Field
              label="Business phone"
              value={form.businessPhone}
              onChange={(value) =>
                updateField("businessPhone", value)
              }
              placeholder="Business contact number"
            />

            <Field
              label="Business email"
              type="email"
              value={form.businessEmail}
              onChange={(value) =>
                updateField("businessEmail", value)
              }
              placeholder="business@example.com"
            />

            <Field
              label="GST number"
              value={form.gstNumber}
              onChange={(value) =>
                updateField("gstNumber", value)
              }
              placeholder="Optional GST number"
            />

            <Field
              label="PAN number"
              value={form.panNumber}
              onChange={(value) =>
                updateField("panNumber", value)
              }
              placeholder="Optional PAN number"
            />

            <div className="sm:col-span-2">
              <Field
                label="Address line 1"
                required
                value={form.addressLine1}
                onChange={(value) =>
                  updateField("addressLine1", value)
                }
                placeholder="Shop, market or street address"
              />
            </div>

            <div className="sm:col-span-2">
              <Field
                label="Address line 2"
                value={form.addressLine2}
                onChange={(value) =>
                  updateField("addressLine2", value)
                }
                placeholder="Landmark or additional address"
              />
            </div>

            <Field
              label="City"
              required
              value={form.city}
              onChange={(value) =>
                updateField("city", value)
              }
              placeholder="City"
            />

            <Field
              label="State"
              required
              value={form.state}
              onChange={(value) =>
                updateField("state", value)
              }
              placeholder="State"
            />

            <Field
              label="Postal code"
              required
              value={form.postalCode}
              onChange={(value) =>
                updateField("postalCode", value)
              }
              placeholder="Postal code"
            />

            <Field
              label="Country"
              required
              value={form.country}
              onChange={(value) =>
                updateField("country", value)
              }
              placeholder="Country"
            />

            <Field
              label="Expected monthly order value"
              type="number"
              value={form.expectedMonthlyOrderValue}
              onChange={(value) =>
                updateField(
                  "expectedMonthlyOrderValue",
                  value,
                )
              }
              placeholder="Example: 50000"
            />

            <div className="sm:col-span-2">
              <label className="block">
                <span className="text-sm font-semibold text-[#263D35]">
                  Additional notes
                </span>

                <textarea
                  rows={5}
                  maxLength={1000}
                  value={form.notes}
                  onChange={(event) =>
                    updateField(
                      "notes",
                      event.target.value,
                    )
                  }
                  placeholder="Tell us about your business and requirements"
                  className="mt-2 w-full resize-none rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] px-4 py-3 text-sm leading-6 text-[#263D35] outline-none transition placeholder:text-[#9AA09C] focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15"
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0F4C3A] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0B3B2F] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isSubmitting && (
              <LoaderCircle
                size={17}
                className="animate-spin"
              />
            )}

            {isSubmitting
              ? "Submitting..."
              : "Submit Application"}
          </button>
        </form>
      </div>
    </main>
  );
}

interface FieldProps {
  label: string;
  value: string;
  placeholder: string;
  required?: boolean;
  type?: "text" | "email" | "number";
  onChange: (value: string) => void;
}

function Field({
  label,
  value,
  placeholder,
  required = false,
  type = "text",
  onChange,
}: FieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#263D35]">
        {label}
        {required && (
          <span className="text-red-600"> *</span>
        )}
      </span>

      <input
        type={type}
        min={type === "number" ? 0 : undefined}
        step={type === "number" ? 1 : undefined}
        required={required}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-[#DDD2C0] bg-[#FCFAF7] px-4 py-3 text-sm text-[#263D35] outline-none transition placeholder:text-[#9AA09C] focus:border-[#B38E49] focus:ring-2 focus:ring-[#B38E49]/15"
      />
    </label>
  );
}