type SectionTitleProps = {
  subtitle: string;
  title: string;
  description: string;
};

function SectionTitle({
  subtitle,
  title,
  description,
}: SectionTitleProps) {
  return (
    <div className="mx-auto mb-16 max-w-3xl text-center">
      <p
        className="text-sm uppercase tracking-[0.35em] text-[#C9A86A]"
        style={{ fontFamily: "Poppins" }}
      >
        {subtitle}
      </p>

      <h2
        className="mt-4 text-5xl text-[#0F4C3A]"
        style={{ fontFamily: "Cormorant Garamond" }}
      >
        {title}
      </h2>

      <p
        className="mt-5 text-lg leading-8 text-gray-600"
        style={{ fontFamily: "Poppins" }}
      >
        {description}
      </p>
    </div>
  );
}

export default SectionTitle;