import { Link, useParams, useNavigate } from "react-router-dom";
import { useTrain } from "../context/TrainContext";
import { useEffect, useState } from "react";
import Loader from "./loader";
import { toast, Toaster } from "sonner";
import { processarConquistas } from "../logic/Archievements";
import { supabase } from "../supabase";

interface HistoricoItem {
  peso: number;
  repeticoes: number;
}

export default function TreinoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    listaTreinosSalvos,
    finalizarTreinoComHistorico,
    loading,
    setLoading,
  } = useTrain();

  const [valoresAtuais, setValoresAtuais] = useState<Record<string, any>>({});
  const [historicoAnterior, setHistoricoAnterior] = useState<
    Record<number, HistoricoItem>
  >({});

  const treino = listaTreinosSalvos.find((t) => Number(t.id) === Number(id));

  async function autoFill(itemId: number, quantidadeSeries: number) {
    try {
      const { data, error } = await supabase
        .from("series_executadas")
        .select("peso,repeticoes")
        .eq("item_treino_id", itemId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast.info("Nenhum histórico encontrado para este exercício.");
        return;
      }

      setValoresAtuais((prev) => {
        const novoEstado = { ...prev };

        for (let i = 1; i <= quantidadeSeries; i++) {
          const chave = `${itemId}-${i}`;
          novoEstado[chave] = {
            item_treino_id: itemId,
            numero_serie: i,
            peso: data.peso,
            repeticoes: data.repeticoes,
          };
        }

        return novoEstado;
      });

      toast.success("Cargas preenchidas com o treino anterior!");
    } catch (err) {
      console.error("Erro no autoFill:", err);
      toast.error("Erro ao buscar histórico");
    }
  }

  useEffect(() => {
    async function carregarHistoricoAnterior() {
      if (!treino || !treino.itens_treino) return;

      const historicoTemp: Record<number, HistoricoItem> = {};

      for (const item of treino.itens_treino) {
        const { data } = await supabase
          .from("series_executadas")
          .select("peso, repeticoes")
          .eq("item_treino_id", item.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data) {
          historicoTemp[item.id] = {
            peso: data.peso || 0,
            repeticoes: data.repeticoes || 0,
          };
        }
      }

      setHistoricoAnterior(historicoTemp);
    }

    carregarHistoricoAnterior();
  }, [treino]);

  useEffect(() => {
    const temDadosDigitados = Object.keys(valoresAtuais).length > 0;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (temDadosDigitados) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    if (temDadosDigitados) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [valoresAtuais]);

  if (!treino)
    return <div className="text-white p-6">Treino não encontrado</div>;

  const handleInputChange = (
    itemId: number,
    serieNum: number,
    campo: string,
    valor: string,
  ) => {
    const valorNumerico = Math.max(0, Number(valor) || 0);
    setValoresAtuais((prev) => ({
      ...prev,
      [`${itemId}-${serieNum}`]: {
        ...prev[`${itemId}-${serieNum}`],
        [campo]: valorNumerico,
        item_treino_id: itemId,
        numero_serie: serieNum,
      },
    }));
  };

  const handleFinalizar = async () => {
    const mapaMetaRepeticoes: Record<number, number> = {};
    const mapaNomes: Record<number, string> = {};

    treino.itens_treino.forEach((item: any) => {
      mapaNomes[item.id] = item.exercicios?.nome;
      mapaMetaRepeticoes[item.id] = Number(item.repeticoes) || 10;
    });

    const dadosParaHistorico = Object.values(valoresAtuais)
      .filter((serie: any) => serie.peso > 0)
      .map((serie: any) => {
        const metaReps = mapaMetaRepeticoes[serie.item_treino_id] || 10;
        return {
          ...serie,
          repeticoes: serie.repeticoes > 0 ? serie.repeticoes : metaReps,
        };
      });

    if (dadosParaHistorico.length === 0) {
      toast.error("Preencha pelo menos a carga (peso) de uma série!");
      return;
    }

    try {
      setLoading(true);

      await finalizarTreinoComHistorico(treino.id, dadosParaHistorico);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { count } = await supabase
        .from("treinos_realizados")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user?.id);

      const novas = await processarConquistas(
        count || 0,
        dadosParaHistorico,
        mapaNomes,
      );

      if (novas.length > 0) {
        novas.forEach((msg) => {
          if (msg.includes("menos")) {
            toast.warning(msg, {
              description: "Mantenha o foco na progressão!",
              duration: 3500,
            });
          } else {
            toast.success(msg, {
              description: "Você superou seus limites!",
              duration: 3500,
            });
          }
        });
      }

      toast.success("Treino Finalizado", { position: "bottom-center" });
      setValoresAtuais({});
      navigate("/dashboard/treino");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao finalizar treino");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <Toaster richColors />
      <div className="mb-8">
        <Link
          to="/dashboard/treino"
          className="text-sm text-zinc-400 hover:text-white"
        >
          ← Voltar
        </Link>
        <h1 className="text-4xl font-bold mt-2">{treino.nome}</h1>
      </div>

      <div className="grid gap-6 mb-20">
        {treino.itens_treino.map((item: any) => {
          const ultimoRegistro = historicoAnterior[item.id];

          return (
            <div
              key={item.id}
              className="bg-zinc-900 border border-white/10 rounded-2xl p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h3 className="text-xl font-bold text-green-400">
                  {item.exercicios?.nome || "Exercício sem nome"}
                </h3>

                <div className="flex items-center gap-2 flex-wrap">
                  {ultimoRegistro && ultimoRegistro.peso > 0 ? (
                    <>
                      <span className="text-xs text-zinc-400 bg-zinc-800/80 border border-white/5 px-2.5 py-1.5 rounded-md">
                        Último:{" "}
                        <strong className="text-white">
                          {ultimoRegistro.peso} kg
                        </strong>{" "}
                        ×{" "}
                        <strong className="text-white">
                          {ultimoRegistro.repeticoes} reps
                        </strong>
                      </span>

                      <button
                        type="button"
                        onClick={() => autoFill(item.id, item.series)}
                        className="text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-green-400 hover:text-green-300 border border-green-500/20 px-3 py-1.5 rounded-md transition flex items-center gap-1 cursor-pointer"
                      >
                         Repetir carga
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-zinc-500 bg-zinc-800/40 px-2.5 py-1 rounded-md">
                      Sem registro anterior
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-[2rem_1fr_1fr] gap-2 px-2 text-[11px] font-bold text-zinc-500 uppercase">
                  <span>Set</span>
                  <span>Peso (kg)</span>
                  <span>Reps</span>
                </div>

                {Array.from({ length: item.series || 0 }).map((_, i) => {
                  const numeroSerie = i + 1;
                  const valorSerieAtual =
                    valoresAtuais[`${item.id}-${numeroSerie}`];

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
                        value={valorSerieAtual?.peso ?? ""}
                        placeholder={
                          ultimoRegistro ? `${ultimoRegistro.peso}` : "0"
                        }
                        onChange={(e) =>
                          handleInputChange(
                            item.id,
                            numeroSerie,
                            "peso",
                            e.target.value,
                          )
                        }
                        className="bg-zinc-800 rounded-md py-2 px-3 text-sm outline-none focus:border-green-500 border border-transparent text-white"
                      />

                      <input
                        type="number"
                        value={valorSerieAtual?.repeticoes ?? ""}
                        placeholder={
                          item.repeticoes ? `${item.repeticoes}` : "0"
                        }
                        onChange={(e) =>
                          handleInputChange(
                            item.id,
                            numeroSerie,
                            "repeticoes",
                            e.target.value,
                          )
                        }
                        className="bg-zinc-800 rounded-md py-2 px-3 text-sm outline-none focus:border-green-500 border border-transparent text-white"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bottom-6 w-full px-6">
        <button
          onClick={handleFinalizar}
          disabled={loading}
          className="cursor-pointer bg-green-500 text-black font-extrabold 
          py-4 rounded-xl hover:bg-green-400 transition w-full shadow-lg shadow-green-500/20"
        >
          {loading ? <Loader size="sm" /> : "FINALIZAR E SALVAR CARGAS"}
        </button>
      </div>
    </div>
  );
}