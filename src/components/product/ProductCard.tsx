import { Link } from "react-router-dom";
import type { Product } from "../../data/products";
import type { ApiProduct } from "../../services/product.service";

type ProductCardProps = {
  product: Product | ApiProduct;
};

function isApiProduct(product: Product | ApiProduct): product is ApiProduct {
  return typeof product.category === "object";
}

function ProductCard({ product }: ProductCardProps) {
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

  const fabricName = product.fabric ?? "Fabric details unavailable";

  const price = Number(product.price);

  return (
    <article className="group overflow-hidden rounded-[28px] border border-[#E8DCC5] bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
      <Link to={`/products/${product.slug}`} className="block">
        <div className="h-80 overflow-hidden bg-[#EFE8DB]">
          <img
            src={imageUrl}
            alt={imageAlt}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[#C9A86A]">
            {categoryName}
          </p>

          <h2
            className="mt-3 text-2xl leading-tight text-[#0F4C3A]"
            style={{ fontFamily: "Cormorant Garamond" }}
          >
            {product.name}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {fabricName}
          </p>

          <div className="mt-5 flex items-center justify-between">
            <span className="font-semibold text-[#0F4C3A]">
              ₹{price.toLocaleString("en-IN")}
            </span>

            <span className="text-sm font-medium text-[#0F4C3A]">
              View Details →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default ProductCard;