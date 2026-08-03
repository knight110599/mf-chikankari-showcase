import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/useAuth";
import type { Product } from "../../data/products";
import type { ApiProduct } from "../../services/product.service";

type ProductCardProps = {
  product: Product | ApiProduct;
  showFeaturedBadge?: boolean;
  showNewArrivalBadge?: boolean;
};

function isApiProduct(
  product: Product | ApiProduct,
): product is ApiProduct {
  return typeof product.category === "object";
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

function ProductCard({
  product,
  showFeaturedBadge = true,
  showNewArrivalBadge = false,
}: ProductCardProps) {
  const { user } = useAuth();

  const apiProduct = isApiProduct(product);
  const isWholesaleUser =
    user?.role === "wholesale";

  const primaryImage = apiProduct
    ? product.images.find(
        (image) => image.isPrimary,
      ) ?? product.images[0]
    : null;

  const imageUrl = apiProduct
    ? primaryImage?.url ??
      "/placeholder-product.jpg"
    : product.image;

  const imageAlt = apiProduct
    ? primaryImage?.altText ?? product.name
    : product.name;

  const categoryName = apiProduct
    ? product.category.name
    : product.category;

  const fabricName =
    product.fabric?.trim() ||
    "Handcrafted Chikankari";

  const retailPrice = Number(product.price);

  const wholesalePrice =
    "wholesalePrice" in product &&
    product.wholesalePrice !== null &&
    product.wholesalePrice !== undefined
      ? Number(product.wholesalePrice)
      : null;

  const minimumWholesaleQuantity =
    "minimumWholesaleQuantity" in product
      ? product.minimumWholesaleQuantity
      : null;

  const canUseWholesalePrice =
    isWholesaleUser &&
    wholesalePrice !== null &&
    Number.isFinite(wholesalePrice);

  const displayPrice = canUseWholesalePrice
    ? wholesalePrice
    : retailPrice;

  const isFeatured =
    "featured" in product
      ? Boolean(product.featured)
      : Boolean(product.isFeatured);

  const isNewArrival =
    "isNewArrival" in product
      ? Boolean(product.isNewArrival)
      : false;

  return (
    <article className="group relative transition-transform duration-500 hover:-translate-y-2">
      <Link
        to={`/products/${product.slug}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C3A] focus-visible:ring-offset-4"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-[8px] bg-[#DDD3C3]">
          <img
            src={imageUrl}
            alt={imageAlt}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {showFeaturedBadge &&
              isFeatured && (
                <span className="bg-white/90 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0F4C3A] backdrop-blur-sm">
                  Featured
                </span>
              )}

            {showNewArrivalBadge &&
              isNewArrival && (
                <span className="bg-[#C9A86A] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white shadow-lg">
                  New Arrival
                </span>
              )}

            {canUseWholesalePrice && (
              <span className="bg-[#0F4C3A]/90 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                Wholesale
              </span>
            )}
          </div>

          <div className="absolute bottom-4 right-4 flex h-12 w-12 translate-y-2 items-center justify-center rounded-full bg-white text-[#0F4C3A] opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight size={19} />
          </div>
        </div>

        <div className="border-b border-[#D9C8A8] py-7">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#B38E49]">
            {categoryName}
          </p>

          <h3 className="mt-3 font-serif text-[34px] leading-[1.05] text-[#0F4C3A] transition-colors duration-300 group-hover:text-[#B38E49]">
            {product.name}
          </h3>

          <p className="mt-3 text-sm leading-6 text-[#6C746F]">
            {fabricName}
          </p>

          <div className="mt-6">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#8A918D]">
              {canUseWholesalePrice
                ? "Wholesale price"
                : "Retail price"}
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-3">
              <p className="text-lg font-semibold text-[#0F4C3A]">
                ₹{formatPrice(displayPrice)}
              </p>

              {canUseWholesalePrice && (
                <p className="text-sm text-[#8A918D] line-through">
                  ₹{formatPrice(retailPrice)}
                </p>
              )}
            </div>

            {canUseWholesalePrice &&
              minimumWholesaleQuantity && (
                <p className="mt-2 text-xs font-medium text-[#9B7B3D]">
                  Minimum order:{" "}
                  {minimumWholesaleQuantity} pieces
                </p>
              )}
          </div>

          <div className="mt-7 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0F4C3A]">
            View product

            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </div>
        </div>
      </Link>
    </article>
  );
}

export default ProductCard;