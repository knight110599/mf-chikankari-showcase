import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "../../data/products";
import type { ApiProduct } from "../../services/product.service";

type ProductCardProps = {
  product: Product | ApiProduct;
  showFeaturedBadge?: boolean;
  showNewArrivalBadge?: boolean;
};

function isApiProduct(product: Product | ApiProduct): product is ApiProduct {
  return typeof product.category === "object";
}

function ProductCard({
  product,
  showFeaturedBadge = true,
  showNewArrivalBadge = false,
}: ProductCardProps) {
  const apiProduct = isApiProduct(product);

  const primaryImage = apiProduct
    ? product.images.find((image) => image.isPrimary) ?? product.images[0]
    : null;

  const imageUrl = apiProduct
    ? primaryImage?.url ?? "/placeholder-product.jpg"
    : product.image;

  const imageAlt = apiProduct
    ? primaryImage?.altText ?? product.name
    : product.name;

  const categoryName = apiProduct
    ? product.category.name
    : product.category;

  const fabricName =
    product.fabric?.trim() || "Handcrafted Chikankari";

  const price = Number(product.price);

  const wholesalePrice =
    "wholesalePrice" in product && product.wholesalePrice
      ? Number(product.wholesalePrice)
      : null;

  const isFeatured =
    "featured" in product
      ? Boolean(product.featured)
      : "isFeatured" in product
        ? Boolean(product.isFeatured)
        : false;
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
  {showFeaturedBadge && isFeatured && (
    <span
      className="bg-white/90 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0F4C3A] backdrop-blur-sm"
      style={{ fontFamily: "Poppins" }}
    >
      Featured
    </span>
  )}

  {showNewArrivalBadge && isNewArrival && (
    <span
      className="bg-[#C9A86A] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white shadow-lg"
      style={{ fontFamily: "Poppins" }}
    >
      ✦ New Arrival
    </span>
  )}

  {wholesalePrice && (
    <span
      className="bg-[#0F4C3A]/90 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm"
      style={{ fontFamily: "Poppins" }}
    >
      Wholesale
    </span>
  )}
</div>
          <div className="absolute bottom-4 right-4 flex h-12 w-12 translate-y-2 items-center justify-center rounded-full bg-white text-[#0F4C3A] opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight size={19} />
          </div>
        </div>

        <div className="border-b border-[#D9C8A8] py-7">
          <p
            className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#B38E49]"
            style={{ fontFamily: "Poppins" }}
          >
            {categoryName}
          </p>

          <h3
            className="mt-3 text-[34px] leading-[1.05] text-[#0F4C3A] transition-colors duration-300 group-hover:text-[#B38E49]"
            style={{ fontFamily: "Cormorant Garamond" }}
          >
            {product.name}
          </h3>

          <p
            className="mt-3 text-sm leading-6 text-[#6C746F]"
            style={{ fontFamily: "Poppins" }}
          >
            {fabricName}
          </p>

          <div className="mt-6 flex items-end justify-between gap-5">
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.18em] text-[#8A918D]"
                style={{ fontFamily: "Poppins" }}
              >
                Retail
              </p>

              <p
                className="mt-1 text-lg font-semibold text-[#0F4C3A]"
                style={{ fontFamily: "Poppins" }}
              >
                ₹{price.toLocaleString("en-IN")}
              </p>
            </div>

            {wholesalePrice && (
              <div className="text-right">
                <p
                  className="text-[10px] uppercase tracking-[0.18em] text-[#8A918D]"
                  style={{ fontFamily: "Poppins" }}
                >
                  Wholesale
                </p>

                <p
                  className="mt-1 text-lg font-semibold text-[#0F4C3A]"
                  style={{ fontFamily: "Poppins" }}
                >
                  ₹{wholesalePrice.toLocaleString("en-IN")}
                </p>
              </div>
            )}
          </div>

          <div
            className="mt-7 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0F4C3A]"
            style={{ fontFamily: "Poppins" }}
          >
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