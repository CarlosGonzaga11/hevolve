import type { ReactNode } from "react";

type CardUserProps = {
  icon: ReactNode;
  title: string;
  subject: string;
};
export default function CardUser({ icon, subject, title }: CardUserProps) {
  return (
    <div>
      <div className="bg-white/10 max-w-lg rounded ">
        <div className=" flex gap-4 items-center px-4 py-4">
          <div className="p-2 rounded bg-[#22c55e]/10">{icon}</div>
          <div className="flex flex-col">
            <span className="text-[#B3B3B3] font-light">{title}</span>
            <span className="font-bold">{subject}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
