import { useState } from "react";
import { useTrain } from "../context/TrainContext";
import CardFichaExercicios from "../components/cardFichaExercicios";
import Loader from "../components/loader";
import { toast } from "sonner";

export default function App() {
  const [exerciciosTreino, setExerciciosTreino] = useState([]);
  const [nomeExercicioInput, setNomeExercicioInput] = useState(""); // Aceita texto digitado ou selecionado
  const [nomeTreino, setNomeTreino] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");
  const [loaderButton, setLoaderButton] = useState(false);

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

  const {
    salvarTreino,
    setSeries,
    setRepeticoes,
    series,
    repeticoes,
    listaExerciciosDB,
  } = useTrain();

  const exerciciosFiltrados = listaExerciciosDB.filter((ex) => {
    if (categoriaSelecionada === "Todos") return true;
    return ex.grupo_muscular === categoriaSelecionada;
  });

  function handleAddExercicio() {
    const nomeFormatado = nomeExercicioInput.trim();
    if (!nomeFormatado)
      return toast.error("Escreva ou selecione um exercício primeiro");

    const exercicioExistente = listaExerciciosDB.find(
      (ex) => ex.nome.toLowerCase() === nomeFormatado.toLowerCase(),
    );
    const grupoMuscular =
      categoriaSelecionada === "Todos" ? "Geral" : categoriaSelecionada;
    const novoItem = {
      id: exercicioExistente ? exercicioExistente.id : null,
      nome: nomeFormatado,
      grupo_muscular: grupoMuscular,
      series: Number(series),
      repeticoes: Number(repeticoes),
    };

    setExerciciosTreino([...exerciciosTreino, novoItem]);
    setNomeExercicioInput("");
    toast.success("Exercício adicionado");
  }

  async function handleSaveFicha() {
    if (!nomeTreino || exerciciosTreino.length === 0)
      return toast.warning(
        "Dê um nome ao treino e adicione pelo menos um exercício",
      );

    try {
      setLoaderButton(true);
      await salvarTreino(nomeTreino, exerciciosTreino);
      toast.success("Treino salvo com sucesso!", { position: "bottom-center" });

      setExerciciosTreino([]);
      setNomeTreino("");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar ficha");
    } finally {
      setLoaderButton(false);
    }
  }

  return (
    <div className="text-white pb-10 ">
      <div className="mt-16 px-6 sm:mt-12">
        <h1 className=" text-3xl uppercase font-bold tracking-tighter text-[#22c55e]">
          Hevolve
        </h1>
        <p className="text-zinc-500">
          Seu site para análise de desenvolvimento de carga
        </p>
      </div>

      <div className="flex flex-col md:flex md:flex-row w-full">
        <div className="w-full">
          <div className="flex flex-col px-6 mt-6 space-y-4 mx-6 bg-[#0f0f0f] border border-white/10 rounded-xl p-6">
            <span className="text-2xl font-bold text-[#22c55e]">
              Crie sua ficha
            </span>

            <input
              value={nomeTreino}
              onChange={(e) => setNomeTreino(e.target.value)}
              placeholder="Nome do treino (Ex: Treino A - Peito)"
              className="bg-zinc-900 text-white border border-white/10 focus:border-[#22c55e] focus:outline-none px-3 py-2 rounded"
            />

            {/* Categorias de Filtro */}
            <div className="flex flex-wrap gap-2 mb-4">
              {categorias.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategoriaSelecionada(cat);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                    categoriaSelecionada === cat
                      ? "bg-[#22c55e] text-black"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Input com Datalist (Texto Livre + Autocomplete) */}
            <div className="flex gap-2 w-full">
              <input
                list="opcoes-exercicios"
                value={nomeExercicioInput}
                onChange={(e) => setNomeExercicioInput(e.target.value)}
                placeholder="Digite ou selecione um exercício..."
                className="bg-zinc-900 w-full text-gray-300 border border-white/10 focus:border-[#22c55e] focus:outline-none px-3 py-2 rounded"
              />

              <datalist id="opcoes-exercicios">
                {exerciciosFiltrados.map((item) => (
                  <option key={item.id} value={item.nome}>
                    {item.grupo_muscular}
                  </option>
                ))}
              </datalist>

              <button
                className="font-bold bg-[#22c55e] text-black px-4 py-2 rounded hover:bg-green-400 transition cursor-pointer"
                onClick={handleAddExercicio}
              >
                +
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-[#22c55e] font-bold text-xs uppercase">
                  Séries
                </label>
                <input
                  type="number"
                  className="mt-1 bg-zinc-900 border border-white/10 focus:border-[#22c55e] focus:outline-none px-3 py-2 rounded"
                  value={series}
                  onChange={(e) => setSeries(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-[#22c55e] font-bold text-xs uppercase">
                  Repetições
                </label>
                <input
                  type="number"
                  className="mt-1 bg-zinc-900 border border-white/10 focus:border-[#22c55e] focus:outline-none px-3 py-2 rounded"
                  value={repeticoes}
                  onChange={(e) => setRepeticoes(e.target.value)}
                />
              </div>
            </div>

            <button
              disabled={loaderButton}
              className="w-full font-bold py-3 bg-[#22c55e] text-black rounded-lg mt-4 hover:bg-green-400 transition cursor-pointer"
              onClick={handleSaveFicha}
            >
              {loaderButton ? (
                <Loader size="sm" />
              ) : (
                <p className="hover:text-black/80">Salvar Treino</p>
              )}
            </button>
          </div>
        </div>

        {/* Lista Lateral */}
        <div className="max-w-xl mx-6 mt-8 bg-[#0f0f0f] border border-white/10 rounded-xl p-6">
          <p className="text-lg font-semibold text-white mb-4">
            Exercícios na ficha atual:
          </p>
          {exerciciosTreino.length === 0 ? (
            <div className="text-zinc-500 text-sm italic">
              Nenhum exercício adicionado ainda.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {exerciciosTreino.map((ex, index) => (
                <CardFichaExercicios
                  key={index}
                  nome={ex.nome}
                  series={ex.series}
                  repeticoes={ex.repeticoes}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
