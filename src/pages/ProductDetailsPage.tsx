import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import ProductCard from "../components/product/ProductCard";
import { products } from "../data/products";

function ProductDetailsPage() {
  const { slug } = useParams();

  const product = products.find((item) => item.slug === slug);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const relatedProducts = useMemo(() => {
    if (!product) return [];

    return products
      .filter(
        (item) =>
          item.id !== product.id && item.category === product.category,
      )
      .slice(0, 3);
  }, [product]);

  if (!product) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12">
        <p className="text-sm uppercase tracking-[0.3em] text-[#C9A86A]">
          Product Not Found
        </p>

        <h1
          className="mt-3 text-5xl text-[#0F4C3A]"
          style={{ fontFamily: "Cormorant Garamond" }}
        >
          This product is unavailable
        </h1>

        <Link
          to="/products"
          className="mt-8 inline-flex rounded-full bg-[#0F4C3A] px-6 py-3 text-white"
        >
          Back to Products
        </Link>
      </section>
    );
  }

  const currentImage = product.images[selectedImage] ?? product.image;
  const productImageCount = product.images.length;
  const productStock = product.stock;

  function handlePreviousImage() {
    setSelectedImage((current) =>
      current === 0 ? productImageCount - 1 : current - 1,
    );
  }

  function handleNextImage() {
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

  const whatsappMessage = encodeURIComponent(
    `Hello MF Chikankari, I am interested in ${product.name}. Size: ${
      selectedSize || "Not selected"
    }, Quantity: ${quantity}. Please share availability and pricing.`,
  );

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-20">
        <div
          className="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray-500"
          style={{ fontFamily: "Poppins" }}
        >
          <Link to="/" className="hover:text-[#0F4C3A]">
            Home
          </Link>

          <span>/</span>

          <Link to="/products" className="hover:text-[#0F4C3A]">
            Products
          </Link>

          <span>/</span>

          <Link
            to={`/categories/${product.category.toLowerCase()}`}
            className="hover:text-[#0F4C3A]"
          >
            {product.category}
          </Link>

          <span>/</span>

          <span className="text-[#0F4C3A]">{product.name}</span>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          {/* Product Gallery */}
          <div className="lg:sticky lg:top-32">
            <div className="relative overflow-hidden rounded-[32px] border border-[#E8DCC5] bg-[#EFE8DB]">
              <img
                src={currentImage}
                alt={`${product.name} view ${selectedImage + 1}`}
                className="aspect-[4/5] h-full w-full object-cover"
              />

              {product.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePreviousImage}
                    aria-label="Previous product image"
                    className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0F4C3A] shadow-md backdrop-blur transition hover:bg-white"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextImage}
                    aria-label="Next product image"
                    className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0F4C3A] shadow-md backdrop-blur transition hover:bg-white"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`overflow-hidden rounded-[18px] border-2 transition ${
                    selectedImage === index
                      ? "border-[#0F4C3A]"
                      : "border-transparent hover:border-[#D9C8A8]"
                  }`}
                  aria-label={`View product image ${index + 1}`}
                >
                  <img
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="aspect-square h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p
                className="text-sm uppercase tracking-[0.3em] text-[#C9A86A]"
                style={{ fontFamily: "Poppins" }}
              >
                {product.category}
              </p>

              <button
                type="button"
                aria-label="Add product to wishlist"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D9C8A8] text-[#0F4C3A] transition hover:border-[#0F4C3A] hover:bg-[#0F4C3A] hover:text-white"
              >
                <Heart size={19} />
              </button>
            </div>

            <h1
              className="mt-3 text-5xl leading-tight text-[#0F4C3A] sm:text-6xl"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              {product.name}
            </h1>

            <div
              className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500"
              style={{ fontFamily: "Poppins" }}
            >
              <span>SKU: {product.sku}</span>

              <span
                className={`font-medium ${
                  product.stock > 0 ? "text-emerald-700" : "text-red-600"
                }`}
              >
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </span>
            </div>

            <p
              className="mt-6 text-base leading-8 text-gray-600 sm:text-lg"
              style={{ fontFamily: "Poppins" }}
            >
              {product.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <span
                className="text-3xl font-semibold text-[#0F4C3A]"
                style={{ fontFamily: "Poppins" }}
              >
                ₹{product.price.toLocaleString("en-IN")}
              </span>

              <span
                className="rounded-full bg-[#EFE8DB] px-4 py-2 text-sm font-medium text-[#0F4C3A]"
                style={{ fontFamily: "Poppins" }}
              >
                Wholesale ₹
                {product.wholesalePrice.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="mt-8 rounded-[24px] border border-[#E8DCC5] bg-white p-5">
              <div>
                <h2
                  className="font-semibold text-[#0F4C3A]"
                  style={{ fontFamily: "Poppins" }}
                >
                  Fabric
                </h2>

                <p
                  className="mt-2 text-gray-600"
                  style={{ fontFamily: "Poppins" }}
                >
                  {product.fabric}
                </p>
              </div>

              <div className="mt-6 border-t border-[#E8DCC5] pt-6">
                <div className="flex items-center justify-between gap-4">
                  <h2
                    className="font-semibold text-[#0F4C3A]"
                    style={{ fontFamily: "Poppins" }}
                  >
                    Select Size
                  </h2>

                  {selectedSize && (
                    <span className="text-sm text-gray-500">
                      Selected: {selectedSize}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-12 rounded-full border px-4 py-2 text-sm transition ${
                        selectedSize === size
                          ? "border-[#0F4C3A] bg-[#0F4C3A] text-white"
                          : "border-[#D9C8A8] text-[#0F4C3A] hover:border-[#0F4C3A]"
                      }`}
                      style={{ fontFamily: "Poppins" }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-[#E8DCC5] pt-6">
                <h2
                  className="font-semibold text-[#0F4C3A]"
                  style={{ fontFamily: "Poppins" }}
                >
                  Quantity
                </h2>

                <div className="mt-3 inline-flex items-center rounded-full border border-[#D9C8A8] bg-[#F8F5F0]">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={quantity === 1}
                    aria-label="Decrease quantity"
                    className="flex h-11 w-11 items-center justify-center rounded-full text-[#0F4C3A] transition hover:bg-[#EFE8DB] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Minus size={17} />
                  </button>

                  <span
                    className="min-w-12 text-center font-semibold text-[#0F4C3A]"
                    style={{ fontFamily: "Poppins" }}
                  >
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={quantity >= product.stock}
                    aria-label="Increase quantity"
                    className="flex h-11 w-11 items-center justify-center rounded-full text-[#0F4C3A] transition hover:bg-[#EFE8DB] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus size={17} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                disabled={product.stock === 0}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#0F4C3A] px-8 font-semibold text-white transition hover:bg-[#0A3D2F] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingBag size={19} />
                Add to Cart
              </button>

              <a
                href={`https://wa.me/916386826199?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 items-center justify-center rounded-full border border-[#0F4C3A] px-8 font-semibold text-[#0F4C3A] transition hover:bg-[#0F4C3A] hover:text-white"
              >
                Enquire on WhatsApp
              </a>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[20px] border border-[#E8DCC5] bg-white p-4">
                <Truck className="text-[#C9A86A]" size={22} />
                <h3 className="mt-3 font-semibold text-[#0F4C3A]">
                  Pan India Delivery
                </h3>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Secure shipping across India.
                </p>
              </div>

              <div className="rounded-[20px] border border-[#E8DCC5] bg-white p-4">
                <RotateCcw className="text-[#C9A86A]" size={22} />
                <h3 className="mt-3 font-semibold text-[#0F4C3A]">
                  Easy Support
                </h3>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Contact us for order assistance.
                </p>
              </div>

              <div className="rounded-[20px] border border-[#E8DCC5] bg-white p-4">
                <ShieldCheck className="text-[#C9A86A]" size={22} />
                <h3 className="mt-3 font-semibold text-[#0F4C3A]">
                  Quality Checked
                </h3>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Every piece is inspected before dispatch.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <div className="rounded-[28px] border border-[#E8DCC5] bg-white p-6 sm:p-8">
            <h2
              className="text-3xl text-[#0F4C3A]"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              Product Details
            </h2>

            <ul className="mt-5 space-y-3">
              {product.details.map((detail) => (
                <li
                  key={detail}
                  className="flex gap-3 text-gray-600"
                  style={{ fontFamily: "Poppins" }}
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9A86A]" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[28px] border border-[#E8DCC5] bg-white p-6 sm:p-8">
            <h2
              className="text-3xl text-[#0F4C3A]"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              Care Instructions
            </h2>

            <ul className="mt-5 space-y-3">
              {product.care.map((instruction) => (
                <li
                  key={instruction}
                  className="flex gap-3 text-gray-600"
                  style={{ fontFamily: "Poppins" }}
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9A86A]" />
                  <span>{instruction}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="border-t border-[#E8DCC5] bg-white/40">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
            <p
              className="text-sm uppercase tracking-[0.3em] text-[#C9A86A]"
              style={{ fontFamily: "Poppins" }}
            >
              You May Also Like
            </p>

            <h2
              className="mt-3 text-4xl text-[#0F4C3A] sm:text-5xl"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              Related Products
            </h2>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default ProductDetailsPage;