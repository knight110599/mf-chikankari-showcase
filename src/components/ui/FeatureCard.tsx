import type { ReactNode } from "react";

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="group flex h-full flex-col rounded-[30px] border border-[#E8DCC5] bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#F8F5F0] text-[#C9A86A] transition group-hover:bg-[#0F4C3A] group-hover:text-white">
        {icon}
      </div>

      <h3
        className="text-2xl text-[#0F4C3A]"
        style={{ fontFamily: "Cormorant Garamond" }}
      >
        {title}
      </h3>

      <p
        className="mt-4 flex-1 leading-7 text-gray-600"
        style={{ fontFamily: "Poppins" }}
      >
        {description}
      </p>
    </div>
  );
}

export default FeatureCard;