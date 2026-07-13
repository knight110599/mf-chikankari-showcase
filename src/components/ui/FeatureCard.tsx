type FeatureCardProps = {
  icon: string;
  title: string;
  description: string;
};

function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="rounded-[30px] border border-[#E8DCC5] bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="mb-5 text-4xl">{icon}</div>

      <h3
        className="text-2xl text-[#0F4C3A]"
        style={{ fontFamily: "Cormorant Garamond" }}
      >
        {title}
      </h3>

      <p
        className="mt-4 leading-7 text-gray-600"
        style={{ fontFamily: "Poppins" }}
      >
        {description}
      </p>
    </div>
  );
}

export default FeatureCard;