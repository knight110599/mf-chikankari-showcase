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
    <div className="group relative h-full rounded-[24px] border border-[#E8DCC5] bg-white px-5 py-7 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-[#D8C29A] hover:shadow-xl sm:px-6 sm:py-8">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F8F5F0] text-2xl transition-transform duration-300 group-hover:scale-105">
        {icon}
      </div>

      <span
        className="text-[11px] uppercase tracking-[0.28em] text-[#C9A86A]"
        style={{ fontFamily: "Poppins" }}
      >
        {step}
      </span>

      <h3
        className="mt-3 text-[26px] leading-tight text-[#0F4C3A]"
        style={{ fontFamily: "Cormorant Garamond" }}
      >
        {title}
      </h3>

      <p
        className="mx-auto mt-3 max-w-[250px] text-sm leading-6 text-gray-600 sm:text-[15px]"
        style={{ fontFamily: "Poppins" }}
      >
        {description}
      </p>
    </div>
  );
}

export default ProcessCard;