import { Trash2, RotateCcw } from "lucide-react";
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
  const [actionLoadingId, setActionLoadingId] = useState<
    number | string | null
  >(null);
  const { restaurarTreino, excluirDefinitivamente, listaTreinosSalvos } =
    useTrain();
  const { user } = useAuth();

  const carregarLixeira = useCallback(
    async function carregarLixeira() {
      if (!user) return;
      setLoading(true);
      const { data } = await supabase
        .from("fichas")
        .select("*")
        .eq("deletado", true)
        .eq("user_id", user.id);
      setLixeira(data || []);
      setLoading(false);
    },
    [user],
  );

  async function handleRestaurar(id) {
    try {
      setActionLoadingId(id);
      await restaurarTreino(id);
      setLixeira((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Erro ao restaurar treino", err);
    } finally {
      setActionLoadingId(null);
      toast.success("Treino restaurado");
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
    } catch (err) {
      console.error("Erro ao excluir definitivamente:", err);
    } finally {
      setActionLoadingId(null);
      toast.success("Treino Deletado");
    }
  }
  useEffect(() => {
    carregarLixeira();
  }, [user]);
  return (
    <div className="text-white flex flex-col w-full min-h-screen bg-black">
      <div className="mt-12 px-6 flex justify-between items-end mb-4">
        <div>
          <h1 className="text-3xl uppercase font-bold tracking-tighter sm:mt-0  mt-6">
            Lixeira
          </h1>
          <p className="text-zinc-500">Treinos deletados</p>
        </div>
      </div>
      <div
        className={` ${loading ? "w-full h-full" : ""} flex items-center text-center justify-center`}
      >
        {loading ? <Loader size="md" /> : <span></span>}
      </div>

      {lixeira.length === 0 ? (
        <div className="text-center text-white/50 mt-20">
          Nenhum item na lixeira
        </div>
      ) : (
        <div className="grid px-6 gap-4 max-w-3xl">
          {lixeira.map((train) => (
            <div
              key={train.id}
              className="
                bg-[#121212]
                border border-white/10
                rounded-xl
                p-4
                flex
                items-center
                justify-between
                hover:border-white/20
                transition
              "
            >
              <span className="font-medium text-white">{train.nome}</span>

              <div className="flex gap-2">
                <button
                  className="
                    flex items-center gap-1
                    px-3 py-1.5
                    rounded-md
                    text-sm
                    text-green-400
                    bg-green-400/10
                    hover:bg-green-400/20
                    transition
                    cursor-pointer
                  "
                  onClick={() => handleRestaurar(train.id)}
                >
                  <RotateCcw size={16} />
                  Restaurar
                </button>

                <button
                  className="
                  cursor-pointer
                    flex items-center gap-1
                    px-3 py-1.5
                    rounded-md
                    text-sm
                    text-red-400
                    bg-red-400/10
                    hover:bg-red-400/20
                    transition
                  "
                  onClick={() => handleDeleteCompletly(train.id)}
                >
                  <Trash2 size={16} />
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
