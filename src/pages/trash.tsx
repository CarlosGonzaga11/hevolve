import { Trash2, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useTrain } from "../context/TrainContext";
import Loader from "../components/loader";

export default function TrashPage() {
  const [lixeira, setLixeira] = useState([]);
  const [ loading,setLoading] = useState(false)
  const { restaurarTreino, excluirDefinitivamente, listaTreinosSalvos } =
    useTrain();

  async function carregarLixeira() {
    console.log("lixeira renderizada");
    setLoading(true)
    const { data } = await supabase
      .from("fichas")
      .select("*")
      .eq("deletado", true);
    setLixeira(data || []);
    setLoading(false)
  }

  async function handleDeletar(id) {
    await restaurarTreino(id);
  }

  async function handleDeleteCompletly(id) {
    await excluirDefinitivamente(id);
  }
  useEffect(() => {
    carregarLixeira();
  }, []);
  return (
    <div className="min-h-screen bg-[#0e0e0e] p-6">
      <h1 className="mt-12 sm:mt-0 text-2xl font-bold mb-6 flex items-center gap-2">
        🗑️ Lixeira
      </h1>
        <div className={` ${loading ? "w-full h-full" : ""} flex items-center text-center justify-center`}>
       {
      loading ? <Loader size="md"/>  : <span></span>
      }
     </div>
   
      {lixeira.length === 0 ? (
        <div className="text-center text-white/50 mt-20">
          Nenhum item na lixeira
        </div>
      ) : (
        <div className="grid gap-4 max-w-3xl">
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
                  "
                  onClick={() => handleDeletar(train.id)}
                >
                  <RotateCcw size={16} />
                  Restaurar
                </button>

                <button
                  className="
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
