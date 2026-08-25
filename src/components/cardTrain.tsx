import { useNavigate } from "react-router-dom";
import { useTrain, type ItemTreino } from "../context/TrainContext";
import { Trash2 } from "lucide-react";

type CardTrainProps = {
  id: number;
  nome: string;
  route: number;
  concluido: boolean;
  qntExercicio?: ItemTreino[] | any[];
};

export default function CardTrain({
  id,
  nome,
  route,
  concluido,
  qntExercicio = [],
}: CardTrainProps) {
  const { deleteCardTreino } = useTrain();
  const navigate = useNavigate();

  async function handleExcluir(e: React.MouseEvent) {
    e.stopPropagation();
    if (window.confirm("Deseja realmente mover este treino para a lixeira?")) {
      await deleteCardTreino(id);
    }
  }

  const cardStyle = concluido
    ? "border-green-500/50 bg-[#121212]"
    : "border-white/10 bg-[#121212] hover:border-green-500/50";

  const bgStyle = concluido ? "bg-green-500/10" : "bg-zinc-950";

  return (
    <div
      onClick={() => navigate(`/dashboard/treino/${route}`)}
      className={`${bgStyle} ${cardStyle} relative border rounded-xl overflow-hidden p-6 cursor-pointer transition-all duration-200 active:scale-[0.99]`}
    >
      <div className="flex items-center justify-between mb-4 gap-2">
        <h2 className="text-lg font-semibold text-white truncate">{nome}</h2>
        <div className="flex gap-2 items-center shrink-0">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              concluido
                ? "bg-[#22c55e] text-black"
                : "bg-green-500/20 text-green-400"
            }`}
          >
            {concluido ? "Concluído" : "Treino"}
          </span>
          <button
            onClick={handleExcluir}
            className="text-red-400 hover:bg-red-400/10 p-2 rounded-lg transition z-10 cursor-pointer"
            title="Mover para lixeira"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="h-px bg-white/10 mb-4" />

      <div className="grid grid-cols-2 gap-4 text-sm text-[#B3B3B3]">
        <div className="flex flex-col">
          <span className="uppercase text-[11px] font-semibold text-zinc-500">
            Exercícios
          </span>
          <span className="text-white font-medium">
            {qntExercicio?.length || 0}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="uppercase text-[11px] font-semibold text-zinc-500">
            Status
          </span>
          <span
            className={`font-medium ${
              concluido ? "text-[#22c55e]" : "text-amber-400"
            }`}
          >
            {concluido ? "Finalizado" : "Pendente"}
          </span>
        </div>
      </div>
    </div>
  );
}