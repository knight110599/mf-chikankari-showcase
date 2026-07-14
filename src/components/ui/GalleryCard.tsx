type GalleryCardProps = {
  image: string;
  title: string;
};

function GalleryCard({ image, title }: GalleryCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-[28px] shadow-lg">
      <img
        src={image}
        alt={title}
        className="h-[380px] w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div>
          <h3
            className="text-2xl text-white"
            style={{ fontFamily: "Cormorant Garamond" }}
          >
            {title}
          </h3>

          <p
            className="mt-2 text-sm text-gray-200"
            style={{ fontFamily: "Poppins" }}
          >
            View Collection
          </p>
        </div>
      </div>
    </div>
  );
}

export default GalleryCard;