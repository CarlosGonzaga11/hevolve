import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "../supabase";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

export type Serie = {
  id: number;
  items_treino_id: number;
  numero_serie: number;
  peso: number;
  repeticoes: number;
  treino_id: number;
};

export type Exercicios = {
  id: number;
  nome: string;
  grupo_muscular: string;
  user_id: string | null;
};

export type ItemTreino = {
  id: number;
  exercicio_id: number;
  series: number;
  repeticoes: number;
  exercicios: {
    nome: string;
  } | null;
};

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

export type Ficha = {
  id: number;
  nome: string;
  concluido: boolean;
  deletado: boolean;
  user_id: string;
  itens_treino?: ItemTreino[];
};

export type SerieExecutadaInput = {
  item_treino_id: number;
  numero_serie: number;
  peso: number;
  repeticoes: number;
};

export type ExercicioInput = {
  id?: number | null;
  nome: string;
  grupo_muscular?: string;
  series?: number;
  repeticoes?: number;
};

export type ProgressoExercicio = {
  data: string;
  carga: number;
};

export type UltimaCarga = {
  peso: number;
  repeticoes: number;
  created_at: string;
};

export interface TrainContextType {
  listaTreinosSalvos: Ficha[];
  treinosDeletados: Ficha[];
  listaExerciciosDB: Exercicios[];
  series: number | string;
  setSeries: React.Dispatch<React.SetStateAction<number | string>>;
  repeticoes: number | string;
  setRepeticoes: React.Dispatch<React.SetStateAction<number | string>>;
  idSelecionado: number | null;
  setIdSelecionado: React.Dispatch<React.SetStateAction<number | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setTreinosDeletados: React.Dispatch<React.SetStateAction<Ficha[]>>;

  buscarTreinos: () => Promise<void>;
  deleteCardTreino: (id: number) => Promise<void>;
  salvarTreino: (nome: string, itens: ExercicioInput[]) => Promise<void>;
  atualizarSerie: (
    serieId: number,
    novosDados: Partial<Serie>
  ) => Promise<void>;
  finalizarTreino: (id: number) => Promise<void>;
  restaurarTreino: (id: number) => Promise<void>;
  excluirDefinitivamente: (id: number) => Promise<void>;
  buscarTreinosDeletados: () => Promise<void>;
  buscarProgressoExercicio: (
    exercicioId: number
  ) => Promise<ProgressoExercicio[]>;
  finalizarTreinoComHistorico: (
    fichaId: number,
    dadosDasSeries: SerieExecutadaInput[]
  ) => Promise<void>;
  buscarUltimaCarga: (itemTreinoId: number) => Promise<UltimaCarga | null>;
  buscarDadosParaExecucao: (fichaId: number) => Promise<any>;
}

type TrainContextProps = {
  children: ReactNode;
};

const TrainContext = createContext<TrainContextType | null>(null);

