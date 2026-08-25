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
import { type ProgressoExercicio } from "../context/TrainContext";

interface GraficoEvolucaoProps {
  dados?: ProgressoExercicio[];
}

export default function GraficoEvolucao({ dados = [] }: GraficoEvolucaoProps) {
  useEffect(() => {
    if (dados && dados.length > 0) {
      console.log("Gráfico renderizando com:", dados.length, "pontos.");
    }
  }, [dados]);

  if (!dados || dados.length === 0) {
    return (
      <div className="h-75 w-full bg-[#121212] border border-white/10 p-4 rounded-xl flex items-center justify-center">
        <p className="text-zinc-500 text-sm">
          Nenhum dado de progresso disponível.
        </p>
      </div>
    );
  }

  let corDaLinha = "#22c55e";

  if (dados.length === 1) {
    corDaLinha = "#eab308"; // Amarelo consistente com Tailwind
  } else if (dados.length >= 2) {
    const ultimoPonto = dados[dados.length - 1]?.carga ?? 0;
    const penultimoPonto = dados[dados.length - 2]?.carga ?? 0;

    if (ultimoPonto < penultimoPonto) {
      corDaLinha = "#ef4444";
    }
  }

  return (
    <div className="h-75 w-full bg-[#121212] border border-white/10 p-4 rounded-xl shadow-lg flex flex-col justify-between">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white font-medium text-sm uppercase opacity-70">
          Evolução de Carga (kg)
        </h3>
        {dados.length >= 2 ? (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              corDaLinha === "#22c55e"
                ? "bg-green-500/10 text-green-500"
                : "bg-red-500/10 text-red-500"
            }`}
          >
            {corDaLinha === "#22c55e" ? "📈 PROGRESSÃO" : "📉 QUEDA DE CARGA"}
          </span>
        ) : (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500">
            📌 Primeiro Treino
          </span>
        )}
      </div>

      <div className="w-full h-55">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={dados}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
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
              dy={5}
            />

            <YAxis
              stroke="#666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "8px",
              }}
              itemStyle={{ color: corDaLinha }}
              labelStyle={{ color: "#aaa" }}
              formatter={(value: any) => [
                `${value ?? 0} kg`,
                "Carga",
              ]}
            />

            <Line
              type="monotone"
              dataKey="carga"
              stroke={corDaLinha}
              strokeWidth={3}
              dot={{
                r: 4,
                fill: corDaLinha,
                stroke: "#121212",
                strokeWidth: 2,
              }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
