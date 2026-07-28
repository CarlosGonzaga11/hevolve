/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { useTrain } from "../context/TrainContext";
import { useEffect, useState } from "react";
import CardTrain from "../components/cardTrain";
import Loader from "../components/loader";

export default function TrainingPage() {
  const { listaTreinosSalvos, deleteCardTreino, buscarTreinos } = useTrain();
  const [loading,setLoading] = useState(false)
  const treinosAtivos = listaTreinosSalvos.filter((t) => t.deletado !== true);
  const treinosAtivosOrdenados = treinosAtivos.sort((a, b) => {
    return a.concluido - b.concluido;
  });


  { /* essa funcao precisa ser asyncriona pra funcinoar o loader */}
  useEffect(() => {
    setLoading(true)
    buscarTreinos();
    setLoading(false)
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
        <Link to="/dashboard/create" className="bg-green-500 p-2 rounded-lg text-white/90 px-2 hover:text-white transition duration-200 hover:bg-green-400">
          Criar Treino
        </Link>
      </div>
      {loading ? <Loader size="xl"/> : (  <div>
        <div className=" mt-6 px-6 gap-6 grid grid-cols-1">
          {treinosAtivosOrdenados.length === 0 && (
            <div className="text-3xl text-[#22c55e] font-semibold flex items-center flex-col gap-6">
              Nenhum treino encontrado
              <Link
                to="/dashboard/create"
                className="bg-green-500 p-2 rounded-lg text-black"
              >
                Crie seu próprio treino personalizado
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
      </div>)}
    </div>
  );
}
