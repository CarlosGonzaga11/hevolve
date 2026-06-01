import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { supabase } from "../supabase";

// 1. Defina suas metas aqui (Dicionário)
const METAS = [
  { chave: 'primeiro_treino', nome: 'Início da Jornada', objetivo: 1, icone: '🥉' },
  { chave: 'treino_10', nome: 'Focado', objetivo: 10, icone: '🥈' },
  { chave: 'treino_25', nome: 'Atleta', objetivo: 25, icone: '🥇' },
  { chave: 'treino_50', nome: 'Monstro', objetivo: 50, icone: '🔥' },
];

export default function AchievementList({ totalTreinos }) {
  const [conquistasGanhas, setConquistasGanhas] = useState([]);

  useEffect(() => {
    async function carregarConquistas() {
      const { data } = await supabase.from("conquistas_desbloqueadas").select("chave_conquista");
      if (data) setConquistasGanhas(data.map(c => c.chave_conquista));
    }
    carregarConquistas();
  }, [totalTreinos]); // Recarrega se o total de treinos mudar

  return (
    <div className="mt-8 px-6">
      <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
        <Trophy className="text-[#22c55e]" size={20} /> Conquistas
      </h3>
      
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {METAS.map((meta) => {
          // Verifica se ele tem treinos suficientes PARA ESSA meta
          const desbloqueada = totalTreinos >= meta.objetivo;

          return (
            <div 
              key={meta.chave} 
              className={`flex-shrink-0 w-28 p-4 rounded-2xl border transition-all duration-500 ${
                desbloqueada 
                ? "bg-zinc-900 border-[#22c55e]/30 opacity-100" 
                : "bg-zinc-950 border-white/5 opacity-30 grayscale"
              }`}
            >
              <div className="text-3xl mb-2 text-center">{meta.icone}</div>
              <p className="text-[10px] font-bold text-center text-white leading-tight">
                {meta.nome}
              </p>
              <p className="text-[8px] text-center text-zinc-500 mt-1">
                {meta.objetivo} treinos
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}