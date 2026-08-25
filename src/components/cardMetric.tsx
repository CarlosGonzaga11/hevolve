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
      <div className="min-h-10 flex flex-col border bg-[#0f0f0f]  border-white/5 py-6 px-6 rounded  gap-3">
        {icon}
        <div className="flex flex-col">
          <span className="text-2xl text-[#B3B3B3] font-bold">{value}</span>
        
            <p className="text-sm text-[#22c55e] font-semibold">{p}</p>
       
     
        </div>
      </div>
    </div>
  );
}
