import { Link } from "react-router-dom";
import type { Product } from "../../data/products";

type ProductCardProps = {
  product: Product;
};

function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-[#E8DCC5] bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
      <Link to={`/products/${product.slug}`} className="block">
        <div className="h-80 overflow-hidden bg-[#EFE8DB]">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[#C9A86A]">
            {product.category}
          </p>

          <h2
            className="mt-3 text-2xl leading-tight text-[#0F4C3A]"
            style={{ fontFamily: "Cormorant Garamond" }}
          >
            {product.name}
          </h2>

          <p className="mt-2 text-sm text-gray-500">{product.fabric}</p>

          <div className="mt-5 flex items-center justify-between">
            <span className="font-semibold text-[#0F4C3A]">
              ₹{product.price.toLocaleString("en-IN")}
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