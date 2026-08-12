import { Trash2, RotateCcw, Loader2, Trash } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useTrain } from "../context/TrainContext";
import Loader from "../components/loader";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

interface FichaDeletada {
  id: number | string;
  nome: string;
  deletado?: boolean;
}

export default function TrashPage() {
  const [lixeira, setLixeira] = useState<FichaDeletada[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | string | null>(null);

  const { restaurarTreino, excluirDefinitivamente } = useTrain();
  const { user } = useAuth();

  const carregarLixeira = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("fichas")
        .select("*")
        .eq("deletado", true)
        .eq("user_id", user.id);

      if (error) throw error;
      setLixeira(data || []);
    } catch (err) {
      console.error("Erro ao carregar lixeira:", err);
      toast.error("Não foi possível carregar a lixeira.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  async function handleRestaurar(id: number | string) {
    try {
      setActionLoadingId(id);
      await restaurarTreino(id);
      setLixeira((prev) => prev.filter((item) => item.id !== id));
      toast.success("Treino restaurado com sucesso!");
    } catch (err) {
      console.error("Erro ao restaurar treino:", err);
      toast.error("Erro ao restaurar o treino.");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleDeleteCompletly(id: number | string) {
    const confirmou = window.confirm(
      "Tem certeza que deseja excluir este treino definitivamente? Esta ação não pode ser desfeita.",
    );
    if (!confirmou) return;

    try {
      setActionLoadingId(id);
      await excluirDefinitivamente(id);
      setLixeira((prev) => prev.filter((item) => item.id !== id));
      toast.success("Treino excluído permanentemente.");
    } catch (err) {
      console.error("Erro ao excluir definitivamente:", err);
      toast.error("Erro ao excluir o treino.");
    } finally {
      setActionLoadingId(null);
    }
  }

  useEffect(() => {
    carregarLixeira();
  }, [carregarLixeira]);

  return (
    <div className="text-white flex flex-col w-full min-h-screen bg-black pb-12">
      <div className="mt-12 px-6 flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl uppercase font-bold tracking-tighter sm:mt-0 mt-6 text-white">
            Lixeira
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Treinos removidos temporariamente</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader />
        </div>
      ) : lixeira.length === 0 ? (
        <div className="mt-12 px-6 flex flex-col items-center justify-center p-8 text-center bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md max-w-xl mx-6">
          <div className="w-12 h-12 mb-4 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
            <Trash size={22} />
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">
            Lixeira vazia
          </h3>
          <p className="text-sm text-zinc-400">
            Nenhum treino deletado no momento.
          </p>
        </div>
      ) : (
        <div className="grid px-6 gap-3 max-w-3xl w-full">
          {lixeira.map((train) => {
            const isItemLoading = actionLoadingId === train.id;

            return (
              <div
                key={train.id}
                className="bg-[#121212] border border-white/10 rounded-xl p-4 flex items-center justify-between hover:border-white/20 transition duration-200"
              >
                <span className="font-medium text-white truncate pr-4">
                  {train.nome}
                </span>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    disabled={isItemLoading}
                    onClick={() => handleRestaurar(train.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[#22c55e] bg-[#22c55e]/10 hover:bg-[#22c55e]/20 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    {isItemLoading ? (
                      <Loader2 size="16" className="animate-spin" />
                    ) : (
                      <RotateCcw size={16} />
                    )}
                    <span>Restaurar</span>
                  </button>

                  {/* Excluir Definitivamente */}
                  <button
                    disabled={isItemLoading}
                    onClick={() => handleDeleteCompletly(train.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    <Trash2 size={16} />
                    <span>Excluir</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}