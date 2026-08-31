import React, { useState } from "react";
import { useTrain } from "../context/TrainContext";
import CardFichaExercicios from "../components/cardFichaExercicios";
import Loader from "../components/loader";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

export interface ExercicioItem {
  id: number | null;
  nome: string;
  grupo_muscular: string;
  series: number;
  repeticoes: number;
}

export interface DBExercicio {
  id: number;
  nome: string;
  grupo_muscular: string;
}

// Limites recomendados para evitar estouro no banco/UI
const MAX_EXERCICIOS_POR_FICHA = 25;
const MAX_CHAR_NOME_TREINO = 50;
const MAX_CHAR_NOME_EXERCICIO = 60;

export default function App() {
  const [exerciciosTreino, setExerciciosTreino] = useState<ExercicioItem[]>([]);
  const [nomeExercicioInput, setNomeExercicioInput] = useState<string>("");
  const [nomeTreino, setNomeTreino] = useState<string>("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>("Todos");
  const [loaderButton, setLoaderButton] = useState<boolean>(false);

  const categorias: string[] = [
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
    listaExerciciosDB = [],
  } = useTrain() as {
    salvarTreino: (nome: string, exercicios: ExercicioItem[]) => Promise<void>;
    setSeries: (val: string) => void;
    setRepeticoes: (val: string) => void;
    series: string | number;
    repeticoes: string | number;
    listaExerciciosDB: DBExercicio[];
  };

  const exerciciosFiltrados = listaExerciciosDB.filter((ex) => {
    const atendeCategoria =
      categoriaSelecionada === "Todos" || ex.grupo_muscular === categoriaSelecionada;
    const atendeTexto = ex.nome
      .toLowerCase()
      .includes(nomeExercicioInput.toLowerCase());

    return atendeCategoria && atendeTexto;
  });

  function handleAddExercicio(): void {
    const nomeFormatado = nomeExercicioInput.trim();

    // 1. Validação de limite de itens na ficha
    if (exerciciosTreino.length >= MAX_EXERCICIOS_POR_FICHA) {
      toast.warning(`Limite máximo de ${MAX_EXERCICIOS_POR_FICHA} exercícios por ficha atingido.`);
      return;
    }

    // 2. Validação de texto do exercício
    if (!nomeFormatado) {
      toast.error("Escreva ou selecione um exercício primeiro");
      return;
    }

    if (nomeFormatado.length > MAX_CHAR_NOME_EXERCICIO) {
      toast.error(`O nome do exercício deve ter no máximo ${MAX_CHAR_NOME_EXERCICIO} caracteres.`);
      return;
    }

    // 3. Validação numérica de Séries e Repetições
    const numSeries = Number(series);
    const numReps = Number(repeticoes);

    if (
      isNaN(numSeries) ||
      !Number.isInteger(numSeries) ||
      numSeries <= 0 ||
      numSeries > 99
    ) {
      toast.error("Informe um número de séries válido (entre 1 e 99)");
      return;
    }

    if (
      isNaN(numReps) ||
      !Number.isInteger(numReps) ||
      numReps <= 0 ||
      numReps > 999
    ) {
      toast.error("Informe um número de repetições válido (entre 1 e 999)");
      return;
    }

    // 4. Checagem de duplicidade
    const jaAdicionado = exerciciosTreino.some(
      (ex) => ex.nome.toLowerCase() === nomeFormatado.toLowerCase()
    );

    if (jaAdicionado) {
      toast.warning("Este exercício já foi adicionado a esta ficha");
      return;
    }

    const exercicioExistente = listaExerciciosDB.find(
      (ex) => ex.nome.toLowerCase() === nomeFormatado.toLowerCase()
    );

    const grupoMuscular =
      categoriaSelecionada === "Todos"
        ? exercicioExistente?.grupo_muscular || "Geral"
        : categoriaSelecionada;

    const novoItem: ExercicioItem = {
      id: exercicioExistente ? exercicioExistente.id : null,
      nome: nomeFormatado,
      grupo_muscular: grupoMuscular,
      series: numSeries,
      repeticoes: numReps,
    };

    setExerciciosTreino((prev) => [...prev, novoItem]);
    setNomeExercicioInput("");
    toast.success("Exercício adicionado à ficha");
  }

  function handleRemoveExercicio(indexParaRemover: number): void {
    setExerciciosTreino((prev) =>
      prev.filter((_, index) => index !== indexParaRemover)
    );
    toast.info("Exercício removido");
  }

  async function handleSaveFicha(): Promise<void> {
    const nomeTreinoLimpo = nomeTreino.trim();

    if (!nomeTreinoLimpo) {
      toast.warning("Dê um nome ao treino antes de salvar");
      return;
    }

    if (nomeTreinoLimpo.length > MAX_CHAR_NOME_TREINO) {
      toast.warning(`O nome do treino não pode ter mais de ${MAX_CHAR_NOME_TREINO} caracteres.`);
      return;
    }

    if (exerciciosTreino.length === 0) {
      toast.warning("Adicione pelo menos um exercício à ficha");
      return;
    }

    try {
      setLoaderButton(true);
      await salvarTreino(nomeTreinoLimpo, exerciciosTreino);
      toast.success("Treino salvo com sucesso!", { position: "bottom-center" });

      setExerciciosTreino([]);
      setNomeTreino("");
      setNomeExercicioInput("");
      setSeries("");
      setRepeticoes("");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar ficha de treino");
    } finally {
      setLoaderButton(false);
    }
  }

  return (
    <div className="text-white pb-10 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="mt-12 sm:mt-10 mb-6">
        <h1 className="sm:mt-0 mt-16 text-3xl uppercase font-extrabold tracking-tight text-[#22c55e]">
          Hevolve
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          Crie e gerencie suas fichas de treino para acompanhamento de cargas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-[#0f0f0f] border border-white/10 rounded-xl p-6 space-y-5">
          <span className="text-xl font-bold text-[#22c55e] block">
            Nova Ficha de Treino
          </span>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase text-zinc-400">
              Nome do Treino
            </label>
            <input
              value={nomeTreino}
              maxLength={MAX_CHAR_NOME_TREINO}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNomeTreino(e.target.value)
              }
              placeholder="Ex: Treino A - Peito e Tríceps"
              className="bg-zinc-900 text-white border border-white/10 focus:border-[#22c55e] focus:outline-none px-3 py-2.5 rounded-lg text-sm transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase text-zinc-400">
              Filtrar Exercícios por Categoria
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categorias.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoriaSelecionada(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                    categoriaSelecionada === cat
                      ? "bg-[#22c55e] text-black"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase text-zinc-400">
              Exercício
            </label>
            <div className="flex gap-2 w-full">
              <input
                list="opcoes-exercicios"
                autoComplete="off"
                maxLength={MAX_CHAR_NOME_EXERCICIO}
                value={nomeExercicioInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNomeExercicioInput(e.target.value)
                }
                placeholder="Digite ou selecione da lista..."
                className="bg-zinc-900 flex-1 text-white border border-white/10 focus:border-[#22c55e] focus:outline-none px-3 py-2.5 rounded-lg text-sm transition"
              />

              <datalist id="opcoes-exercicios">
                {exerciciosFiltrados.map((item) => (
                  <option key={item.id} value={item.nome}>
                    {item.grupo_muscular}
                  </option>
                ))}
              </datalist>

              <button
                type="button"
                className="font-bold bg-[#22c55e] text-black px-4 py-2.5 rounded-lg hover:bg-green-400 transition cursor-pointer flex items-center justify-center shrink-0"
                onClick={handleAddExercicio}
                title="Adicionar exercício"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase text-[#22c55e]">
                Séries
              </label>
              <input
                type="number"
                min="1"
                max="99"
                placeholder="Ex: 4"
                className="bg-zinc-900 text-white border border-white/10 focus:border-[#22c55e] focus:outline-none px-3 py-2 rounded-lg text-sm"
                value={series}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSeries(e.target.value)
                }
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase text-[#22c55e]">
                Repetições
              </label>
              <input
                type="number"
                min="1"
                max="999"
                placeholder="Ex: 12"
                className="bg-zinc-900 text-white border border-white/10 focus:border-[#22c55e] focus:outline-none px-3 py-2 rounded-lg text-sm"
                value={repeticoes}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setRepeticoes(e.target.value)
                }
              />
            </div>
          </div>

          <button
            disabled={loaderButton}
            className="w-full font-bold py-3 bg-[#22c55e] text-black rounded-lg mt-2 hover:bg-green-400 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            onClick={handleSaveFicha}
          >
            {loaderButton ? (
              <Loader size="sm" />
            ) : (
              <span>Salvar Ficha de Treino</span>
            )}
          </button>
        </div>

        <div className="lg:col-span-5 bg-[#0f0f0f] border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-base font-bold text-white">
              Exercícios na Ficha
            </p>
            <span className="text-xs bg-zinc-800 text-zinc-400 px-2.5 py-1 rounded-full font-mono">
              {exerciciosTreino.length}{" "}
              {exerciciosTreino.length === 1 ? "item" : "itens"}
            </span>
          </div>

          {exerciciosTreino.length === 0 ? (
            <div className="text-zinc-500 text-sm italic py-8 text-center border border-dashed border-zinc-800 rounded-lg">
              Nenhum exercício adicionado ainda.
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-h-125 overflow-y-auto pr-1">
              {exerciciosTreino.map((ex, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-zinc-900/80 border border-white/5 p-3 rounded-lg group hover:border-white/20 transition"
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <CardFichaExercicios
                      nome={ex.nome}
                      series={ex.series}
                      repeticoes={ex.repeticoes}
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveExercicio(index)}
                    className="text-zinc-500 hover:text-red-400 p-2 transition cursor-pointer shrink-0"
                    title="Remover da lista"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}