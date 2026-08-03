import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useCart } from "../context/useCart";
import type { CartItem } from "../context/CartContext";

function getProductImage(item: CartItem) {
  const sortedImages = [...item.images].sort(
    (a, b) => a.sortOrder - b.sortOrder,
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

function CartPage() {
  const {
    cartItems,
    subtotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <main className="flex min-h-[75vh] items-center bg-[#F8F5F0]">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-3xl px-5 py-20 text-center sm:px-8"
        >
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-[#E3D8C5] bg-white text-[#0F4C3A] shadow-[0_18px_50px_rgba(15,76,58,0.08)]">
            <ShoppingBag size={38} aria-hidden="true" />
          </div>

          <p
            className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-[#A47E3B]"
            style={{ fontFamily: "Poppins" }}
          >
            Your shopping bag
          </p>

          <h1
            className="mt-4 text-5xl leading-tight text-[#0F4C3A] sm:text-6xl"
            style={{ fontFamily: "Cormorant Garamond" }}
          >
            Your cart is empty
          </h1>

          <p
            className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#68756F] sm:text-base"
            style={{ fontFamily: "Poppins" }}
          >
            Explore our handcrafted Lucknowi Chikankari
            collection and add your favourite pieces to the
            cart.
          </p>

          <Link
            to="/products"
            className="mt-9 inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#0F4C3A] px-8 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0A3D2F] hover:shadow-lg"
            style={{ fontFamily: "Poppins" }}
          >
            Explore Products
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </motion.section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F5F0]">
      <section className="border-b border-[#E8DCC5] bg-white/45">
        <div className="mx-auto max-w-[1500px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#64716C] transition hover:text-[#0F4C3A]"
            style={{ fontFamily: "Poppins" }}
          >
            <ArrowLeft size={17} aria-hidden="true" />
            Continue Shopping
          </Link>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.28em] text-[#A47E3B]"
                style={{ fontFamily: "Poppins" }}
              >
                Your selection
              </p>

              <h1
                className="mt-3 text-5xl leading-none text-[#0F4C3A] sm:text-6xl"
                style={{ fontFamily: "Cormorant Garamond" }}
              >
                Shopping Cart
              </h1>
            </div>

            <button
              type="button"
              onClick={clearCart}
              className="inline-flex w-fit items-center gap-2 text-sm font-medium text-[#8B5E52] transition hover:text-red-700"
              style={{ fontFamily: "Poppins" }}
            >
              <Trash2 size={16} aria-hidden="true" />
              Clear Cart
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1500px] gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_390px] lg:items-start lg:px-12 lg:py-16">
        <div className="space-y-5">
          {cartItems.map((item, index) => {
            const price = item.unitPrice;
const itemTotal = item.unitPrice * item.quantity;
            const productImage = getProductImage(item);

            return (
              <motion.article
                key={`${item.id}-${item.selectedSize}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                }}
                className="overflow-hidden rounded-[28px] border border-[#E3D8C5] bg-white shadow-[0_16px_50px_rgba(15,76,58,0.05)]"
              >
                <div className="grid gap-5 p-5 sm:grid-cols-[150px_1fr] sm:p-6">
                  <Link
                    to={`/products/${item.slug}`}
                    className="block overflow-hidden rounded-[22px] bg-[#EFE8DB]"
                  >
                    <img
                      src={productImage}
                      alt={item.name}
                      className="aspect-[4/5] h-full w-full object-cover transition duration-500 hover:scale-105"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <Link
                          to={`/categories/${item.category.slug}`}
                          className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A47E3B] transition hover:text-[#0F4C3A]"
                          style={{ fontFamily: "Poppins" }}
                        >
                          {item.category.name}
                        </Link>

                        <Link to={`/products/${item.slug}`}>
                          <h2
                            className="mt-2 text-3xl leading-tight text-[#0F4C3A] transition hover:text-[#A47E3B]"
                            style={{
                              fontFamily: "Cormorant Garamond",
                            }}
                          >
                            {item.name}
                          </h2>
                        </Link>

                        <p
                          className="mt-2 text-xs text-[#7B8782]"
                          style={{ fontFamily: "Poppins" }}
                        >
                          SKU: {item.sku}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(
                            item.id,
                            item.selectedSize,
                          )
                        }
                        aria-label={`Remove ${item.name} from cart`}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E3D8C5] text-[#8B5E52] transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 size={17} aria-hidden="true" />
                      </button>
                    </div>

                    <div
                      className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#66736E]"
                      style={{ fontFamily: "Poppins" }}
                    >
                      {item.selectedSize && (
                        <span>
                          Size:{" "}
                          <strong className="font-semibold text-[#0F4C3A]">
                            {item.selectedSize}
                          </strong>
                        </span>
                      )}

                      {item.fabric && (
                        <span>
                          Fabric:{" "}
                          <strong className="font-semibold text-[#0F4C3A]">
                            {item.fabric}
                          </strong>
                        </span>
                      )}
                    </div>

                    <div className="mt-auto flex flex-col gap-5 pt-6 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <div className="space-y-1">
  <p
    className="text-xs text-[#81908A]"
    style={{ fontFamily: "Poppins" }}
  >
    {item.pricingType === "WHOLESALE"
      ? "Wholesale Price"
      : "Retail Price"}
  </p>

  <p
    className="text-2xl font-semibold text-[#0F4C3A]"
    style={{
      fontFamily: "Cormorant Garamond",
    }}
  >
    ₹{price.toLocaleString("en-IN")}
  </p>

  {item.pricingType === "WHOLESALE" && (
    <span className="inline-flex rounded-full bg-[#0F4C3A] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
      Wholesale
    </span>
  )}
</div>
                      </div>

                      <div className="flex flex-wrap items-center gap-5">
                        <div className="inline-flex items-center rounded-full border border-[#D9C8A8] bg-[#F8F5F0] p-1">
                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(
                                item.id,
                                item.selectedSize,
                              )
                            }
                            aria-label={`Decrease quantity of ${item.name}`}
                            className="flex h-10 w-10 items-center justify-center rounded-full text-[#0F4C3A] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Minus
                              size={16}
                              aria-hidden="true"
                            />
                          </button>

                          <span
                            className="min-w-11 text-center text-sm font-semibold text-[#0F4C3A]"
                            style={{ fontFamily: "Poppins" }}
                          >
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              increaseQuantity(
                                item.id,
                                item.selectedSize,
                              )
                            }
                            disabled={
                              item.quantity >= item.stock
                            }
                            aria-label={`Increase quantity of ${item.name}`}
                            className="flex h-10 w-10 items-center justify-center rounded-full text-[#0F4C3A] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Plus
                              size={16}
                              aria-hidden="true"
                            />
                          </button>
                        </div>

                        <div className="min-w-28 text-right">
                          <p
                            className="text-xs text-[#81908A]"
                            style={{
                              fontFamily: "Poppins",
                            }}
                          >
                            Item total
                          </p>

                          <p
                            className="mt-1 text-2xl font-semibold text-[#0F4C3A]"
                            style={{
                              fontFamily:
                                "Cormorant Garamond",
                            }}
                          >
                            ₹
                            {itemTotal.toLocaleString(
                              "en-IN",
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <aside className="lg:sticky lg:top-28">
          <div className="overflow-hidden rounded-[30px] border border-[#E3D8C5] bg-white shadow-[0_20px_60px_rgba(15,76,58,0.08)]">
            <div className="bg-[#0F4C3A] p-7 text-white">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D8BC80]"
                style={{ fontFamily: "Poppins" }}
              >
                Your order
              </p>

              <h2
                className="mt-3 text-4xl"
                style={{ fontFamily: "Cormorant Garamond" }}
              >
                Order Summary
              </h2>
            </div>

            <div className="p-7">
              <div
                className="space-y-4 text-sm"
                style={{ fontFamily: "Poppins" }}
              >
                <div className="flex items-center justify-between gap-4 text-[#66736E]">
                  <span>Subtotal</span>

                  <span className="font-semibold text-[#0F4C3A]">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 text-[#66736E]">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>

                <div className="flex items-center justify-between gap-4 text-[#66736E]">
                  <span>Taxes</span>
                  <span>Included where applicable</span>
                </div>
              </div>

              <div className="my-6 border-t border-[#E8DCC5]" />

              <div className="flex items-end justify-between gap-4">
                <div>
                  <p
                    className="text-sm font-semibold text-[#0F4C3A]"
                    style={{ fontFamily: "Poppins" }}
                  >
                    Estimated total
                  </p>

                  <p
                    className="mt-1 text-xs text-[#81908A]"
                    style={{ fontFamily: "Poppins" }}
                  >
                    Excluding delivery charges
                  </p>
                </div>

                <p
                  className="text-4xl font-semibold text-[#0F4C3A]"
                  style={{
                    fontFamily: "Cormorant Garamond",
                  }}
                >
                  ₹{subtotal.toLocaleString("en-IN")}
                </p>
              </div>

              <Link
                to="/checkout"
                className="mt-7 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#0F4C3A] px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0A3D2F] hover:shadow-[0_14px_35px_rgba(15,76,58,0.22)]"
                style={{ fontFamily: "Poppins" }}
              >
                Proceed to Checkout
                <ArrowRight size={17} aria-hidden="true" />
              </Link>

              <p
                className="mt-4 text-center text-xs leading-5 text-[#82908A]"
                style={{ fontFamily: "Poppins" }}
              >
                Checkout functionality will be connected in
                the next phase.
              </p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default CartPage;