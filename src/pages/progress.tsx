import GraficoEvolucao from "../components/graph";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useTrain } from "../context/TrainContext";

export default function Progress() {
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [loading, setLoading] = useState(false); // Começa como false para não bugar o início
  const [meusExercicios, setMeusExercicios] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos"); // Faltava isso!

  const { idSelecionado, setIdSelecionado } = useTrain();

  const categorias = ["Todos", "Peito", "Costas", "Pernas", "Ombros", "Bíceps", "Tríceps", "Abdominais"];

  // 1. Busca os exercícios que já possuem histórico no banco
  useEffect(() => {
    async function buscarMeusExercicios() {
      const { data, error } = await supabase
        .from("series_executadas")
        .select(`
          itens_treino (
            exercicios (
              id,
              nome,
              grupo_muscular
            )
          )
        `);

      if (error) return console.error("Erro ao buscar exercícios realizados:", error);

      const unicos = [];
      const idsVistos = new Set();

      data.forEach(item => {
        const ex = item.itens_treino?.exercicios;
        if (ex && !idsVistos.has(ex.id)) {
          idsVistos.add(ex.id);
          unicos.push(ex);
        }
      });

      setMeusExercicios(unicos);
    }

    buscarMeusExercicios();
  }, []);

  // 2. Carrega os dados para o gráfico
  async function carregarDados() {
    if (!idSelecionado) {
      setDadosGrafico([]);
      return;
    }
    
    try {
      setLoading(true);
      setDadosGrafico([]); // Limpa o gráfico anterior

      const { data, error } = await supabase
        .from("series_executadas")
        .select(`
          peso,
          created_at,
          itens_treino!inner(exercicio_id)
        `)
        .eq("itens_treino.exercicio_id", idSelecionado)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const agrupados = data.reduce((acc, item) => {
        const dataFormatada = new Date(item.created_at).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        });

        if (!acc[dataFormatada] || item.peso > acc[dataFormatada]) {
          acc[dataFormatada] = item.peso;
        }
        return acc;
      }, {});

      const formatados = Object.keys(agrupados).map((dataStr) => ({
        data: dataStr,
        carga: agrupados[dataStr],
      }));

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

  // Filtra a lista baseada no botão de categoria
  const exerciciosFiltrados = meusExercicios.filter((ex) => {
    if (categoriaFiltro === "Todos") return true;
    return ex.grupo_muscular === categoriaFiltro;
  });

  return (
    <div className="pb-10 bg-black min-h-screen text-white">
      <div className="mt-12 px-6">
        <h1 className="text-3xl font-bold text-[#22c55e]">Progresso</h1>
        <p className="mt-1 text-sm text-[#B3B3B3]">
          Sua página de análise de evolução de carga
        </p>
      </div>

      <div className="px-6 mt-8">
        {/* Filtros de Categoria */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategoriaFiltro(cat);
                setIdSelecionado(""); // Limpa seleção ao trocar de grupo para evitar confusão
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
            className="w-full bg-[#0f0f0f] border border-[#B3B3B3]/20 text-white focus:border-[#22c55e] focus:outline-none py-2 px-3 rounded-lg"
            value={idSelecionado || ""}
            onChange={(e) => setIdSelecionado(Number(e.target.value))}
          >
            <option value="">Selecione um exercício de {categoriaFiltro}</option>
            {/* AGORA USANDO A LISTA FILTRADA CORRETAMENTE */}
            {exerciciosFiltrados.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-8 bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 min-h-[300px] flex flex-col justify-center">
          {!idSelecionado ? (
            <p className="text-center text-zinc-500 italic">Escolha um exercício acima para ver seu progresso.</p>
          ) : loading ? (
            <p className="text-center text-[#22c55e] animate-pulse">Carregando histórico...</p>
          ) : dadosGrafico.length > 0 ? (
            <GraficoEvolucao key={idSelecionado} dados={dadosGrafico} />
          ) : (
            <p className="text-center text-zinc-500">Nenhum dado encontrado para este exercício.</p>
          )}
        </div>
      </div>
    </div>
  );
}