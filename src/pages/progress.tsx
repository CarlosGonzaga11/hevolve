import GraficoEvolucao from "../components/graph";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useTrain } from "../context/TrainContext";
import Loader from "../components/loader";
import HistoryTrain from "../components/historyTrain/historyTrain";
import Metric from "../components/cardMetric";
import { Flame, Scale } from "lucide-react";
import CardSemanal from "../components/cardSemanal";
import { useAuth } from "../context/AuthContext";
import AchievementList from "../components/ArchievementsList";

interface Exercicio {
  id: number;
  nome: string;
  grupo_muscular: string;
}

interface DadoGrafico {
  data: string;
  carga: number;
}

interface SerieExecutadaJoin {
  peso: number | string;
  repeticoes?: number | string;
  created_at?: string;
  itens_treino?: {
    exercicios?: Exercicio;
    exercicio_id?: number;
  };
}

export default function Progress() {
  const [dadosGrafico, setDadosGrafico] = useState<DadoGrafico[]>([]);
  const [loadingGeral, setLoadingGeral] = useState(false);
  const [loadingGrafico, setLoadingGrafico] = useState(false);

  const [meusExercicios, setMeusExercicios] = useState<Exercicio[]>([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos");
  const [quantidadeTreinoRealizado, setQuantidadeTreinoRealizado] =
    useState<number>(0);
  const [volumeTotal, setVolumeTotal] = useState<number>(0);

  const { user } = useAuth();
  const { idSelecionado, setIdSelecionado } = useTrain();

  const categorias = [
    "Todos",
    "Peito",
    "Costas",
    "Pernas",
    "Ombros",
    "Bíceps",
    "Tríceps",
    "Abdominais",
  ];

  const sanitizarTexto = (str: string) => str.replace(/<[^>]*>?/gm, "").trim();

  useEffect(() => {
    async function calcularVolume() {
      if (!user) return;
      try {
        const { data: series, error } = await supabase
          .from("series_executadas")
          .select("peso, repeticoes, treinos_realizados!inner(user_id)")
          .eq("treinos_realizados.user_id", user.id);

        if (error) throw error;

        if (series) {
          const tonelagemAcumulada = (series as SerieExecutadaJoin[]).reduce(
            (total, serie) => {
              const peso = Number(serie.peso) || 0;
              const reps = Number(serie.repeticoes) || 0;
              return total + peso * reps;
            },
            0,
          );

          setVolumeTotal(tonelagemAcumulada);
        }
      } catch (err) {
        console.error("Erro ao calcular o volume total:", err);
      }
    }

    calcularVolume();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    async function carregarDadosIniciais() {
      try {
        setLoadingGeral(true);

        const promiseExercicios = supabase
          .from("series_executadas")
          .select(
            `
            itens_treino (
              exercicios (
                id,
                nome,
                grupo_muscular
              )
            ),
            treinos_realizados!inner(user_id)
          `,
          )
          .eq("treinos_realizados.user_id", user.id);

        const promiseQuantidade = supabase
          .from("treinos_realizados")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id);

        const [resExercicios, resQuantidade] = await Promise.all([
          promiseExercicios,
          promiseQuantidade,
        ]);

        if (resExercicios.error) throw resExercicios.error;
        if (resQuantidade.error) throw resQuantidade.error;

        if (resExercicios.data) {
          const unicos: Exercicio[] = [];
          const idsVistos = new Set<number>();

          resExercicios.data.forEach((item: any) => {
            const ex = item.itens_treino?.exercicios;
            if (ex && !idsVistos.has(ex.id)) {
              idsVistos.add(ex.id);
              unicos.push({
                id: ex.id,
                nome: sanitizarTexto(ex.nome),
                grupo_muscular: sanitizarTexto(ex.grupo_muscular || ""),
              });
            }
          });

          setMeusExercicios(unicos);
        }

        if (resQuantidade.count !== null) {
          setQuantidadeTreinoRealizado(resQuantidade.count);
        }
      } catch (err: any) {
        console.error("Erro ao carregar dados iniciais:", err.message || err);
      } finally {
        setLoadingGeral(false);
      }
    }

    carregarDadosIniciais();
  }, [user]);

  useEffect(() => {
    async function carregarDadosGrafico() {
      if (!idSelecionado || !user) {
        setDadosGrafico([]);
        return;
      }

      try {
        setLoadingGrafico(true);
        setDadosGrafico([]);

        const exercicioPertenceAoUsuario = meusExercicios.some(
          (ex) => Number(ex.id) === Number(idSelecionado),
        );

        if (meusExercicios.length > 0 && !exercicioPertenceAoUsuario) {
          console.warn(
            "Tentativa de acesso não autorizada ao exercício ID:",
            idSelecionado,
          );
          return;
        }

        const { data, error } = await supabase
          .from("series_executadas")
          .select(
            `
            peso,
            created_at,
            itens_treino!inner(exercicio_id),
            treinos_realizados!inner(user_id)
          `,
          )
          .eq("itens_treino.exercicio_id", idSelecionado)
          .eq("treinos_realizados.user_id", user.id)
          .order("created_at", { ascending: true });

        if (error) throw error;

        const agrupados = (data || []).reduce(
          (acc: Record<string, number>, item: SerieExecutadaJoin) => {
            if (!item.created_at) return acc;

            const dataFormatada = new Date(item.created_at).toLocaleDateString(
              "pt-BR",
              {
                day: "2-digit",
                month: "2-digit",
              },
            );

            const pesoAtual = Number(item.peso) || 0;
            if (!acc[dataFormatada] || pesoAtual > acc[dataFormatada]) {
              acc[dataFormatada] = pesoAtual;
            }
            return acc;
          },
          {},
        );

        const formatados: DadoGrafico[] = Object.keys(agrupados).map(
          (dataStr) => ({
            data: dataStr,
            carga: agrupados[dataStr],
          }),
        );

        setDadosGrafico(formatados);
      } catch (err) {
        console.error("Erro ao carregar progresso:", err);
      } finally {
        setLoadingGrafico(false);
      }
    }

    carregarDadosGrafico();
  }, [idSelecionado, user, meusExercicios]);

  const exerciciosFiltrados = meusExercicios.filter((ex) => {
    if (categoriaFiltro === "Todos") return true;
    return ex.grupo_muscular === categoriaFiltro;
  });

  return (
    <div className="pb-10 bg-black min-h-screen text-white mt-6 sm:mt-0">
      <div className="mt-12 px-6">
        <h1 className="text-3xl font-bold text-[#22c55e]">Progresso</h1>
        <p className="mt-1 text-sm text-[#B3B3B3]">
          Sua página de análise de evolução de carga
        </p>
      </div>

      <div className="px-6 mt-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategoriaFiltro(cat);
                setIdSelecionado("");
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                categoriaFiltro === cat
                  ? "bg-[#22c55e] text-black"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="max-w-md">
          <select
            className="w-full bg-[#0f0f0f] border border-[#B3B3B3]/20 text-white focus:border-[#22c55e] focus:outline-none py-2 px-3 rounded-lg disabled:opacity-50"
            value={idSelecionado || ""}
            disabled={loadingGeral}
            onChange={(e) => {
              const val = e.target.value;
              setIdSelecionado(val ? Number(val) : "");
            }}
          >
            <option value="">
              Selecione um exercício de {categoriaFiltro}
            </option>
            {exerciciosFiltrados.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-8 bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 min-h-[300px] flex flex-col justify-center">
          {!idSelecionado ? (
            <p className="text-center text-zinc-500 italic">
              Escolha um exercício acima para ver seu progresso.
            </p>
          ) : loadingGrafico ? (
            <div className="flex justify-center items-center py-12">
              <Loader />
            </div>
          ) : dadosGrafico.length > 0 ? (
            <GraficoEvolucao key={idSelecionado} dados={dadosGrafico} />
          ) : (
            <p className="text-center text-zinc-500">
              Nenhum dado encontrado para este exercício.
            </p>
          )}
        </div>
      </div>
      <div className="px-6">
        <h3 className="mt-10 mb-4 text-3xl font-semibold uppercase">
          Métricas
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <Metric
            icon={<Flame />}
            p="Treinos Realizados"
            value={quantidadeTreinoRealizado || 0}
          />
          <Metric
            icon={<Scale />}
            p="Volume total"
            value={`${volumeTotal.toLocaleString("pt-BR")} KG`}
          />
        </div>

        {/*em breve secao */}
        <div className="mt-6 mb-12 relative overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm w-full h-full text-[#22c55e] font-bold text-3xl sm:text-4xl text-center items-center flex justify-center z-10 animate-pulse">
            EM BREVE...
          </div>
          <h3 className="text-2xl font-bold mb-4 pt-2">COMPARAÇÃO SEMANAL</h3>
          <div className="grid grid-cols-2 gap-2 opacity-30">
            <CardSemanal />
            <CardSemanal />
            <CardSemanal />
            <CardSemanal />
          </div>
        </div>

        <div>
          <AchievementList />
          <HistoryTrain />
        </div>
      </div>
    </div>
  );
}
