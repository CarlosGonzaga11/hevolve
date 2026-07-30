import { useEffect, useState } from "react";
import { Trophy, Lock } from "lucide-react";
import { supabase } from "../supabase";
import { useAuth } from "../context/AuthContext";
import { METAS_ESTATICAS } from "../logic/Archievements";

export default function AchievementList({ totalTreinos }: { totalTreinos: number }) {
  const { user } = useAuth();
  const [conquistasBanco, setConquistasBanco] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;

    async function buscarConquistas() {
      const { data } = await supabase
        .from("conquistas_desbloqueadas")
        .select("chave_conquista")
        .eq("user_id", user.id);

      if (data) {
        setConquistasBanco(data.map((c) => c.chave_conquista));
      }
    }

    buscarConquistas();
  }, [user]);

  const totalDesbloqueadas = METAS_ESTATICAS.filter(
    (meta) => conquistasBanco.includes(meta.chave) || (meta.tipo === "treinos" && totalTreinos >= meta.objetivo)
  ).length;

  return (
    <div className="mt-8 px-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Trophy className="text-[#39FF14]" size={20} /> Conquistas
        </h3>
        <span className="text-xs font-semibold text-zinc-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
          {totalDesbloqueadas} / {METAS_ESTATICAS.length}
        </span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {METAS_ESTATICAS.map((meta) => {
          const desbloqueada =
            conquistasBanco.includes(meta.chave) ||
            (meta.tipo === "treinos" && totalTreinos >= meta.objetivo);

          const ehEscondidaEBloqueada = meta.escondida && !desbloqueada;

          return (
            <div
              key={meta.chave}
              className={`flex-shrink-0 w-32 p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                desbloqueada
                  ? "bg-white/5 border-[#39FF14]/40 shadow-lg shadow-[#39FF14]/5 opacity-100"
                  : "bg-white/[0.02] border-white/5 opacity-40 grayscale"
              }`}
            >
              {desbloqueada && (
                <div className="absolute top-0 right-0 w-12 h-12 bg-[#39FF14]/10 rounded-full blur-xl pointer-events-none" />
              )}

              <div>
                <div className="text-3xl mb-2 text-center flex items-center justify-center">
                  {ehEscondidaEBloqueada ? (
                    <span className="text-zinc-500">🔒</span>
                  ) : (
                    meta.icone
                  )}
                </div>

                <p className="text-xs font-bold text-center text-white leading-tight">
                  {ehEscondidaEBloqueada ? "Conquista Secreta" : meta.nome}
                </p>
              </div>

              <p className="text-[10px] text-center text-zinc-500 mt-2 font-medium italic">
                {ehEscondidaEBloqueada ? "????" : meta.descricao}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}