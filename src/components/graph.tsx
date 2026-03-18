import { useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function GraficoEvolucao({ dados }) {
  useEffect(() => {
    // Isso garante que o componente saiba que os dados chegaram
    console.log("Gráfico renderizando com:", dados);
  }, [dados]);
  return (
    <div
      style={{ width: "100%", height: 300 }}
      className="h-75 w-full bg-[#121212] border border-white/10 p-4 rounded-xl"
    >
      <h3 className="text-white font-medium mb-4 text-sm uppercase opacity-70">
        Evolução de Carga (kg)
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={dados}>
          {/* Grade sutil ao fundo */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#ffffff10"
            vertical={false}
          />

          <XAxis
            dataKey="data"
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={10}
          />

          <YAxis
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />

          {/* Tooltip personalizado para combinar com seu app */}
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: "8px",
            }}
            itemStyle={{ color: "#22c55e" }}
            labelStyle={{ color: "#666" }}
          />

          <Line
            type="monotone"
            dataKey="carga"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{ r: 4, fill: "#22c55e", strokeWidth: 2, stroke: "#121212" }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
