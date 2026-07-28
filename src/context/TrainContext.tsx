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
  const [treinosDeletados, setTreinosDeletados] = useState();
  const [listaExerciciosDB, setListaExerciciosDB] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    buscarTodosExercicios();
    if (user) {
      buscarTreinos();
    } else {
      setListaTreinosSalvos([]);
    }
  }, [user]);

  async function buscarTodosExercicios() {
    const { data, error } = await supabase
      .from("exercicios")
      .select("*")
      .order("nome", { ascending: true });

    if (error) console.error("Erro ao carregar biblioteca:", error);
    else setListaExerciciosDB(data);
  }
  async function buscarProgressoExercicio(exercicioId) {
    const { data, error } = await supabase
      .from("series_executadas")
      .select("peso, criada_em")
      .eq("exercicio_id", exercicioId)
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
    console.log("data vindo da buscar treinos", data);

    if (error) console.error("Erro ao buscar:", error);
    else setListaTreinosSalvos(data);
    console.log("tem algo aq", treinosDeletados);
  }
  async function buscarDadosParaExecucao(fichaId) {
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
      .eq("ficha_id", fichaId);
  }

  async function buscarTreinosDeletados() {
    if (!user) return;
    const { data, error } = await supabase
      .from("fichas")
      .select("*")
      .eq("user_id", user.id)
      .eq("deletado", true); // Busca apenas o que foi descartado

    if (error) console.error("Erro ao buscar lixeira:", error);
    else setTreinosDeletados(data);
  }

  async function atualizarSerie(serieId, novosDados) {
    const { error } = await supabase
      .from("series_executadas")
      .update(novosDados)
      .eq("id", serieId);

    if (error) console.error("Erro ao atualizar série:", error);
  }

async function salvarTreino(nome, itens) {
  if (!user) {
    toast.error("Você precisa estar logado para salvar um treino.");
    return;
  }

  const itensFormatados = await Promise.all(
    itens.map(async (ex) => {
      let exercicioId = ex.id;

      if (!exercicioId) {
        // Verifica se já existe um exercício com esse nome
        const { data: existente } = await supabase
          .from("exercicios")
          .select("id")
          .ilike("nome", ex.nome.trim())
          .or(`user_id.is.null,user_id.eq.${user.id}`)
          .maybeSingle();

        if (existente) {
          exercicioId = existente.id;
        } else {
          // Cria o novo exercício com a categoria correta enviada pelo usuário!
          const { data: novoExercicio, error: errEx } = await supabase
            .from("exercicios")
            .insert({
              nome: ex.nome.trim(),
              grupo_muscular: ex.grupo_muscular || "Geral", // 👈 PEGA A CATEGORIA SELECIONADA!
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
        series: ex.series || series,
        repeticoes: ex.repeticoes || repeticoes,
      };
    })
  );

  // 2. Cria a ficha no banco
  const { data: ficha, error: errFicha } = await supabase
    .from("fichas")
    .insert([{ nome: nome, user_id: user.id }])
    .select()
    .single();

  if (errFicha) throw errFicha;

  // 3. Salva os itens
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
        numero_serie: s.numero_serie,
        peso: s.peso,
        repeticoes: s.repeticoes,
      }));

      const { error: errSeries } = await supabase
        .from("series_executadas")
        .insert(historico);

      if (errSeries) throw errSeries;

      await supabase
        .from("fichas")
        .update({ concluido: true })
        .eq("id", fichaId);

      const { data: todosTreinos, error: errBusca } = await supabase
        .from("fichas")
        .select("id, concluido")
        .eq("user_id", user.id)
        .eq("deletado", false);

      if (errBusca) throw errBusca;
      const todosConcluidos = todosTreinos.every((t) => t.concluido === true);

      if (todosConcluidos) {
        console.log("🔥 Todos os treinos concluídos! Resetando ficha...");

        const { error: errReset } = await supabase
          .from("fichas")
          .update({ concluido: false })
          .eq("user_id", user.id)
          .eq("deletado", false);

        if (errReset) throw errReset;

        toast.success("✅ Ciclo de treinos resetado com sucesso!");
      }
      await buscarTreinos();
      console.log("Histórico salvo com sucesso!");
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
    toast
  }

  async function buscarUltimaCarga(itemTreinoId) {
    const { data, error } = await supabase
      .from("series_executadas")
      .select("peso, repeticoes, created_at")
      .eq("item_treino_id", itemTreinoId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

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
        listaExerciciosDB,
        loading,
        setLoading,
      }}
    >
      {children}
    </TrainContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTrain = () => useContext(TrainContext);
