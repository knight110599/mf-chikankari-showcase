import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
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
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";

import ProductCard from "../components/product/ProductCard";
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

const careInstructions = [
  "Gentle hand wash separately in cold water.",
  "Use mild detergent and avoid bleach.",
  "Do not wring or scrub the embroidery.",
  "Dry in shade to preserve fabric and colour.",
  "Iron from the reverse side at low temperature.",
];

function ProductDetailsPage() {
  const { slug } = useParams<{ slug: string }>();

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ApiProduct[]>([]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      if (!slug) {
        setError("Product URL is invalid.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setProduct(null);
        setRelatedProducts([]);
        setSelectedImage(0);
        setSelectedSize("");
        setQuantity(1);
        setIsWishlisted(false);

        const [productResponse, productsResponse] = await Promise.all([
          getProductBySlug(slug),
          getProducts(),
        ]);

        if (!isMounted) return;

        const currentProduct = productResponse.data;

        setProduct(currentProduct);

        const related = productsResponse.data
          .filter(
            (item) =>
              item.id !== currentProduct.id &&
              item.category.id === currentProduct.category.id,
          )
          .slice(0, 3);

        setRelatedProducts(related);
      } catch (caughtError) {
        if (!isMounted) return;

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Product could not be loaded.",
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadProduct();

    return () => {
      isMounted = false;
    };
  }, [slug, reloadKey]);

  const productImages = useMemo(() => {
    if (!product) return [];

    const sortedImages = [...product.images].sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );

    return sortedImages.length > 0
      ? sortedImages
      : [
          {
            id: "placeholder",
            url: "/placeholder-product.jpg",
            altText: product.name,
            sortOrder: 0,
            isPrimary: true,
          },
        ];
  }, [product]);

  const productDetails = useMemo(() => {
    if (!product) return [];

    const details: string[] = [];

    if (product.fabric) {
      details.push(`Fabric: ${product.fabric}`);
    }

    if (product.sizes.length > 0) {
      details.push(`Available sizes: ${product.sizes.join(", ")}`);
    }

    details.push(`SKU: ${product.sku}`);

    if (product.minimumWholesaleQuantity) {
      details.push(
        `Minimum wholesale order: ${product.minimumWholesaleQuantity} pieces`,
      );
    }

    details.push("Authentic Lucknowi Chikankari craftsmanship");
    details.push("Every product is quality checked before dispatch");

    return details;
  }, [product]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F5F0]">
        <section className="mx-auto max-w-[1500px] px-5 py-12 sm:px-8 lg:px-12 lg:py-20">
          <div className="mb-8 h-4 w-72 animate-pulse rounded-full bg-[#E7DFD2]" />

          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <div className="aspect-[4/5] animate-pulse rounded-[34px] bg-[#E9E3D9]" />

              <div className="mt-4 grid grid-cols-3 gap-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square animate-pulse rounded-[20px] bg-[#E9E3D9]"
                  />
                ))}
              </div>
            </div>

            <div className="py-3">
              <div className="h-4 w-32 animate-pulse rounded-full bg-[#E7DFD2]" />

              <div className="mt-6 h-16 w-4/5 animate-pulse rounded-2xl bg-[#E7DFD2]" />

              <div className="mt-5 h-4 w-52 animate-pulse rounded-full bg-[#E7DFD2]" />

              <div className="mt-8 space-y-3">
                <div className="h-4 w-full animate-pulse rounded-full bg-[#E7DFD2]" />
                <div className="h-4 w-full animate-pulse rounded-full bg-[#E7DFD2]" />
                <div className="h-4 w-3/4 animate-pulse rounded-full bg-[#E7DFD2]" />
              </div>

              <div className="mt-8 h-10 w-44 animate-pulse rounded-full bg-[#E7DFD2]" />

              <div className="mt-8 h-72 animate-pulse rounded-[28px] bg-white" />
            </div>
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
          className="mx-auto w-full max-w-3xl px-5 py-20 text-center sm:px-8"
        >
          <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full border border-[#E8DCC5] bg-white text-[#0F4C3A] shadow-sm">
            <PackageCheck size={30} aria-hidden="true" />
          </div>

          <p
            className="mt-7 text-xs font-semibold uppercase tracking-[0.3em] text-[#A47E3B]"
            style={{ fontFamily: "Poppins" }}
          >
            Product unavailable
          </p>

          <h1
            className="mt-4 text-5xl leading-tight text-[#0F4C3A] sm:text-6xl"
            style={{ fontFamily: "Cormorant Garamond" }}
          >
            We couldn&apos;t find this piece
          </h1>

          <p
            className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#68756F] sm:text-base"
            style={{ fontFamily: "Poppins" }}
          >
            {error ??
              "The product may have been removed or is currently unavailable."}
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setReloadKey((current) => current + 1)}
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-[#0F4C3A] px-7 text-sm font-semibold text-[#0F4C3A] transition hover:bg-[#0F4C3A] hover:text-white"
              style={{ fontFamily: "Poppins" }}
            >
              <RefreshCcw size={17} aria-hidden="true" />
              Try Again
            </button>

            <Link
              to="/products"
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#0F4C3A] px-7 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0A3D2F] hover:shadow-lg"
              style={{ fontFamily: "Poppins" }}
            >
              <ArrowLeft size={17} aria-hidden="true" />
              Browse Products
            </Link>
          </div>
        </motion.section>
      </main>
    );
  }

  const currentImage = productImages[selectedImage] ?? productImages[0];
  const productImageCount = productImages.length;
  const productStock = product.stock;

  const price = Number(product.price);
  const wholesalePrice = product.wholesalePrice
    ? Number(product.wholesalePrice)
    : null;

  const whatsappMessage = encodeURIComponent(
    `Hello MF Chikankari, I am interested in ${product.name}. Size: ${
      selectedSize || "Not selected"
    }, Quantity: ${quantity}. Please share availability and pricing.`,
  );

  function handlePreviousImage() {
    if (productImageCount <= 1) return;

    setSelectedImage((current) =>
      current === 0 ? productImageCount - 1 : current - 1,
    );
  }

  function handleNextImage() {
    if (productImageCount <= 1) return;

    setSelectedImage((current) =>
      current === productImageCount - 1 ? 0 : current + 1,
    );
  }

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function increaseQuantity() {
    setQuantity((current) => Math.min(productStock, current + 1));
  }

  return (
    <main className="min-h-screen bg-[#F8F5F0]">
      <section className="border-b border-[#E8DCC5] bg-white/40">
        <div className="mx-auto max-w-[1500px] px-5 py-4 sm:px-8 lg:px-12">
          <div
            className="flex flex-wrap items-center gap-2 text-xs text-[#77827E]"
            style={{ fontFamily: "Poppins" }}
          >
            <Link to="/" className="transition hover:text-[#0F4C3A]">
              Home
            </Link>

            <span>/</span>

            <Link
              to="/products"
              className="transition hover:text-[#0F4C3A]"
            >
              Products
            </Link>

            <span>/</span>

            <Link
              to={`/categories/${product.category.slug}`}
              className="transition hover:text-[#0F4C3A]"
            >
              {product.category.name}
            </Link>

            <span>/</span>

            <span className="max-w-[220px] truncate font-medium text-[#0F4C3A] sm:max-w-none">
              {product.name}
            </span>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-40 top-32 h-96 w-96 rounded-full bg-[#C9A86A]/10 blur-3xl" />

        <div className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-[#0F4C3A]/5 blur-3xl" />

        <div className="relative mx-auto grid max-w-[1500px] gap-12 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:px-12 lg:py-20">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="lg:sticky lg:top-28"
          >
            <div className="relative overflow-hidden rounded-[34px] border border-[#E3D8C5] bg-[#EFE8DB] shadow-[0_25px_80px_rgba(15,76,58,0.08)]">
              <motion.img
                key={currentImage.id}
                initial={{ opacity: 0.45, scale: 1.015 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                src={currentImage.url}
                alt={
                  currentImage.altText ??
                  `${product.name} view ${selectedImage + 1}`
                }
                className="aspect-[4/5] h-full w-full object-cover"
              />

              <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/50 bg-white/85 px-4 py-2 shadow-sm backdrop-blur-md">
                <Sparkles
                  size={14}
                  className="text-[#A47E3B]"
                  aria-hidden="true"
                />

                <span
                  className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0F4C3A]"
                  style={{ fontFamily: "Poppins" }}
                >
                  Handcrafted
                </span>
              </div>

              {productImageCount > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePreviousImage}
                    aria-label="Previous product image"
                    className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/85 text-[#0F4C3A] shadow-md backdrop-blur-md transition hover:scale-105 hover:bg-white"
                  >
                    <ChevronLeft size={21} aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextImage}
                    aria-label="Next product image"
                    className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/85 text-[#0F4C3A] shadow-md backdrop-blur-md transition hover:scale-105 hover:bg-white"
                  >
                    <ChevronRight size={21} aria-hidden="true" />
                  </button>

                  <div
                    className="absolute bottom-5 right-5 rounded-full bg-[#0F4C3A]/90 px-4 py-2 text-xs text-white backdrop-blur"
                    style={{ fontFamily: "Poppins" }}
                  >
                    {selectedImage + 1} / {productImageCount}
                  </div>
                </>
              )}
            </div>

            {productImageCount > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
                {productImages.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    aria-label={`View product image ${index + 1}`}
                    className={`overflow-hidden rounded-[18px] border-2 bg-white p-1 transition ${
                      selectedImage === index
                        ? "border-[#0F4C3A] shadow-md"
                        : "border-transparent hover:border-[#D9C8A8]"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={
                        image.altText ??
                        `${product.name} thumbnail ${index + 1}`
                      }
                      className="aspect-square h-full w-full rounded-[13px] object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.65, delay: 0.1 }}
          >
            <div className="flex items-start justify-between gap-5">
              <div>
                <Link
                  to={`/categories/${product.category.slug}`}
                  className="inline-flex items-center rounded-full border border-[#D9C8A8] bg-white/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A47E3B] transition hover:border-[#0F4C3A] hover:text-[#0F4C3A]"
                  style={{ fontFamily: "Poppins" }}
                >
                  {product.category.name}
                </Link>
              </div>

              <button
                type="button"
                onClick={() => setIsWishlisted((current) => !current)}
                aria-label={
                  isWishlisted
                    ? "Remove product from wishlist"
                    : "Add product to wishlist"
                }
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition ${
                  isWishlisted
                    ? "border-[#0F4C3A] bg-[#0F4C3A] text-white"
                    : "border-[#D9C8A8] bg-white/70 text-[#0F4C3A] hover:border-[#0F4C3A]"
                }`}
              >
                <Heart
                  size={19}
                  fill={isWishlisted ? "currentColor" : "none"}
                  aria-hidden="true"
                />
              </button>
            </div>

            <h1
              className="mt-6 text-5xl leading-[0.98] text-[#0F4C3A] sm:text-6xl xl:text-7xl"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              {product.name}
            </h1>

            <div
              className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs"
              style={{ fontFamily: "Poppins" }}
            >
              <span className="text-[#74807B]">SKU: {product.sku}</span>

              <span className="h-1 w-1 rounded-full bg-[#C9A86A]" />

              <span
                className={`inline-flex items-center gap-2 font-semibold ${
                  productStock > 0 ? "text-emerald-700" : "text-red-600"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    productStock > 0 ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />

                {productStock > 0
                  ? `${productStock} available`
                  : "Out of stock"}
              </span>
            </div>

            <p
              className="mt-7 text-sm leading-8 text-[#64716C] sm:text-base"
              style={{ fontFamily: "Poppins" }}
            >
              {product.description ??
                product.shortDescription ??
                "An authentic handcrafted Lucknowi Chikankari piece, carefully finished for timeless elegance and everyday comfort."}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4 border-y border-[#DED4C3] py-6">
              <span
                className="text-4xl font-semibold text-[#0F4C3A]"
                style={{ fontFamily: "Cormorant Garamond" }}
              >
                ₹{price.toLocaleString("en-IN")}
              </span>

              {wholesalePrice !== null && (
                <div
                  className="rounded-full border border-[#D9C8A8] bg-white px-4 py-2 text-xs text-[#596862]"
                  style={{ fontFamily: "Poppins" }}
                >
                  Wholesale from{" "}
                  <span className="font-semibold text-[#0F4C3A]">
                    ₹{wholesalePrice.toLocaleString("en-IN")}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-8 overflow-hidden rounded-[28px] border border-[#E3D8C5] bg-white shadow-[0_18px_60px_rgba(15,76,58,0.05)]">
              <div className="grid gap-5 p-6 sm:grid-cols-2 sm:p-7">
                <div>
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A47E3B]"
                    style={{ fontFamily: "Poppins" }}
                  >
                    Fabric
                  </p>

                  <p
                    className="mt-2 text-sm font-medium text-[#0F4C3A]"
                    style={{ fontFamily: "Poppins" }}
                  >
                    {product.fabric ?? "Details unavailable"}
                  </p>
                </div>

                <div>
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A47E3B]"
                    style={{ fontFamily: "Poppins" }}
                  >
                    Craft
                  </p>

                  <p
                    className="mt-2 text-sm font-medium text-[#0F4C3A]"
                    style={{ fontFamily: "Poppins" }}
                  >
                    Lucknowi Chikankari
                  </p>
                </div>
              </div>

              <div className="border-t border-[#E8DCC5] p-6 sm:p-7">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2
                      className="text-lg font-semibold text-[#0F4C3A]"
                      style={{ fontFamily: "Poppins" }}
                    >
                      Select Size
                    </h2>

                    <p
                      className="mt-1 text-xs text-[#84908B]"
                      style={{ fontFamily: "Poppins" }}
                    >
                      Choose your preferred size.
                    </p>
                  </div>

                  {selectedSize && (
                    <span
                      className="rounded-full bg-[#EEF3F0] px-3 py-1.5 text-xs font-medium text-[#0F4C3A]"
                      style={{ fontFamily: "Poppins" }}
                    >
                      Selected: {selectedSize}
                    </span>
                  )}
                </div>

                {product.sizes.length > 0 ? (
                  <div className="mt-5 flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`relative min-w-13 rounded-full border px-5 py-2.5 text-sm font-medium transition ${
                          selectedSize === size
                            ? "border-[#0F4C3A] bg-[#0F4C3A] text-white shadow-md"
                            : "border-[#D9C8A8] bg-[#FBF9F5] text-[#0F4C3A] hover:border-[#0F4C3A]"
                        }`}
                        style={{ fontFamily: "Poppins" }}
                      >
                        {size}

                        {selectedSize === size && (
                          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#C9A86A] text-white">
                            <Check size={11} aria-hidden="true" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p
                    className="mt-4 text-sm text-[#74807B]"
                    style={{ fontFamily: "Poppins" }}
                  >
                    Size information is currently unavailable.
                  </p>
                )}
              </div>

              <div className="border-t border-[#E8DCC5] p-6 sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-5">
                  <div>
                    <h2
                      className="text-lg font-semibold text-[#0F4C3A]"
                      style={{ fontFamily: "Poppins" }}
                    >
                      Quantity
                    </h2>

                    <p
                      className="mt-1 text-xs text-[#84908B]"
                      style={{ fontFamily: "Poppins" }}
                    >
                      Maximum available: {productStock}
                    </p>
                  </div>

                  <div className="inline-flex items-center rounded-full border border-[#D9C8A8] bg-[#F8F5F0] p-1">
                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      disabled={quantity === 1 || productStock === 0}
                      aria-label="Decrease quantity"
                      className="flex h-10 w-10 items-center justify-center rounded-full text-[#0F4C3A] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <Minus size={16} aria-hidden="true" />
                    </button>

                    <span
                      className="min-w-12 text-center text-sm font-semibold text-[#0F4C3A]"
                      style={{ fontFamily: "Poppins" }}
                    >
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={
                        productStock === 0 || quantity >= productStock
                      }
                      aria-label="Increase quantity"
                      className="flex h-10 w-10 items-center justify-center rounded-full text-[#0F4C3A] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <Plus size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={productStock === 0}
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#0F4C3A] px-7 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#0A3D2F] hover:shadow-[0_14px_35px_rgba(15,76,58,0.22)] disabled:cursor-not-allowed disabled:opacity-50"
                style={{ fontFamily: "Poppins" }}
              >
                <ShoppingBag
                  size={18}
                  className="transition-transform group-hover:scale-110"
                  aria-hidden="true"
                />

                {productStock > 0 ? "Add to Cart" : "Out of Stock"}
              </button>

              <a
                href={`https://wa.me/916386826199?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 items-center justify-center rounded-full border border-[#0F4C3A] bg-white/60 px-7 text-sm font-semibold text-[#0F4C3A] transition hover:bg-[#0F4C3A] hover:text-white"
                style={{ fontFamily: "Poppins" }}
              >
                Enquire on WhatsApp
              </a>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                {
                  icon: Truck,
                  title: "Pan India Delivery",
                  text: "Secure nationwide shipping.",
                },
                {
                  icon: RotateCcw,
                  title: "Customer Support",
                  text: "Help throughout your order.",
                },
                {
                  icon: ShieldCheck,
                  title: "Quality Checked",
                  text: "Inspected before dispatch.",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-[22px] border border-[#E3D8C5] bg-white/75 p-5"
                  >
                    <Icon
                      size={21}
                      className="text-[#A47E3B]"
                      aria-hidden="true"
                    />

                    <h3
                      className="mt-3 text-sm font-semibold text-[#0F4C3A]"
                      style={{ fontFamily: "Poppins" }}
                    >
                      {item.title}
                    </h3>

                    <p
                      className="mt-1 text-xs leading-5 text-[#7D8984]"
                      style={{ fontFamily: "Poppins" }}
                    >
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-[#E8DCC5] bg-white/35">
        <div className="mx-auto grid max-w-[1500px] gap-7 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:px-12 lg:py-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="rounded-[30px] border border-[#E3D8C5] bg-white p-7 shadow-[0_18px_60px_rgba(15,76,58,0.04)] sm:p-9"
          >
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#A47E3B]"
              style={{ fontFamily: "Poppins" }}
            >
              At a glance
            </p>

            <h2
              className="mt-3 text-4xl text-[#0F4C3A]"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              Product Details
            </h2>

            <ul className="mt-7 space-y-4">
              {productDetails.map((detail) => (
                <li
                  key={detail}
                  className="flex gap-3 text-sm leading-7 text-[#65726D]"
                  style={{ fontFamily: "Poppins" }}
                >
                  <span className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EFF3F0] text-[#0F4C3A]">
                    <Check size={12} aria-hidden="true" />
                  </span>

                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            transition={{ delay: 0.1 }}
            className="rounded-[30px] border border-[#E3D8C5] bg-[#0F4C3A] p-7 text-white shadow-[0_18px_60px_rgba(15,76,58,0.12)] sm:p-9"
          >
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D8BC80]"
              style={{ fontFamily: "Poppins" }}
            >
              Preserve the craft
            </p>

            <h2
              className="mt-3 text-4xl"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              Care Instructions
            </h2>

            <ul className="mt-7 space-y-4">
              {careInstructions.map((instruction) => (
                <li
                  key={instruction}
                  className="flex gap-3 text-sm leading-7 text-white/75"
                  style={{ fontFamily: "Poppins" }}
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D8BC80]" />

                  <span>{instruction}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="border-t border-[#E8DCC5] bg-[#F8F5F0]">
          <div className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#A47E3B]"
                  style={{ fontFamily: "Poppins" }}
                >
                  Complete your collection
                </p>

                <h2
                  className="mt-3 text-5xl text-[#0F4C3A] sm:text-6xl"
                  style={{ fontFamily: "Cormorant Garamond" }}
                >
                  You may also like
                </h2>
              </div>

              <Link
                to={`/categories/${product.category.slug}`}
                className="inline-flex w-fit items-center gap-2 border-b border-[#0F4C3A] pb-1 text-sm font-semibold text-[#0F4C3A] transition hover:border-[#A47E3B] hover:text-[#A47E3B]"
                style={{ fontFamily: "Poppins" }}
              >
                View full collection
                <ChevronRight size={16} aria-hidden="true" />
              </Link>
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.08,
                  },
                },
              }}
              className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3"
            >
              {relatedProducts.map((relatedProduct) => (
                <motion.div
                  key={relatedProduct.id}
                  variants={fadeUp}
                  transition={{ duration: 0.45 }}
                >
                  <ProductCard product={relatedProduct} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}
    </main>
  );
}

export default ProductDetailsPage;