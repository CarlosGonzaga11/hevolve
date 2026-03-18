import GraficoEvolucao from "../components/graph";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useTrain } from "../context/TrainContext";

const exercicios = [
  { id: 1, nome: "Supino Reto" },
  { id: 2, nome: "Agachamento" },
  { id: 3, nome: "Levantamento Terra" },
  { id: 4, nome: "Desenvolvimento Militar" },
];

export default function Progress() {
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [loading, setLoading] = useState(true);
  const { idSelecionado, setIdSelecionado } = useTrain();

  console.log();
  async function carregarDados() {
    if (!idSelecionado) return;
    try {
      setLoading(true);

      // 1. FILTRAGEM NO BANCO (O passo que estava faltando)
      const { data, error } = await supabase
        .from("series_executadas")
        .select(
          `
          peso,
          created_at,
          itens_treino!inner(exercicio_id)
        `
        )
        .eq("itens_treino.exercicio_id", idSelecionado)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const agrupados = data.reduce((acc, item) => {
        const dataFormatada = new Date(item.created_at).toLocaleDateString(
          "pt-BR",
          {
            day: "2-digit",
            month: "2-digit",
          }
        );

        // Se não tem nada nesse dia ou o peso novo é maior, atualiza
        if (!acc[dataFormatada] || item.peso > acc[dataFormatada]) {
          acc[dataFormatada] = item.peso;
        }
        return acc;
      }, {});

      const formatados = Object.keys(agrupados).map((dataStr) => ({
        data: dataStr,
        carga: agrupados[dataStr],
      }));

      if (formatados.length === 1) {
      }
      console.log("datos formatados no reduce", formatados);
      setDadosGrafico(formatados);
    } catch (err) {
      console.error("Erro ao carregar progresso:", err);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    carregarDados();
  }, [idSelecionado]);
  return (
    <div>
      <div className="mt-12 px-6">
        <h1 className="text-3xl font-bold ">Progresso</h1>
        <p className="mt-1 text-sm text-[#B3B3B3]">
          Sua pagina de progresso de carga
        </p>
      </div>
      <div>
        {/* <div className="px-6 mt-8 grid sm:grid-cols-4 gap-4  grid-cols-1">
          <Metric
            icon={<FireExtinguisher />}
            value="teste"
            p="20% do mes anterior"
          />
          <Metric
            icon={<FireExtinguisher />}
            value="teste"
            p="20% do mes anterior"
          />
          <Metric
            icon={<FireExtinguisher />}
            value="teste"
            p="20% do mes anterior"
          />
          <Metric
            icon={<FireExtinguisher />}
            value="teste"
            p="20% do mes anterior"
          />
        </div> */}
        <div className="px-6 mt-6">
          <select
            className="border px-2 border-[#B3B3B3] focus:border-[#22c55e] focus:outline-none  py-1 rounded"
            value={idSelecionado}
            onChange={(e) => setIdSelecionado(Number(e.target.value))}
          >
            <option value="">Selecione um exercício</option>
            {exercicios.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nome}
              </option>
            ))}
          </select>
          {loading ? (
            <div className="h-[200px] flex items-center justify-center text-zinc-500">
              Carregando histórico...
            </div>
          ) : (
            <div className="mt-2 ">
              <GraficoEvolucao key={idSelecionado} dados={dadosGrafico} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
