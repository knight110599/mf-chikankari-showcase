import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronRight,
  MapPin,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import type { CartItem } from "../context/CartContext";

import { useCart } from "../context/useCart";
import { createOrder } from "../services/order.service";

const WHATSAPP_NUMBER = "916386826199";

type CheckoutFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  orderNotes: string;
};

type CheckoutFormErrors = Partial<
  Record<keyof CheckoutFormData, string>
>;

const initialFormData: CheckoutFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  orderNotes: "",
};

function getProductImage(item: CartItem) {
  const images = Array.isArray(item.images)
    ? [...item.images]
    : [];

  const sortedImages = images.sort(
    (firstImage, secondImage) =>
      firstImage.sortOrder - secondImage.sortOrder,
  );

  const primaryImage = sortedImages.find(
    (image) => image.isPrimary,
  );

  return (
    primaryImage?.url ??
    sortedImages[0]?.url ??
    "/placeholder-product.jpg"
  );
}

function CheckoutPage() {
  const navigate = useNavigate();

  const { cartItems, cartCount, subtotal, clearCart } = useCart();

  const [formData, setFormData] =
    useState<CheckoutFormData>(initialFormData);

  const [errors, setErrors] =
    useState<CheckoutFormErrors>({});

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [submitError, setSubmitError] =
    useState("");

  const [acceptTerms, setAcceptTerms] =
    useState(false);

  const total = subtotal;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  function handleInputChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: undefined,
    }));
  }

  function validateForm() {
    const nextErrors: CheckoutFormErrors = {};

    if (!formData.firstName.trim()) {
      nextErrors.firstName =
        "First name is required.";
    }

    if (!formData.lastName.trim()) {
      nextErrors.lastName =
        "Last name is required.";
    }

    if (!formData.email.trim()) {
      nextErrors.email =
        "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim(),
      )
    ) {
      nextErrors.email =
        "Enter a valid email address.";
    }

    const normalisedPhone = formData.phone.replace(
      /\D/g,
      "",
    );

    if (!normalisedPhone) {
      nextErrors.phone =
        "Phone number is required.";
    } else if (
      normalisedPhone.length < 10 ||
      normalisedPhone.length > 15
    ) {
      nextErrors.phone =
        "Enter a valid phone number.";
    }

    if (!formData.addressLine1.trim()) {
      nextErrors.addressLine1 =
        "Street address is required.";
    }

    if (!formData.city.trim()) {
      nextErrors.city = "City is required.";
    }

    if (!formData.state.trim()) {
      nextErrors.state = "State is required.";
    }

    if (!formData.postalCode.trim()) {
      nextErrors.postalCode =
        "Postal code is required.";
    } else if (
      !/^[1-9][0-9]{5}$/.test(
        formData.postalCode.trim(),
      )
    ) {
      nextErrors.postalCode =
        "Enter a valid 6-digit postal code.";
    }

    if (!formData.country.trim()) {
      nextErrors.country =
        "Country is required.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function createWhatsAppMessage(orderNumber: string) {
    const customerName =
      `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();

    const completeAddress = [
      formData.addressLine1.trim(),
      formData.addressLine2.trim(),
      formData.city.trim(),
      formData.state.trim(),
      formData.postalCode.trim(),
      formData.country.trim(),
    ]
      .filter(Boolean)
      .join(", ");

    const productDetails = cartItems
      .map((item, index) => {
        const itemPrice = Number(item.price);
        const itemTotal =
          itemPrice * item.quantity;

        const sizeLine = item.selectedSize
          ? `Size: ${item.selectedSize}`
          : "Size: Not selected";

        return [
          `${index + 1}. ${item.name}`,
          sizeLine,
          `Quantity: ${item.quantity}`,
          `Price: ₹${itemPrice.toLocaleString("en-IN")}`,
          `Item Total: ₹${itemTotal.toLocaleString("en-IN")}`,
        ].join("\n");
      })
      .join("\n\n");

    const notes = formData.orderNotes.trim()
      ? formData.orderNotes.trim()
      : "No special instructions";

    return [
      "Hello MF Chikankari,",
      "",
      "I would like to confirm the following order.",
      "",
      "*ORDER REFERENCE*",
      `Order Number: ${orderNumber}`,
      "",
      "*CUSTOMER DETAILS*",
      `Name: ${customerName}`,
      `Phone: ${formData.phone.trim()}`,
      `Email: ${formData.email.trim()}`,
      "",
      "*DELIVERY ADDRESS*",
      completeAddress,
      "",
      "*ORDER ITEMS*",
      productDetails,
      "",
      "*ORDER SUMMARY*",
      `Total Items: ${cartCount}`,
      `Subtotal: ₹${subtotal.toLocaleString("en-IN")}`,
      "Delivery Charges: To be confirmed",
      `Order Total: ₹${total.toLocaleString("en-IN")} + delivery charges`,
      "",
      "*ORDER NOTES*",
      notes,
      "",
      "Please confirm product availability, delivery charges and payment details.",
      "",
      "Thank you.",
    ].join("\n");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    if (!acceptTerms) {
      window.alert(
        "Please confirm that your delivery information is correct.",
      );

      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createOrder({
        customerFirstName: formData.firstName.trim(),
        customerLastName: formData.lastName.trim(),
        customerEmail: formData.email.trim(),
        customerPhone: formData.phone.trim(),
        addressLine1: formData.addressLine1.trim(),
        addressLine2:
          formData.addressLine2.trim() || undefined,
        city: formData.city.trim(),
        state: formData.state.trim(),
        postalCode: formData.postalCode.trim(),
        country: formData.country.trim(),
        orderNotes:
          formData.orderNotes.trim() || undefined,
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          selectedSize:
            item.selectedSize || undefined,
        })),
      });

      const message = createWhatsAppMessage(
        response.data.orderNumber,
      );

      const whatsappUrl =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
          message,
        )}`;

      const whatsappWindow = window.open(
        whatsappUrl,
        "_blank",
        "noopener,noreferrer",
      );

      clearCart();

      if (!whatsappWindow) {
        window.location.href = whatsappUrl;
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "The order could not be created. Please try again.";

      setSubmitError(message);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (cartItems.length === 0) {
    return (
      <main className="flex min-h-[75vh] items-center bg-[#F8F5F0]">
        <motion.section
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto w-full max-w-2xl px-5 py-20 text-center sm:px-8"
        >
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-[#E3D8C5] bg-white text-[#0F4C3A] shadow-[0_18px_50px_rgba(15,76,58,0.08)]">
            <ShoppingBag
              size={38}
              aria-hidden="true"
            />
          </div>

          <p
            className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-[#A47E3B]"
            style={{ fontFamily: "Poppins" }}
          >
            Checkout
          </p>

          <h1
            className="mt-4 text-5xl leading-tight text-[#0F4C3A] sm:text-6xl"
            style={{
              fontFamily: "Cormorant Garamond",
            }}
          >
            Your cart is empty
          </h1>

          <p
            className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#68756F] sm:text-base"
            style={{ fontFamily: "Poppins" }}
          >
            Add products to your cart before proceeding
            to checkout.
          </p>

          <Link
            to="/products"
            className="mt-9 inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#0F4C3A] px-8 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0A3D2F]"
            style={{ fontFamily: "Poppins" }}
          >
            Explore Products

            <ChevronRight
              size={17}
              aria-hidden="true"
            />
          </Link>
        </motion.section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F5F0]">
      <section className="border-b border-[#E8DCC5] bg-white/50">
        <div className="mx-auto max-w-[1500px] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#64716C] transition hover:text-[#0F4C3A]"
            style={{ fontFamily: "Poppins" }}
          >
            <ArrowLeft
              size={17}
              aria-hidden="true"
            />

            Return to Cart
          </button>

          <div className="mt-8">
            <p
              className="text-xs font-semibold uppercase tracking-[0.28em] text-[#A47E3B]"
              style={{ fontFamily: "Poppins" }}
            >
              Order checkout
            </p>

            <h1
              className="mt-3 text-5xl leading-none text-[#0F4C3A] sm:text-6xl"
              style={{
                fontFamily: "Cormorant Garamond",
              }}
            >
              Complete Your Order
            </h1>

            <p
              className="mt-5 max-w-2xl text-sm leading-7 text-[#6B7772] sm:text-base"
              style={{ fontFamily: "Poppins" }}
            >
              Enter your delivery details and confirm
              your order directly with the MF Chikankari
              team on WhatsApp.
            </p>
          </div>
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto grid max-w-[1500px] gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_410px] lg:items-start lg:px-12 lg:py-16"
      >
        <div className="space-y-8">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[30px] border border-[#E3D8C5] bg-white p-6 shadow-[0_18px_55px_rgba(15,76,58,0.05)] sm:p-8"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EEF3F0] text-[#0F4C3A]">
                <MapPin
                  size={21}
                  aria-hidden="true"
                />
              </div>

              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-[0.22em] text-[#A47E3B]"
                  style={{ fontFamily: "Poppins" }}
                >
                  Step 1
                </p>

                <h2
                  className="mt-1 text-3xl text-[#0F4C3A]"
                  style={{
                    fontFamily: "Cormorant Garamond",
                  }}
                >
                  Delivery Address
                </h2>
              </div>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <CheckoutInput
                label="First name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
                autoComplete="given-name"
                required
              />

              <CheckoutInput
                label="Last name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                error={errors.lastName}
                autoComplete="family-name"
                required
              />

              <CheckoutInput
                label="Email address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                autoComplete="email"
                required
              />

              <CheckoutInput
                label="Phone number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                error={errors.phone}
                autoComplete="tel"
                inputMode="tel"
                required
              />

              <div className="sm:col-span-2">
                <CheckoutInput
                  label="Street address"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  error={errors.addressLine1}
                  autoComplete="address-line1"
                  placeholder="House number and street name"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <CheckoutInput
                  label="Apartment, suite or landmark"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                  autoComplete="address-line2"
                  placeholder="Optional"
                />
              </div>

              <CheckoutInput
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                error={errors.city}
                autoComplete="address-level2"
                required
              />

              <CheckoutInput
                label="State"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                error={errors.state}
                autoComplete="address-level1"
                required
              />

              <CheckoutInput
                label="Postal code"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                error={errors.postalCode}
                autoComplete="postal-code"
                inputMode="numeric"
                maxLength={6}
                required
              />

              <CheckoutInput
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                error={errors.country}
                autoComplete="country-name"
                required
              />

              <div className="sm:col-span-2">
                <label
                  htmlFor="orderNotes"
                  className="block text-sm font-medium text-[#31433C]"
                  style={{ fontFamily: "Poppins" }}
                >
                  Order notes
                </label>

                <textarea
                  id="orderNotes"
                  name="orderNotes"
                  value={formData.orderNotes}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Delivery instructions or special requests"
                  className="mt-2 w-full resize-none rounded-[18px] border border-[#DCCFB9] bg-[#FCFAF7] px-4 py-3.5 text-sm text-[#263A32] outline-none transition placeholder:text-[#9AA39F] focus:border-[#0F4C3A] focus:bg-white focus:ring-4 focus:ring-[#0F4C3A]/10"
                  style={{ fontFamily: "Poppins" }}
                />
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="rounded-[30px] border border-[#E3D8C5] bg-white p-6 shadow-[0_18px_55px_rgba(15,76,58,0.05)] sm:p-8"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EAF7EE] text-[#16803C]">
                <MessageCircle
                  size={22}
                  aria-hidden="true"
                />
              </div>

              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-[0.22em] text-[#A47E3B]"
                  style={{ fontFamily: "Poppins" }}
                >
                  Step 2
                </p>

                <h2
                  className="mt-1 text-3xl text-[#0F4C3A]"
                  style={{
                    fontFamily: "Cormorant Garamond",
                  }}
                >
                  Confirm on WhatsApp
                </h2>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <ConfirmationStep
                number="1"
                title="Review your order"
                description="Check your selected products, sizes, quantities and delivery address."
              />

              <ConfirmationStep
                number="2"
                title="Open WhatsApp"
                description="Your complete order details will be added automatically to the message."
              />

              <ConfirmationStep
                number="3"
                title="Complete confirmation"
                description="Our team will confirm availability, delivery charges and payment details."
              />
            </div>

            <div
              className="mt-6 rounded-[20px] border border-[#CFE5D6] bg-[#F2FAF4] px-5 py-4 text-sm leading-6 text-[#376146]"
              style={{ fontFamily: "Poppins" }}
            >
              Clicking the confirmation button will not
              send the message automatically. You can
              review your order message in WhatsApp before
              sending it.
            </div>
          </motion.section>

          <label
            className="flex cursor-pointer items-start gap-3 rounded-[22px] border border-[#E3D8C5] bg-white p-5"
            style={{ fontFamily: "Poppins" }}
          >
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(event) =>
                setAcceptTerms(event.target.checked)
              }
              className="mt-1 h-4 w-4 accent-[#0F4C3A]"
            />

            <span className="text-sm leading-6 text-[#65726D]">
              I confirm that the products, selected sizes
              and delivery information provided above are
              correct.
            </span>
          </label>
        </div>

        <aside className="lg:sticky lg:top-28">
          <div className="overflow-hidden rounded-[30px] border border-[#E3D8C5] bg-white shadow-[0_22px_65px_rgba(15,76,58,0.09)]">
            <div className="bg-[#0F4C3A] p-7 text-white">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D8BC80]"
                style={{ fontFamily: "Poppins" }}
              >
                {cartCount}{" "}
                {cartCount === 1 ? "item" : "items"}
              </p>

              <h2
                className="mt-3 text-4xl"
                style={{
                  fontFamily: "Cormorant Garamond",
                }}
              >
                Order Summary
              </h2>
            </div>

            <div className="max-h-[430px] space-y-5 overflow-y-auto p-6">
              {cartItems.map((item) => {
                const itemPrice = Number(item.price);

                const itemTotal =
                  itemPrice * item.quantity;

                return (
                  <article
                    key={`${item.id}-${item.selectedSize}`}
                    className="flex gap-4"
                  >
                    <Link
                      to={`/products/${item.slug}`}
                      className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[16px] bg-[#EFE8DB]"
                    >
                      <img
                        src={getProductImage(item)}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />

                      <span
                        className="absolute right-1 top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#0F4C3A] px-1 text-[10px] font-semibold text-white"
                        style={{
                          fontFamily: "Poppins",
                        }}
                      >
                        {item.quantity}
                      </span>
                    </Link>

                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/products/${item.slug}`}
                        className="line-clamp-2 text-base font-semibold leading-6 text-[#0F4C3A] transition hover:text-[#A47E3B]"
                        style={{
                          fontFamily:
                            "Cormorant Garamond",
                        }}
                      >
                        {item.name}
                      </Link>

                      {item.selectedSize && (
                        <p
                          className="mt-1 text-xs text-[#7B8782]"
                          style={{
                            fontFamily: "Poppins",
                          }}
                        >
                          Size: {item.selectedSize}
                        </p>
                      )}

                      <p
                        className="mt-2 text-sm font-semibold text-[#31433C]"
                        style={{
                          fontFamily: "Poppins",
                        }}
                      >
                        ₹
                        {itemTotal.toLocaleString(
                          "en-IN",
                        )}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="border-t border-[#E8DCC5] p-7">
              <div
                className="space-y-4 text-sm"
                style={{ fontFamily: "Poppins" }}
              >
                <div className="flex justify-between gap-4 text-[#66736E]">
                  <span>Subtotal</span>

                  <span className="font-semibold text-[#0F4C3A]">
                    ₹
                    {subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-[#66736E]">
                  <span>Delivery</span>
                  <span>To be confirmed</span>
                </div>

                <div className="flex justify-between gap-4 text-[#66736E]">
                  <span>Order confirmation</span>
                  <span>WhatsApp</span>
                </div>
              </div>

              <div className="my-6 border-t border-[#E8DCC5]" />

              <div className="flex items-end justify-between gap-4">
                <div>
                  <p
                    className="text-sm font-semibold text-[#0F4C3A]"
                    style={{ fontFamily: "Poppins" }}
                  >
                    Estimated Total
                  </p>

                  <p
                    className="mt-1 text-xs text-[#81908A]"
                    style={{ fontFamily: "Poppins" }}
                  >
                    Delivery charges excluded
                  </p>
                </div>

                <p
                  className="text-4xl font-semibold text-[#0F4C3A]"
                  style={{
                    fontFamily: "Cormorant Garamond",
                  }}
                >
                  ₹{total.toLocaleString("en-IN")}
                </p>
              </div>

              {submitError && (
                <div
                  role="alert"
                  className="mb-4 rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                  style={{ fontFamily: "Poppins" }}
                >
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-7 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#16803C] px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#116B32] hover:shadow-[0_14px_35px_rgba(22,128,60,0.24)] disabled:cursor-not-allowed disabled:opacity-60"
                style={{ fontFamily: "Poppins" }}
              >
                <MessageCircle
                  size={19}
                  aria-hidden="true"
                />

                {isSubmitting
                  ? "Saving Order..."
                  : "Confirm Order on WhatsApp"}
              </button>

              <p
                className="mt-3 text-center text-[11px] leading-5 text-[#81908A]"
                style={{ fontFamily: "Poppins" }}
              >
                You can review the message before sending
                it to our team.
              </p>

              <div className="mt-6 grid gap-3">
                <CheckoutBenefit
                  icon={<ShieldCheck size={17} />}
                  text="Order details remain under your control"
                />

                <CheckoutBenefit
                  icon={<PackageCheck size={17} />}
                  text="Availability confirmed before payment"
                />
              </div>
            </div>
          </div>
        </aside>
      </form>
    </main>
  );
}

type CheckoutInputProps = {
  label: string;
  name: keyof CheckoutFormData;
  value: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?:
    | "text"
    | "email"
    | "tel"
    | "numeric"
    | "decimal"
    | "search"
    | "url";
  maxLength?: number;
  required?: boolean;
};

function CheckoutInput({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
  maxLength,
  required = false,
}: CheckoutInputProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-[#31433C]"
        style={{ fontFamily: "Poppins" }}
      >
        {label}

        {required && (
          <span className="ml-1 text-[#A15B49]">
            *
          </span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${name}-error` : undefined
        }
        className={`mt-2 h-13 w-full rounded-[16px] border bg-[#FCFAF7] px-4 text-sm text-[#263A32] outline-none transition placeholder:text-[#9AA39F] focus:bg-white focus:ring-4 ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
            : "border-[#DCCFB9] focus:border-[#0F4C3A] focus:ring-[#0F4C3A]/10"
        }`}
        style={{ fontFamily: "Poppins" }}
      />

      {error && (
        <p
          id={`${name}-error`}
          className="mt-1.5 text-xs text-red-600"
          style={{ fontFamily: "Poppins" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

type ConfirmationStepProps = {
  number: string;
  title: string;
  description: string;
};

function ConfirmationStep({
  number,
  title,
  description,
}: ConfirmationStepProps) {
  return (
    <div className="flex gap-4 rounded-[20px] border border-[#E5DDD0] bg-[#FCFAF7] p-5">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0F4C3A] text-xs font-semibold text-white"
        style={{ fontFamily: "Poppins" }}
      >
        {number}
      </span>

      <div>
        <h3
          className="text-sm font-semibold text-[#263A32]"
          style={{ fontFamily: "Poppins" }}
        >
          {title}
        </h3>

        <p
          className="mt-1 text-xs leading-5 text-[#73807B]"
          style={{ fontFamily: "Poppins" }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

type CheckoutBenefitProps = {
  icon: ReactNode;
  text: string;
};

function CheckoutBenefit({
  icon,
  text,
}: CheckoutBenefitProps) {
  return (
    <div
      className="flex items-center gap-2 text-xs text-[#73807B]"
      style={{ fontFamily: "Poppins" }}
    >
      <span className="text-[#0F4C3A]">
        {icon}
      </span>

      <span>{text}</span>
    </div>
  );
}

export default CheckoutPage;