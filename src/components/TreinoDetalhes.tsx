import { Link, useParams, useNavigate } from "react-router-dom";
import { useTrain } from "../context/TrainContext";
import { useState } from "react";

export default function TreinoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listaTreinosSalvos, finalizarTreinoComHistorico } = useTrain();

  // Estado local para controlar os inputs de peso/reps enquanto o usuário digita
  const [valoresAtuais, setValoresAtuais] = useState({});

  const treino = listaTreinosSalvos.find((t) => Number(t.id) === Number(id));

  if (!treino)
    return <div className="text-white p-6">Treino não encontrado</div>;

  const handleInputChange = (itemId, serieNum, campo, valor) => {
    setValoresAtuais((prev) => ({
      ...prev,
      [`${itemId}-${serieNum}`]: {
        ...prev[`${itemId}-${serieNum}`],
        [campo]: Number(valor),
        item_treino_id: itemId,
        numero_serie: serieNum,
      },
    }));
  };

  const handleFinalizar = async () => {
    // Transformamos o estado local no formato que o banco espera
    const dadosParaHistorico = Object.values(valoresAtuais);

    if (dadosParaHistorico.length === 0) {
      alert("Preencha pelo menos uma série!");
      return;
    }

    await finalizarTreinoComHistorico(treino.id, dadosParaHistorico);
    navigate("/"); // Volta para a home após finalizar
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="mb-8">
        <Link to="/" className="text-sm text-zinc-400 hover:text-white">
          ← Voltar
        </Link>
        <h1 className="text-4xl font-bold mt-2">{treino.nome}</h1>
      </div>

      <div className="grid gap-6 mb-20">
        {treino.itens_treino.map((item) => (
          <div
            key={item.id}
            className="bg-zinc-900 border border-white/10 rounded-2xl p-5"
          >
            <h3 className="text-xl font-bold text-green-400 mb-4">
              Exercício {item.nome}
            </h3>

            <div className="space-y-2">
              <div className="grid grid-cols-[2rem_1fr_1fr] gap-2 px-2 text-[11px] font-bold text-zinc-500 uppercase">
                <span>Set</span>
                <span>Peso (kg)</span>
                <span>Reps</span>
              </div>

              {/* GERANDO AS LINHAS DINAMICAMENTE BASEADO NA META (item.series) */}
              {Array.from({ length: item.series || 0 }).map((_, i) => {
                const numeroSerie = i + 1;
                return (
                  <div
                    key={numeroSerie}
                    className="grid grid-cols-[2rem_1fr_1fr] gap-2 bg-zinc-950/50 p-3 rounded-lg items-center"
                  >
                    <span className="text-zinc-500 text-sm">
                      {numeroSerie}º
                    </span>

                    <input
                      type="number"
                      placeholder="0"
                      onChange={(e) =>
                        handleInputChange(
                          item.id,
                          numeroSerie,
                          "peso",
                          e.target.value
                        )
                      }
                      className="bg-zinc-800 rounded-md py-2 px-3 text-sm outline-none focus:border-green-500 border border-transparent"
                    />

                    <input
                      type="number"
                      placeholder={item.repeticoes || "0"}
                      onChange={(e) =>
                        handleInputChange(
                          item.id,
                          numeroSerie,
                          "repeticoes",
                          e.target.value
                        )
                      }
                      className="bg-zinc-800 rounded-md py-2 px-3 text-sm outline-none focus:border-green-500 border border-transparent"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-6 left-0 w-full px-6">
        <button
          onClick={handleFinalizar}
          className="bg-green-500 text-black font-extrabold py-4 rounded-xl hover:bg-green-400 transition w-full shadow-lg shadow-green-500/20"
        >
          FINALIZAR E SALVAR CARGAS
        </button>
      </div>
    </div>
  );
}

// import { Link, useParams } from "react-router-dom";
// import { useTrain } from "../context/TrainContext";
// export default function TreinoDetalhes() {
//   const { id } = useParams();
//   const {
//     listaTreinosSalvos,
//     atualizarSerie,
//     finalizarTreino,
//     deleteCardTreino,
//     finalizarTreinoComHistorico,
//   } = useTrain();

//   const treino = listaTreinosSalvos.find((t) => Number(t.id) === Number(id));
//   console.log("treino", treino);

//   const handleFinalizar = async () => {
//     const dadosParaHistorico = treino.itens_treino.flatMap((item) =>
//       item.series_executadas.map((serie) => ({
//         item_treino_id: item.id,
//         numero_serie: serie.numero_serie,
//         peso: serie.peso,
//         repeticoes: serie.repeticoes,
//       }))
//     );

//     await finalizarTreinoComHistorico(treino.id, dadosParaHistorico);

//     await finalizarTreino(treino.id);
//   };
//   if (!treino)
//     return <div className="text-white p-6">Treino não encontrado</div>;

//   return (
//     <div className="min-h-screen bg-zinc-950 text-white p-6">
//       <div className="mb-8 flex justify-between items-start">
//         <div>
//           <Link
//             to="/"
//             className="text-sm text-zinc-400 hover:text-white transition"
//           >
//             ← Voltar
//           </Link>
//           <h1 className="text-4xl font-bold mt-2">{treino.nome}</h1>
//         </div>
//       </div>

//       <div className="grid gap-6">
//         {treino.itens_treino.map((item) => (
//           <div
//             key={item.id}
//             className="bg-zinc-900 border border-white/10 rounded-2xl p-5"
//           >
//             <h3 className="text-xl font-bold text-green-400 mb-4">
//               Exercício #{item.exercicio_id}
//             </h3>

//             <div className="space-y-2">
//               <div className="grid grid-cols-[2rem_1fr_1fr_1fr] gap-2 px-2 text-[11px] font-bold text-[#B3B3B3] ">
//                 <span>série</span>
//                 <span>peso</span>
//                 <span>repetições</span>
//                 <span>peso anterior</span>
//               </div>
//               {(item.series_executadas || []).map((serie) => (
//                 <div
//                   key={serie.id}
//                   className="grid grid-cols-[2rem_1fr_1fr_1fr] gap-2  bg-zinc-950/50 p-3 rounded-lg items-center"
//                 >
//                   <span className="text-zinc-400 text-sm">
//                     {serie.numero_serie}ª
//                   </span>
//                   <input
//                     type="number"
//                     disabled={treino.concluido}
//                     defaultValue={serie.peso}
//                     onBlur={(e) =>
//                       atualizarSerie(serie.id, { peso: Number(e.target.value) })
//                     }
//                     className="bg-zinc-800 disabled:opacity-50 w-full rounded-md py-1 px-2 text-sm text-white outline-none focus:border-green-500 border border-transparent"
//                   />

//                   <input
//                     type="number"
//                     disabled={treino.concluido}
//                     defaultValue={serie.repeticoes}
//                     onBlur={(e) =>
//                       atualizarSerie(serie.id, {
//                         repeticoes: Number(e.target.value),
//                       })
//                     }
//                     className="bg-zinc-800 disabled:opacity-50 w-full rounded-md py-1 px-2 text-sm text-white outline-none focus:border-green-500 border border-transparent"
//                   />
//                   <span className="text-[10px] text-zinc-500 font-medium pl-1">
//                     Anterior: {serie.peso}kg
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="flex w-full  px-6">
//         {!treino.concluido && (
//           <button
//             onClick={handleFinalizar}
//             className="bg-green-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-green-400 transition w-full"
//           >
//             Finalizar Treino
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }
