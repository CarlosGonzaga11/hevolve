import type { ReactNode } from "react";

type CardBenefitsProps = {
  icon: ReactNode;
  title: string;
  text: string;
};
export default function CardBenefits({ icon, title, text }: CardBenefitsProps) {
  return (
    <div
      className="flex items-center gap-4 p-8 rounded-2xl
  bg-[#2D2D2D] border border-white/5 hover:border-[#4ADE80]/30 hover:-translate-y-1 transition-all duration-300
"
    >
      <div className=" flex items-center">
        <div className="flex gap-4 items-center">
          <span className="p-3 rounded bg-[#97eb9a]/10 ">{icon}</span>
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-xl font-bold text-[#FFFFFF]">{title}</span>
        <p className="text-sm  text-[#B3B3B3]">{text}</p>
      </div>
    </div>
  );
}
