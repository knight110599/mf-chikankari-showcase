type ProcessCardProps = {
  step: string;
  title: string;
  description: string;
  icon: string;
};

function ProcessCard({
  step,
  title,
  description,
  icon,
}: ProcessCardProps) {
  return (
    <div className="group relative rounded-[28px] border border-[#E8DCC5] bg-white p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F8F5F0] text-3xl">
        {icon}
      </div>

      <span
        className="text-xs uppercase tracking-[0.3em] text-[#C9A86A]"
        style={{ fontFamily: "Poppins" }}
      >
        {step}
      </span>

      <h3
        className="mt-3 text-2xl text-[#0F4C3A]"
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

export default ProcessCard;