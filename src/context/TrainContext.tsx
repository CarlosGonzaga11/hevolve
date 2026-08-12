import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

const TrainContext = createContext();

export function TrainProvider({ children }) {
  const { user } = useAuth();
  const [listaTreinosSalvos, setListaTreinosSalvos] = useState([]);
  const [series, setSeries] = useState(3);
  const [repeticoes, setRepeticoes] = useState(12);
  const [idSelecionado, setIdSelecionado] = useState(null);
  const [treinosDeletados, setTreinosDeletados] = useState([]);
  const [listaExerciciosDB, setListaExerciciosDB] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // Funcao utilitaria para sanitizar inputs de texto contra XSS
  function sanitizarTexto(texto) {
    if (typeof texto !== "string") return "";
    return texto.replace(/<[^>]*>?/gm, "").trim();
  }

  async function buscarTodosExercicios() {
    if (!user) return;
    const { data, error } = await supabase
      .from("exercicios")
      .select("*")
      .or(`user_id.is.null,user_id.eq.${user.id}`)
      .order("nome", { ascending: true });

    if (error) console.error("Erro ao carregar biblioteca:", error);
    else setListaExerciciosDB(data || []);
  }

  async function buscarProgressoExercicio(exercicioId) {
    if (!user) return [];

    // CORREÇÃO (IDOR/RLS): Filtra obrigatoriamente pelo user.id
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

  async function buscarTreinos() {
    if (!user) return;
    const { data, error } = await supabase
      .from("fichas")
      .select(
        `
        id, 
        nome,
        concluido,
        deletado,
        itens_treino (
          id,
          exercicio_id,
          series,
          repeticoes,
          exercicios (
            nome
          )
        )
      `,
      )
      .eq("user_id", user.id)
      .eq("deletado", false);

    if (error) console.error("Erro ao buscar:", error);
    else setListaTreinosSalvos(data || []);
  }

  async function buscarDadosParaExecucao(fichaId) {
    if (!user) return;

    // CORREÇÃO (IDOR): Garante que a ficha requisitada pertence ao usuario logado
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
      `,
      )
      .eq("ficha_id", fichaId)
      .eq("user_id", user.id);

    if (error) console.error("Erro ao buscar dados para execução:", error);
    return data;
  }

  async function buscarTreinosDeletados() {
    if (!user) return;
    const { data, error } = await supabase
      .from("fichas")
      .select("*")
      .eq("user_id", user.id)
      .eq("deletado", true);

    if (error) console.error("Erro ao buscar lixeira:", error);
    else setTreinosDeletados(data || []);
  }

  async function atualizarSerie(serieId, novosDados) {
    if (!user) return;

    // CORREÇÃO (IDOR/RLS): Garante que apenas series do próprio usuário sejam alteradas
    const { error } = await supabase
      .from("series_executadas")
      .update(novosDados)
      .eq("id", serieId)
      .eq("user_id", user.id);

    if (error) console.error("Erro ao atualizar série:", error);
  }

  async function salvarTreino(nome, itens) {
    if (!user) {
      toast.error("Você precisa estar logado para salvar um treino.");
      return;
    }

    const nomeFichaSanitizado = sanitizarTexto(nome);
    if (!nomeFichaSanitizado) {
      toast.error("Insira um nome válido para o treino.");
      return;
    }

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
            // CORREÇÃO (XSS): Sanitiza nome e grupo muscular antes de salvar no BD
            const { data: novoExercicio, error: errEx } = await supabase
              .from("exercicios")
              .insert({
                nome: nomeExercicioSanitizado,
                grupo_muscular: sanitizarTexto(ex.grupo_muscular) || "Geral",
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
          series: Number(ex.series) || series,
          repeticoes: Number(ex.repeticoes) || repeticoes,
        };
      }),
    );

    // CORREÇÃO (XSS): Grava nome sanitizado
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

  async function finalizarTreinoComHistorico(fichaId, dadosDasSeries) {
    if (!user) return;
    try {
      // CORREÇÃO (IDOR): Valida se a ficha pertence ao usuário logado
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
        user_id: user.id, // Adicionado user_id explicitamente para RLS
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
    } catch (error) {
      console.error("Erro na lógica de histórico:", error.message);
    }
  }

  async function deleteCardTreino(id) {
    if (!user) return;
    const { error } = await supabase
      .from("fichas")
      .update({ deletado: true })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) console.error("Erro ao mover para lixeira:", error);
    else buscarTreinos();
  }

  async function finalizarTreino(id) {
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

  async function restaurarTreino(id) {
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

  async function excluirDefinitivamente(id) {
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

  async function buscarUltimaCarga(itemTreinoId) {
    if (!user) return null;

    // CORREÇÃO (IDOR/RLS): Filtra obrigatoriamente pelo user.id
    const { data, error } = await supabase
      .from("series_executadas")
      .select("peso, repeticoes, created_at")
      .eq("item_treino_id", itemTreinoId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;
    return data;
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

export const useTrain = () => useContext(TrainContext);