export function TrainProvider({ children }: TrainContextProps) {
  const { user } = useAuth();
  const [listaTreinosSalvos, setListaTreinosSalvos] = useState<Ficha[]>([]);
  const [series, setSeries] = useState<number | string>(3);
  const [repeticoes, setRepeticoes] = useState<number | string>(12);
  const [idSelecionado, setIdSelecionado] = useState<number | null>(null);
  const [treinosDeletados, setTreinosDeletados] = useState<Ficha[]>([]);
  const [listaExerciciosDB, setListaExerciciosDB] = useState<Exercicios[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      buscarTodosExercicios();
      buscarTreinos();
    } else {
      setListaTreinosSalvos([]);
      setListaExerciciosDB([]);
      setTreinosDeletados([]);
    }
  }, [user]);

  function sanitizarTexto(texto: string): string {
    if (typeof texto !== "string") return "";
    return texto.replace(/<[^>]*>?/gm, "").trim();
  }

  async function buscarTodosExercicios(): Promise<void> {
    if (!user) return;
    const { data, error } = await supabase
      .from("exercicios")
      .select("*")
      .or(`user_id.is.null,user_id.eq.${user.id}`)
      .order("nome", { ascending: true });

    if (error) console.error("Erro ao carregar biblioteca:", error);
    else setListaExerciciosDB((data as Exercicios[]) || []);
  }

  async function buscarProgressoExercicio(
    exercicioId: number
  ): Promise<ProgressoExercicio[]> {
    if (!user) return [];

    const { data, error } = await supabase
      .from("series_executadas")
      .select("peso, criada_em")
      .eq("exercicio_id", exercicioId)
      .eq("user_id", user.id)
      .order("criada_em", { ascending: true });

    if (error || !data) return [];
    return data.map((set) => ({
      data: new Date(set.criada_em).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }),
      carga: set.peso,
    }));
  }

  async function buscarTreinos(): Promise<void> {
    if (!user) return;
    const { data, error } = await supabase
      .from("fichas")
      .select(
        `
        id, 
        nome,
        concluido,
        deletado,
        user_id,
        itens_treino (
          id,
          exercicio_id,
          series,
          repeticoes,
          exercicios (
            nome
          )
        )
      `
      )
      .eq("user_id", user.id)
      .eq("deletado", false);

    if (error) console.error("Erro ao buscar:", error);
    else setListaTreinosSalvos((data as unknown as Ficha[]) || []);
  }

  async function buscarDadosParaExecucao(fichaId: number): Promise<any> {
    if (!user) return;

    const { data, error } = await supabase
      .from("itens_treino")
      .select(
        `
        id,
        exercicio_id,
        series_executadas (
          peso,
          repeticoes,
          numero_serie,
          criada_em
        )
      `
      )
      .eq("ficha_id", fichaId)
      .eq("user_id", user.id);

    if (error) console.error("Erro ao buscar dados para execução:", error);
    return data;
  }

  async function buscarTreinosDeletados(): Promise<void> {
    if (!user) return;
    const { data, error } = await supabase
      .from("fichas")
      .select("*")
      .eq("user_id", user.id)
      .eq("deletado", true);

    if (error) console.error("Erro ao buscar lixeira:", error);
    else setTreinosDeletados((data as Ficha[]) || []);
  }

  async function atualizarSerie(
    serieId: number,
    novosDados: Partial<Serie>
  ): Promise<void> {
    if (!user) return;

    const { error } = await supabase
      .from("series_executadas")
      .update(novosDados)
      .eq("id", serieId)
      .eq("user_id", user.id);

    if (error) console.error("Erro ao atualizar série:", error);
  }

  async function salvarTreino(
    nome: string,
    itens: ExercicioInput[]
  ): Promise<void> {
    if (!user) {
      toast.error("Você precisa estar logado para salvar um treino.");
      return;
    }

    const nomeFichaSanitizado = sanitizarTexto(nome);
    if (!nomeFichaSanitizado) {
      toast.error("Insira um nome válido para o treino.");
      return;
    }

    const defaultSeries = Number(series) || 3;
    const defaultReps = Number(repeticoes) || 12;

    const itensFormatados = await Promise.all(
      itens.map(async (ex) => {
        let exercicioId = ex.id;
        const nomeExercicioSanitizado = sanitizarTexto(ex.nome);

        if (!exercicioId) {
          const { data: existente } = await supabase
            .from("exercicios")
            .select("id")
            .ilike("nome", nomeExercicioSanitizado)
            .or(`user_id.is.null,user_id.eq.${user.id}`)
            .maybeSingle();

          if (existente) {
            exercicioId = existente.id;
          } else {
            const { data: novoExercicio, error: errEx } = await supabase
              .from("exercicios")
              .insert({
                nome: nomeExercicioSanitizado,
                grupo_muscular:
                  sanitizarTexto(ex.grupo_muscular || "") || "Geral",
                user_id: user.id,
              })
              .select("id")
              .single();

            if (errEx) throw errEx;
            exercicioId = novoExercicio.id;
          }
        }

        return {
          exercicio_id: exercicioId,
          series: Number(ex.series) || defaultSeries,
          repeticoes: Number(ex.repeticoes) || defaultReps,
        };
      })
    );

    const { data: ficha, error: errFicha } = await supabase
      .from("fichas")
      .insert([{ nome: nomeFichaSanitizado, user_id: user.id }])
      .select()
      .single();

    if (errFicha) throw errFicha;

    const itensParaSalvar = itensFormatados.map((item) => ({
      ficha_id: ficha.id,
      exercicio_id: item.exercicio_id,
      user_id: user.id,
      series: item.series,
      repeticoes: item.repeticoes,
    }));

    const { error: errItens } = await supabase
      .from("itens_treino")
      .insert(itensParaSalvar);

    if (errItens) throw errItens;

    await buscarTreinos();
  }

  async function finalizarTreinoComHistorico(
    fichaId: number,
    dadosDasSeries: SerieExecutadaInput[]
  ): Promise<void> {
    if (!user) return;
    try {
      const { data: fichaPertenceUser, error: errValida } = await supabase
        .from("fichas")
        .select("id")
        .eq("id", fichaId)
        .eq("user_id", user.id)
        .single();

      if (errValida || !fichaPertenceUser) {
        toast.error("Operação não autorizada.");
        return;
      }

      const { data: treino, error: errTreino } = await supabase
        .from("treinos_realizados")
        .insert([
          {
            ficha_id: fichaId,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (errTreino) throw errTreino;

      const historico = dadosDasSeries.map((s) => ({
        treino_id: treino.id,
        item_treino_id: s.item_treino_id,
        user_id: user.id,
        numero_serie: Number(s.numero_serie),
        peso: Number(s.peso),
        repeticoes: Number(s.repeticoes),
      }));

      const { error: errSeries } = await supabase
        .from("series_executadas")
        .insert(historico);

      if (errSeries) throw errSeries;

      await supabase
        .from("fichas")
        .update({ concluido: true })
        .eq("id", fichaId)
        .eq("user_id", user.id);

      const { data: todosTreinos, error: errBusca } = await supabase
        .from("fichas")
        .select("id, concluido")
        .eq("user_id", user.id)
        .eq("deletado", false);

      if (errBusca) throw errBusca;
      const todosConcluidos = todosTreinos.every((t) => t.concluido === true);

      if (todosConcluidos) {
        const { error: errReset } = await supabase
          .from("fichas")
          .update({ concluido: false })
          .eq("user_id", user.id)
          .eq("deletado", false);

        if (errReset) throw errReset;

        toast.success("✅ Ciclo de treinos resetado com sucesso!");
      }
      await buscarTreinos();
    } catch (error: any) {
      console.error("Erro na lógica de histórico:", error.message || error);
    }
  }

  async function deleteCardTreino(id: number): Promise<void> {
    if (!user) return;
    const { error } = await supabase
      .from("fichas")
      .update({ deletado: true })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) console.error("Erro ao mover para lixeira:", error);
    else buscarTreinos();
  }

  async function finalizarTreino(id: number): Promise<void> {
    if (!user) return;
    const { error } = await supabase
      .from("fichas")
      .update({ concluido: true })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Erro ao finalizar:", error);
    } else {
      await buscarTreinos();
    }
  }

  async function restaurarTreino(id: number): Promise<void> {
    if (!user) return;
    const { error } = await supabase
      .from("fichas")
      .update({ deletado: false })
      .eq("id", id)
      .eq("user_id", user.id);

    if (!error) {
      await buscarTreinos();
      await buscarTreinosDeletados();
    }
  }

  async function excluirDefinitivamente(id: number): Promise<void> {
    if (!user) return;
    await supabase
      .from("itens_treino")
      .delete()
      .eq("ficha_id", id)
      .eq("user_id", user.id);

    await supabase.from("fichas").delete().eq("id", id).eq("user_id", user.id);

    await buscarTreinos();
    await buscarTreinosDeletados();
    toast.success("Treino excluído com sucesso!");
  }

  async function buscarUltimaCarga(
    itemTreinoId: number
  ): Promise<UltimaCarga | null> {
    if (!user) return null;

    const { data, error } = await supabase
      .from("series_executadas")
      .select("peso, repeticoes, created_at")
      .eq("item_treino_id", itemTreinoId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;
    return data as UltimaCarga;
  }

  return (
    <TrainContext.Provider
      value={{
        listaTreinosSalvos,
        buscarTreinos,
        deleteCardTreino,
        salvarTreino,
        series,
        setSeries,
        repeticoes,
        setRepeticoes,
        atualizarSerie,
        finalizarTreino,
        restaurarTreino,
        excluirDefinitivamente,
        buscarTreinosDeletados,
        buscarProgressoExercicio,
        idSelecionado,
        setIdSelecionado,
        setTreinosDeletados,
        treinosDeletados,
        finalizarTreinoComHistorico,
        buscarUltimaCarga,
        buscarDadosParaExecucao,
        listaExerciciosDB,
        loading,
        setLoading,
      }}
    >
      {children}
    </TrainContext.Provider>
  );
}

export const useTrain = () => {
  const context = useContext(TrainContext);
  if (!context) {
    throw new Error("useTrain deve ser usado dentro de um TrainProvider");
  }
  return context;
};