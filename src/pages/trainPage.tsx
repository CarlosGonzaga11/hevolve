/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { useTrain } from "../context/TrainContext";
import { useEffect } from "react";
import CardTrain from "../components/cardTrain";

export default function TrainingPage() {
  const { listaTreinosSalvos, deleteCardTreino, buscarTreinos } = useTrain();
  const treinosAtivos = listaTreinosSalvos.filter((t) => t.deletado !== true);

  useEffect(() => {
    buscarTreinos();
    console.log("renderizei");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="text-white flex flex-col w-full min-h-screen bg-black">
      <div className="mt-12 px-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl uppercase font-bold tracking-tighter">
            Seus Treinos
          </h1>
          <p className="text-zinc-500">Escolha sua rotina de hoje</p>
        </div>
        <Link
          to="/dashboard"
          className="bg-green-500 p-2 rounded-lg text-black"
        ></Link>
      </div>
      <div>
        <div className=" mt-6 px-6 gap-6 grid grid-cols-1">
          {treinosAtivos.map((treino: any) => (
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
    </div>
  );
}
