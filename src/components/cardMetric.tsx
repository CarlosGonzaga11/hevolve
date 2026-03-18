import type { ReactNode } from "react";

type MetricProps = {
  icon: ReactNode | string;
  value: string | number;
  p: string;
  color?: boolean;
};
export default function Metric({ icon, value, p, color }: MetricProps) {
  return (
    <div className="">
      <div className="flex flex-col border  border-[#D9D9D9]/30 py-6 px-6 rounded  gap-3">
        {icon}
        <div className="flex flex-col">
          <span className="text-2xl text-[#FAFAFA] font-bold">{value}</span>
          {color ? (
            <p className="text-[#22c55e] font-semibold">{p}</p>
          ) : (
            <p className="text-[#B3B3B3]">{p}</p>
          )}
        </div>
      </div>
    </div>
  );
}
