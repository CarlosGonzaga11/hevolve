import { motion, useMotionValue } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTrain } from "../context/TrainContext";
import { useState } from "react";
import { Trash2 } from "lucide-react";

// Adicione os tipos corretos
type CardTrainProps = {
  id: number;
  nome: string;
  route: number;
  concluido: boolean;
  qntExercicio: [object];
};

export default function CardTrain({
  id,
  nome,
  route,
  concluido,
  qntExercicio,
}: CardTrainProps) {
  const { deleteCardTreino } = useTrain();
  const navigate = useNavigate();
  async function handleExcluir(e: React.MouseEvent) {
    e.stopPropagation();
    if (window.confirm("Deseja realmente mover este treino para a lixeira?")) {
      await deleteCardTreino(Number(id));
      navigate("/dashboard/treino"); // Volta para a tela inicial após excluir
    }
  }
  const cardStyle = concluido
    ? "border-green-500/50 bg-[#121212]"
    : "border-white/10 bg-[#121212] hover:border-green-500/50";

  const bgStyle = concluido ? "bg-green-500/10"  : "bg-black-500" 

  return (
    <div
      onClick={() => navigate(`/dashboard/treino/${route}`)}
      className={` ${bgStyle} ${cardStyle} relative  rounded-xl overflow-hidden p-6 cursor-pointer transition-all duration-75 hover:border border-[#22c55e]`}
    >
      <div className="flex items-center justify-between mb-4 ">
        <h2 className="text-lg font-semibold text-white min-w-9">{nome}</h2>
        <div  className="flex gap-2 items-center">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              concluido
                ? "bg-green-500 text-black"
                : "bg-green-500/20 text-green-400"
            }`}
          >
            {concluido ? "Concluído" : "Treino"}
          </span>
          <button
            onClick={handleExcluir}
            className="text-red-400 hover:bg-red-400/10  rounded-full transition z-30 p-4 cursor-pointer "
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="h-px bg-white/10 mb-4" />

      <div className="grid grid-cols-2 gap-4 text-sm text-[#B3B3B3]">
        <div className="flex flex-col">
          <span className="uppercase text-[11px]">Exercícios</span>
          <span className="text-white font-medium">{qntExercicio.length}</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="uppercase text-[11px]">Status</span>
          <span
            className={`font-medium ${
              concluido ? "text-green-500" : "text-amber-300"
            }`}
          >
            {concluido ? "Finalizado" : "Pendente"}
          </span>
        </div>
      </div>
    </div>
  );
}
