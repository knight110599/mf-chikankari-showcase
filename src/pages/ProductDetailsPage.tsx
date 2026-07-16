import { Link, useParams } from "react-router-dom";
import { products } from "../data/products";

function ProductDetailsPage() {
  const { slug } = useParams();

  const product = products.find((item) => item.slug === slug);

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

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="mb-8 text-sm text-gray-500">
        <Link to="/" className="hover:text-[#0F4C3A]">
          Home
        </Link>

        <span className="mx-2">/</span>

        <Link to="/products" className="hover:text-[#0F4C3A]">
          Products
        </Link>

        <span className="mx-2">/</span>

        <span className="text-[#0F4C3A]">{product.name}</span>
      </div>

      <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
        <div className="overflow-hidden rounded-[32px] border border-[#E8DCC5] bg-[#EFE8DB]">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#C9A86A]">
            {product.category}
          </p>

          <h1
            className="mt-3 text-5xl leading-tight text-[#0F4C3A] sm:text-6xl"
            style={{ fontFamily: "Cormorant Garamond" }}
          >
            {product.name}
          </h1>

          <p className="mt-5 text-lg text-gray-600">
            Premium handcrafted Lucknowi Chikankari made with carefully selected
            fabric and traditional embroidery techniques.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <span className="text-2xl font-semibold text-[#0F4C3A]">
              ₹{product.price.toLocaleString("en-IN")}
            </span>

            <span className="rounded-full bg-[#EFE8DB] px-4 py-2 text-sm text-[#0F4C3A]">
              Wholesale ₹{product.wholesalePrice.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="mt-8">
            <h2 className="font-semibold text-[#0F4C3A]">Fabric</h2>
            <p className="mt-2 text-gray-600">{product.fabric}</p>
          </div>

          <div className="mt-8">
            <h2 className="font-semibold text-[#0F4C3A]">Available Sizes</h2>

            <div className="mt-3 flex flex-wrap gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className="min-w-12 rounded-full border border-[#D9C8A8] px-4 py-2 text-sm text-[#0F4C3A] transition hover:border-[#0F4C3A] hover:bg-[#0F4C3A] hover:text-white"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href={`https://wa.me/916386826199?text=${encodeURIComponent(
                `Hello MF Chikankari, I am interested in ${product.name}. Please share availability and pricing.`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#0F4C3A] px-8 font-semibold text-white transition hover:bg-[#0A3D2F]"
            >
              Enquire on WhatsApp
            </a>

            <Link
              to="/products"
              className="inline-flex min-h-14 items-center justify-center rounded-full border border-[#0F4C3A] px-8 font-semibold text-[#0F4C3A] transition hover:bg-[#0F4C3A] hover:text-white"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetailsPage;