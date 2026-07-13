type ProductCardProps = {
  title: string;
  count: string;
};

function ProductCard({ title, count }: ProductCardProps) {
  return (
    <div className="group overflow-hidden rounded-[30px] border border-[#E8DCC5] bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div className="flex h-72 items-center justify-center bg-[#EFE8DB]">
        <span className="text-gray-400">Product Image</span>
      </div>

      <div className="p-6">
        <h3
          className="text-2xl text-[#0F4C3A]"
          style={{ fontFamily: "Cormorant Garamond" }}
        >
          {title}
        </h3>

        <p
          className="mt-2 text-sm text-gray-500"
          style={{ fontFamily: "Poppins" }}
        >
          {count}
        </p>

        <button
          className="mt-6 text-[#0F4C3A] font-medium group-hover:text-[#C9A86A]"
          style={{ fontFamily: "Poppins" }}
        >
          View Collection →
        </button>
      </div>
    </div>
  );
}

export default ProductCard;