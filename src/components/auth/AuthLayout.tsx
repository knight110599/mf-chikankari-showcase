import { ArrowLeft, Check, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

const benefits = [
  "Secure account and order management",
  "Faster checkout and saved addresses",
  "Wholesale application and pricing access",
];

export default function AuthLayout({
  eyebrow,
  title,
  description,
  children,
}: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-[#F8F5F0] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-40px)] max-w-7xl overflow-hidden rounded-[32px] border border-[#E8DCC5] bg-white shadow-[0_24px_80px_rgba(28,48,40,0.10)] lg:grid-cols-[0.92fr_1.08fr]">
        <section className="relative hidden overflow-hidden bg-[#0F4C3A] p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full border border-white/10" />
          <div className="absolute -bottom-36 -left-24 h-96 w-96 rounded-full bg-[#C9A86A]/10" />

          <div className="relative z-10">
            <Link
              to="/"
              className="inline-flex items-center gap-3"
              aria-label="Go to MF Chikankari homepage"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#C9A86A]/50 bg-white/10 font-serif text-xl text-[#E8CF97]">
                MF
              </div>

              <div>
                <p className="font-serif text-2xl font-semibold tracking-wide">
                  MF Chikankari
                </p>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                  Lucknow · Since 1998
                </p>
              </div>
            </Link>
          </div>

          <div className="relative z-10 max-w-lg">
            <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <ShieldCheck className="h-7 w-7 text-[#E8CF97]" />
            </div>

            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-[#DCC48E]">
              Premium craftsmanship
            </p>

            <h2 className="font-serif text-5xl leading-[1.08]">
              Tradition, trust and timeless elegance.
            </h2>

            <p className="mt-5 max-w-md leading-7 text-white/70">
              Create your account to manage retail orders, save your favourite
              designs and access our dedicated wholesale experience.
            </p>

            <div className="mt-9 space-y-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[#E8CF97]">
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="text-sm text-white/85">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 text-xs uppercase tracking-[0.22em] text-white/45">
            Handcrafted in Lucknow
          </p>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-16 xl:px-24">
          <div className="w-full max-w-md">
            <Link
              to="/"
              className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-[#617069] transition hover:text-[#0F4C3A]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to store
            </Link>

            <div className="mb-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#9B7B3D]">
                {eyebrow}
              </p>

              <h1 className="font-serif text-4xl font-semibold leading-tight text-[#123C31] sm:text-[44px]">
                {title}
              </h1>

              <p className="mt-4 leading-7 text-[#6B756F]">{description}</p>
            </div>

            {children}

            <p className="mt-9 text-center text-xs leading-6 text-[#87918C]">
              Your information is protected and used according to our{" "}
              <Link
                to="/privacy-policy"
                className="font-medium text-[#0F4C3A] hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}