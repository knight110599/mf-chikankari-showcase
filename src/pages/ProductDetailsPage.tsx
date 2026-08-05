import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import {
  Link,
  useParams,
} from "react-router-dom";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  PackageCheck,
  Plus,
  RefreshCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";

import ProductCard from "../components/product/ProductCard";
import { useAuth } from "../context/useAuth";
import { useCart } from "../context/useCart";
import {
  getProductBySlug,
  getProducts,
  type ApiProduct,
} from "../services/product.service";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const infoCards = [
  {
    icon: Truck,
    title: "Pan India Delivery",
    text: "Secure nationwide shipping.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Checked",
    text: "Inspected before dispatch.",
  },
];

function getWholesaleMinimumQuantity(
  product: ApiProduct,
  isWholesaleUser: boolean,
) {
  const wholesalePrice =
    product.wholesalePrice !== null
      ? Number(product.wholesalePrice)
      : null;

  const canUseWholesalePrice =
    isWholesaleUser &&
    wholesalePrice !== null &&
    Number.isFinite(wholesalePrice);

  if (!canUseWholesalePrice) {
    return 1;
  }

  return Math.max(
    product.minimumWholesaleQuantity ?? 1,
    1,
  );
}

function ProductDetailsPage() {
  const { slug } = useParams<{
    slug: string;
  }>();

  const { addToCart } = useCart();
  const { user } = useAuth();

  const isWholesaleUser =
    user?.role === "wholesale";

  const [product, setProduct] =
    useState<ApiProduct | null>(null);

  const [
    relatedProducts,
    setRelatedProducts,
  ] = useState<ApiProduct[]>([]);

  const [selectedImage, setSelectedImage] =
    useState(0);

  const [selectedSize, setSelectedSize] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  const [isWishlisted, setIsWishlisted] =
    useState(false);

  const [addedToCart, setAddedToCart] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [reloadKey, setReloadKey] =
    useState(0);

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      if (!slug) {
        setError("Product URL is invalid.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setSelectedImage(0);
        setSelectedSize("");
        setIsWishlisted(false);
        setAddedToCart(false);

        const [
          productResponse,
          productsResponse,
        ] = await Promise.all([
          getProductBySlug(slug),
          getProducts(),
        ]);

        if (!active) {
          return;
        }

        const currentProduct =
          productResponse.data;

        const minimumQuantity =
          getWholesaleMinimumQuantity(
            currentProduct,
            isWholesaleUser,
          );

        const initialQuantity =
          currentProduct.stock > 0
            ? Math.min(
                minimumQuantity,
                currentProduct.stock,
              )
            : 1;

        setProduct(currentProduct);
        setQuantity(initialQuantity);

        setRelatedProducts(
          productsResponse.data
            .filter(
              (item) =>
                item.id !== currentProduct.id &&
                item.category.id ===
                  currentProduct.category.id,
            )
            .slice(0, 3),
        );
      } catch (caughtError) {
        if (!active) {
          return;
        }

        setProduct(null);
        setRelatedProducts([]);

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Product could not be loaded.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadProduct();

    return () => {
      active = false;
    };
  }, [
    slug,
    reloadKey,
    isWholesaleUser,
  ]);

  const productImages = useMemo(() => {
    if (!product) {
      return [];
    }

    const images = [...product.images].sort(
      (first, second) =>
        first.sortOrder - second.sortOrder,
    );

    if (images.length > 0) {
      return images;
    }

    return [
      {
        id: "placeholder",
        url: "/placeholder-product.jpg",
        altText: product.name,
        sortOrder: 0,
        isPrimary: true,
      },
    ];
  }, [product]);

  
  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F5F0]">
        <section className="mx-auto grid max-w-[1500px] gap-12 px-5 py-12 sm:px-8 lg:grid-cols-2 lg:px-12 lg:py-20">
          <div className="aspect-[4/5] animate-pulse rounded-[34px] bg-[#E9E3D9]" />

          <div className="space-y-6 py-4">
            <div className="h-5 w-32 animate-pulse rounded bg-[#E7DFD2]" />
            <div className="h-20 w-4/5 animate-pulse rounded bg-[#E7DFD2]" />
            <div className="h-5 w-52 animate-pulse rounded bg-[#E7DFD2]" />
            <div className="h-40 animate-pulse rounded-[28px] bg-white" />
            <div className="h-56 animate-pulse rounded-[28px] bg-white" />
          </div>
        </section>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-[75vh] items-center bg-[#F8F5F0]">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mx-auto w-full max-w-3xl px-5 py-20 text-center"
        >
          <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full border border-[#E8DCC5] bg-white text-[#0F4C3A]">
            <PackageCheck size={30} />
          </div>

          <h1
            className="mt-7 text-5xl text-[#0F4C3A] sm:text-6xl"
            style={{
              fontFamily:
                "Cormorant Garamond",
            }}
          >
            Product unavailable
          </h1>

          <p
            className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#68756F]"
            style={{
              fontFamily: "Poppins",
            }}
          >
            {error ??
              "This product is currently unavailable."}
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() =>
                setReloadKey(
                  (value) => value + 1,
                )
              }
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-[#0F4C3A] px-7 text-sm font-semibold text-[#0F4C3A] transition hover:bg-[#0F4C3A] hover:text-white"
            >
              <RefreshCcw size={17} />
              Try Again
            </button>

            <Link
              to="/products"
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#0F4C3A] px-7 text-sm font-semibold text-white transition hover:bg-[#0A3D2F]"
            >
              <ArrowLeft size={17} />
              Browse Products
            </Link>
          </div>
        </motion.section>
      </main>
    );
  }

  const productStock = product.stock;

  const imageCount =
    productImages.length;

  const currentImage =
    productImages[selectedImage] ??
    productImages[0];

  const retailPrice =
    Number(product.price);

  const wholesalePrice =
    product.wholesalePrice !== null
      ? Number(product.wholesalePrice)
      : null;

  const canUseWholesalePrice =
    isWholesaleUser &&
    wholesalePrice !== null &&
    Number.isFinite(wholesalePrice);

  const displayPrice =
    canUseWholesalePrice &&
    wholesalePrice !== null
      ? wholesalePrice
      : retailPrice;

  const minimumOrderQuantity =
    canUseWholesalePrice
      ? Math.max(
          product.minimumWholesaleQuantity ??
            1,
          1,
        )
      : 1;

  const hasEnoughWholesaleStock =
    !canUseWholesalePrice ||
    productStock >= minimumOrderQuantity;

  const whatsappMessage =
    encodeURIComponent(
      `Hello MF Chikankari, I am interested in ${
        product.name
      }. Size: ${
        selectedSize || "Not selected"
      }, Quantity: ${quantity}. Please share availability and pricing.`,
    );

  function changeImage(
    direction: "previous" | "next",
  ) {
    if (imageCount <= 1) {
      return;
    }

    setSelectedImage((current) => {
      if (direction === "previous") {
        return current === 0
          ? imageCount - 1
          : current - 1;
      }

      return current === imageCount - 1
        ? 0
        : current + 1;
    });
  }

  function handleAddToCart() {
  if (!product) {
    return;
  }

  if (
    product.stock < 1 ||
    !hasEnoughWholesaleStock
  ) {
    return;
  }

  if (
    product.sizes.length > 0 &&
    !selectedSize
  ) {
    window.alert(
      "Please select a size before adding this product to cart.",
    );
    return;
  }

  addToCart(
    product,
    quantity,
    selectedSize,
  );

  setAddedToCart(true);

  window.setTimeout(() => {
    setAddedToCart(false);
  }, 1800);
}

  return (
    <main className="min-h-screen bg-[#F8F5F0]">
      <section className="border-b border-[#E8DCC5] bg-white/40">
        <div
          className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-2 px-5 py-4 text-xs text-[#77827E] sm:px-8 lg:px-12"
          style={{
            fontFamily: "Poppins",
          }}
        >
          <Link
            to="/"
            className="hover:text-[#0F4C3A]"
          >
            Home
          </Link>

          <span>/</span>

          <Link
            to="/products"
            className="hover:text-[#0F4C3A]"
          >
            Products
          </Link>

          <span>/</span>

          <span className="font-medium text-[#0F4C3A]">
            {product.name}
          </span>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-40 top-32 h-96 w-96 rounded-full bg-[#C9A86A]/10 blur-3xl" />

        <div className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-[#0F4C3A]/5 blur-3xl" />

        <div className="relative mx-auto grid max-w-[1500px] gap-12 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:py-20">
          <motion.div
            initial={{
              opacity: 0,
              x: -24,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="lg:sticky lg:top-28"
          >
            <div className="relative overflow-hidden rounded-[34px] border border-[#E3D8C5] bg-[#EFE8DB] shadow-[0_25px_80px_rgba(15,76,58,0.08)]">
              <motion.img
                key={currentImage.id}
                initial={{
                  opacity: 0.5,
                  scale: 1.01,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                src={currentImage.url}
                alt={
                  currentImage.altText ??
                  product.name
                }
                className="aspect-[4/5] h-full w-full object-cover"
              />

              <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 shadow-sm backdrop-blur">
                <Sparkles
                  size={14}
                  className="text-[#A47E3B]"
                />

                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0F4C3A]">
                  Handcrafted
                </span>
              </div>

              {imageCount > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      changeImage(
                        "previous",
                      )
                    }
                    aria-label="Previous product image"
                    className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-[#0F4C3A] shadow-md"
                  >
                    <ChevronLeft
                      size={21}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      changeImage("next")
                    }
                    aria-label="Next product image"
                    className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-[#0F4C3A] shadow-md"
                  >
                    <ChevronRight
                      size={21}
                    />
                  </button>
                </>
              )}
            </div>

            {imageCount > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
                {productImages.map(
                  (image, index) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() =>
                        setSelectedImage(
                          index,
                        )
                      }
                      className={`overflow-hidden rounded-[18px] border-2 bg-white p-1 transition ${
                        selectedImage ===
                        index
                          ? "border-[#0F4C3A] shadow-md"
                          : "border-transparent hover:border-[#D9C8A8]"
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={
                          image.altText ??
                          `${product.name} thumbnail`
                        }
                        className="aspect-square w-full rounded-[13px] object-cover"
                      />
                    </button>
                  ),
                )}
              </div>
            )}
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
          >
            <div className="flex items-start justify-between gap-5">
              <Link
                to={`/categories/${product.category.slug}`}
                className="rounded-full border border-[#D9C8A8] bg-white/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A47E3B]"
              >
                {product.category.name}
              </Link>

              <button
                type="button"
                onClick={() =>
                  setIsWishlisted(
                    (value) => !value,
                  )
                }
                aria-label="Toggle wishlist"
                className={`flex h-12 w-12 items-center justify-center rounded-full border transition ${
                  isWishlisted
                    ? "border-[#0F4C3A] bg-[#0F4C3A] text-white"
                    : "border-[#D9C8A8] bg-white/70 text-[#0F4C3A]"
                }`}
              >
                <Heart
                  size={19}
                  fill={
                    isWishlisted
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>
            </div>

            <h1
              className="mt-6 text-5xl leading-none text-[#0F4C3A] sm:text-6xl xl:text-7xl"
              style={{
                fontFamily:
                  "Cormorant Garamond",
              }}
            >
              {product.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-[#74807B]">
              <span>
                SKU: {product.sku}
              </span>

              <span
                className={
  productStock > 0
    ? "font-semibold text-emerald-700"
    : "font-semibold text-red-600"
}
>
  {productStock <= 0
    ? "Out of stock"
    : productStock <= 5
      ? "Only a few left"
      : "In stock"}
</span>
            </div>

            <p
              className="mt-7 text-sm leading-8 text-[#64716C] sm:text-base"
              style={{
                fontFamily: "Poppins",
              }}
            >
              {product.description ??
                product.shortDescription ??
                "An authentic handcrafted Lucknowi Chikankari piece, carefully finished for timeless elegance and everyday comfort."}
            </p>

            <div className="mt-8 border-y border-[#DED4C3] py-6">
              <div className="flex flex-wrap items-center gap-4">
                <span
                  className="text-4xl font-semibold text-[#0F4C3A]"
                  style={{
                    fontFamily:
                      "Cormorant Garamond",
                  }}
                >
                  ₹
                  {displayPrice.toLocaleString(
                    "en-IN",
                  )}
                </span>

                {canUseWholesalePrice && (
                  <>
                    <span className="text-lg text-[#8A918D] line-through">
                      ₹
                      {retailPrice.toLocaleString(
                        "en-IN",
                      )}
                    </span>

                    <span className="rounded-full bg-[#0F4C3A] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                      Wholesale Price
                    </span>
                  </>
                )}
              </div>

              {canUseWholesalePrice && (
                <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <p className="text-sm font-semibold text-emerald-800">
                    You are viewing
                    approved wholesale
                    pricing.
                  </p>

                  {minimumOrderQuantity >
                    1 && (
                    <p className="mt-1 text-xs text-emerald-700">
                      Minimum wholesale
                      order:{" "}
                      {
                        minimumOrderQuantity
                      }{" "}
                      pieces
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-8 overflow-hidden rounded-[28px] border border-[#E3D8C5] bg-white shadow-[0_18px_60px_rgba(15,76,58,0.05)]">
              <div className="grid gap-5 p-6 sm:grid-cols-2 sm:p-7">
                <Detail
                  label="Fabric"
                  value={
                    product.fabric ??
                    "Details unavailable"
                  }
                />

                <Detail
                  label="Craft"
                  value="Lucknowi Chikankari"
                />
              </div>

              {product.sizes.length >
                0 && (
                <div className="border-t border-[#E8DCC5] p-6 sm:p-7">
                  <h2 className="text-lg font-semibold text-[#0F4C3A]">
                    Select Size
                  </h2>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {product.sizes.map(
                      (size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() =>
                            setSelectedSize(
                              size,
                            )
                          }
                          className={`relative min-w-13 rounded-full border px-5 py-2.5 text-sm font-medium transition ${
                            selectedSize ===
                            size
                              ? "border-[#0F4C3A] bg-[#0F4C3A] text-white"
                              : "border-[#D9C8A8] bg-[#FBF9F5] text-[#0F4C3A]"
                          }`}
                        >
                          {size}

                          {selectedSize ===
                            size && (
                            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#C9A86A] text-white">
                              <Check
                                size={11}
                              />
                            </span>
                          )}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-5 border-t border-[#E8DCC5] p-6 sm:p-7">
                <div>
                  <h2 className="text-lg font-semibold text-[#0F4C3A]">
                    Quantity
                  </h2>

                  <div className="mt-1 space-y-1 text-xs text-[#84908B]">
  <p
    className={
      productStock > 0
        ? "font-medium text-emerald-700"
        : "font-medium text-red-600"
    }
  >
    {productStock <= 0
      ? "Out of stock"
      : productStock <= 5
        ? "Only a few left"
        : "In stock"}
  </p>

  {canUseWholesalePrice &&
    minimumOrderQuantity > 1 && (
      <p className="font-medium text-[#9B7B3D]">
        Wholesale minimum:{" "}
        {minimumOrderQuantity} pieces
      </p>
    )}
</div>
                </div>

                <div className="inline-flex items-center rounded-full border border-[#D9C8A8] bg-[#F8F5F0] p-1">
                  <QuantityButton
                    label="Decrease quantity"
                    disabled={
                      quantity <=
                        minimumOrderQuantity ||
                      productStock === 0
                    }
                    onClick={() =>
                      setQuantity(
                        (value) =>
                          Math.max(
                            minimumOrderQuantity,
                            value - 1,
                          ),
                      )
                    }
                  >
                    <Minus size={16} />
                  </QuantityButton>

                  <span className="min-w-12 text-center text-sm font-semibold text-[#0F4C3A]">
                    {quantity}
                  </span>

                  <QuantityButton
                    label="Increase quantity"
                    disabled={
                      productStock === 0 ||
                      quantity >=
                        productStock
                    }
                    onClick={() =>
                      setQuantity(
                        (value) =>
                          Math.min(
                            productStock,
                            value + 1,
                          ),
                      )
                    }
                  >
                    <Plus size={16} />
                  </QuantityButton>
                </div>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={
                  productStock === 0 ||
                  !hasEnoughWholesaleStock
                }
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#0F4C3A] px-7 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0A3D2F] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingBag size={18} />

                {addedToCart
                  ? "Added to Cart"
                  : productStock === 0
                    ? "Out of Stock"
                    : !hasEnoughWholesaleStock
                      ? `Minimum ${minimumOrderQuantity} Required`
                      : "Add to Cart"}
              </button>

              <a
                href={`https://wa.me/916386826199?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 items-center justify-center rounded-full border border-[#0F4C3A] bg-white/60 px-7 text-sm font-semibold text-[#0F4C3A] transition hover:bg-[#0F4C3A] hover:text-white"
              >
                Enquire on WhatsApp
              </a>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {infoCards.map(
                ({
                  icon: Icon,
                  title,
                  text,
                }) => (
                  <div
                    key={title}
                    className="rounded-[22px] border border-[#E3D8C5] bg-white/75 p-5"
                  >
                    <Icon
                      size={21}
                      className="text-[#A47E3B]"
                    />

                    <h3 className="mt-3 text-sm font-semibold text-[#0F4C3A]">
                      {title}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-[#7D8984]">
                      {text}
                    </p>
                  </div>
                ),
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="border-t border-[#E8DCC5]">
          <div className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
            <div className="flex items-end justify-between gap-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#A47E3B]">
                  Complete your collection
                </p>

                <h2
                  className="mt-3 text-5xl text-[#0F4C3A] sm:text-6xl"
                  style={{
                    fontFamily:
                      "Cormorant Garamond",
                  }}
                >
                  You may also like
                </h2>
              </div>

              <Link
                to={`/categories/${product.category.slug}`}
                className="hidden items-center gap-2 border-b border-[#0F4C3A] pb-1 text-sm font-semibold text-[#0F4C3A] sm:inline-flex"
              >
                View collection
                <ChevronRight size={16} />
              </Link>
            </div>

            <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map(
                (relatedProduct) => (
                  <ProductCard
                    key={
                      relatedProduct.id
                    }
                    product={
                      relatedProduct
                    }
                  />
                ),
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

type DetailProps = {
  label: string;
  value: string;
};

function Detail({
  label,
  value,
}: DetailProps) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A47E3B]">
        {label}
      </p>

      <p className="mt-2 text-sm font-medium text-[#0F4C3A]">
        {value}
      </p>
    </div>
  );
}

type QuantityButtonProps = {
  children: ReactNode;
  label: string;
  disabled: boolean;
  onClick: () => void;
};

function QuantityButton({
  children,
  label,
  disabled,
  onClick,
}: QuantityButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full text-[#0F4C3A] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-35"
    >
      {children}
    </button>
  );
}

export default ProductDetailsPage;