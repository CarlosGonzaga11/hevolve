import { Link } from "react-router-dom";
import { useTrain } from "../context/TrainContext";
import { useEffect, useState } from "react";
import CardTrain from "../components/cardTrain";
import Loader from "../components/loader";
import { Dumbbell, Plus } from "lucide-react";

export default function TrainingPage() {
  const { listaTreinosSalvos, buscarTreinos } = useTrain();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function carregarTreinos() {
      try {
        setLoading(true);
        await buscarTreinos();
      } catch (error) {
        console.error("Erro ao buscar treinos:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    carregarTreinos();

    return () => {
      isMounted = false;
    };
  }, []);

  const treinosAtivos = listaTreinosSalvos.filter((t) => !t.deletado);

  const treinosAtivosOrdenados = [...treinosAtivos].sort((a, b) => {
    return Number(a.concluido) - Number(b.concluido);
  });

  return (
    <div className="text-white flex flex-col w-full min-h-screen bg-black pb-12">
      <div className="mt-12 px-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl  sm:mt-0 mt-6 uppercase font-extrabold tracking-tight text-[#22c55e]">
            Seus Treinos
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Escolha sua rotina de hoje
          </p>
        </div>
        <Link
          to="/dashboard/create"
          className="bg-[#22c55e] hover:bg-green-600 text-black font-semibold p-2.5 sm:px-4 rounded-xl text-sm flex items-center gap-1.5 transition-all duration-200 shadow-md shadow-green-500/10 active:scale-95"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Criar Treino</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader />
        </div>
      ) : (
        <div className="mt-6 px-6">
          <div className="grid grid-cols-1 gap-4">
            {treinosAtivosOrdenados.length === 0 && (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                <div className="w-12 h-12 mb-4 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center text-[#22c55e]">
                  <Dumbbell size={24} />
                </div>

                <h3 className="text-xl font-semibold text-white mb-2">
                  Nenhum treino encontrado
                </h3>

                <p className="text-sm text-zinc-400 mb-6 max-w-sm">
                  Você ainda não tem treinos cadastrados. Crie um agora para
                  começar a acompanhar sua evolução!
                </p>

                <Link
                  to="/dashboard/create"
                  className="bg-[#22c55e] hover:bg-green-600 text-black font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-green-500/10 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Criar treino personalizado
                </Link>
              </div>
            )}

            {treinosAtivosOrdenados.map((treino) => (
              <CardTrain
                key={treino.id}
                route={treino.id}
                qntExercicio={treino.itens_treino}
                nome={treino.nome}
                concluido={treino.concluido}
                id={treino.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
