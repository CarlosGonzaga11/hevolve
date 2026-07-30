/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { useTrain } from "../context/TrainContext";
import { useEffect, useState } from "react";
import CardTrain from "../components/cardTrain";
import Loader from "../components/loader";
import { Dumbbell } from "lucide-react";

export default function TrainingPage() {
  const { listaTreinosSalvos, deleteCardTreino, buscarTreinos } = useTrain();
  const [loading, setLoading] = useState(false);
  const treinosAtivos = listaTreinosSalvos.filter((t) => t.deletado !== true);
  const treinosAtivosOrdenados = treinosAtivos.sort((a, b) => {
    return a.concluido - b.concluido;
  });

  useEffect(() => {
    setLoading(true);
    buscarTreinos();
    setLoading(false);
    console.log("renderizei");
  }, []);

  return (
    <div className="text-white flex flex-col w-full min-h-screen bg-black">
      <div className="mt-12 px-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl uppercase font-bold tracking-tighter sm:mt-0  mt-6">
            Seus Treinos
          </h1>
          <p className="text-zinc-500">Escolha sua rotina de hoje</p>
        </div>
        <Link
          to="/dashboard/create"
          className="bg-green-500 p-2 rounded-lg text-white/90 px-2 hover:text-white transition duration-200 hover:bg-green-400"
        >
          Criar Treino
        </Link>
      </div>
      {loading ? (
        <Loader size="xl" />
      ) : (
        <div>
          <div className=" mt-6 px-6 gap-6 grid grid-cols-1">
            {treinosAtivosOrdenados.length === 0 && (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                <div className="w-12 h-12 mb-4 rounded-full bg-green-500/10 flex items-center justify-center text-[#4ADE80]">
                  <Dumbbell size={24} />
                </div>

                <h3 className="text-xl font-semibold text-white mb-2">
                  Nenhum treino encontrado
                </h3>

                <p className="text-sm text-gray-400 mb-6 max-w-sm">
                  Você ainda não tem treinos cadastrados. Crie um agora para
                  começar a acompanhar sua evolução!
                </p>

                <Link
                  to="/dashboard/create"
                  className="bg-[#4ADE80] hover:bg-[#22c55e] text-gray-950 font-semibold px-5 py-2.5 rounded-xl transition duration-200 shadow-lg shadow-green-500/10 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Criar treino personalizado
                </Link>
              </div>
            )}
            {treinosAtivosOrdenados.map((treino: any) => (
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
