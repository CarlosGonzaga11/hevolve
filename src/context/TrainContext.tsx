import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase";

const TrainContext = createContext();
export function TrainProvider({ children }) {
  const [listaTreinosSalvos, setListaTreinosSalvos] = useState([]);
  const [series, setSeries] = useState(3);
  const [repeticoes, setRepeticoes] = useState(12);
  const [idSelecionado, setIdSelecionado] = useState(null);
  const [treinosDeletados, setTreinosDeletados] = useState();
  const [listaExerciciosDB, setListaExerciciosDB] = useState([]);
  useEffect(() => {
    buscarTreinos();
    buscarTodosExercicios();
  }, []);

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

    // Formatar para o gráfico:
    return data.map((set) => ({
      data: new Date(set.criada_em).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }),
      carga: set.peso,
    }));
  }

  async function buscarTreinos() {
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
      `
      )
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
      `
      )
      .eq("ficha_id", fichaId);
  }

  async function buscarTreinosDeletados() {
    const { data, error } = await supabase
      .from("fichas")
      .select("*")
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
    const { data: ficha, error: errFicha } = await supabase
      .from("fichas")
      .insert([{ nome: nome }])
      .select()
      .single();

    if (errFicha) throw errFicha;

    const itensParaSalvar = itens.map((ex) => ({
      ficha_id: ficha.id,
      exercicio_id: ex.id,
      series: ex.series || series, // Usa o que vem do input ou o padrão 3
      repeticoes: ex.repeticoes || repeticoes, // Usa o que vem do input ou o padrão 12
    }));

    await supabase.from("itens_treino").insert(itensParaSalvar);

    await buscarTreinos();
  }
  async function finalizarTreinoComHistorico(fichaId, dadosDasSeries) {
    try {
      const { data: treino, error: errTreino } = await supabase
        .from("treinos_realizados")
        .insert([
          {
            ficha_id: fichaId,
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
        .update({ concluido: false })
        .eq("id", fichaId);

      await buscarTreinos();
      console.log("Histórico salvo com sucesso!");
    } catch (error) {
      console.error("Erro na lógica de histórico:", error.message);
    }
  }

  async function deleteCardTreino(id) {
    const { error } = await supabase
      .from("fichas")
      .update({ deletado: true })
      .eq("id", id);

    if (error) console.error("Erro ao mover para lixeira:", error);
    else buscarTreinos();
  }
  async function finalizarTreino(id) {
    const { error } = await supabase
      .from("fichas")
      .update({ concluido: false })
      .eq("id", id);

    if (error) {
      console.error("Erro ao finalizar:", error);
    } else {
      await buscarTreinos();
    }
  }
  async function restaurarTreino(id) {
    const { error } = await supabase
      .from("fichas")
      .update({ deletado: false })
      .eq("id", id);
    if (!error) buscarTreinos();
  }

  async function excluirDefinitivamente(id) {
    await supabase.from("itens_treino").delete().eq("ficha_id", id);
    await supabase.from("fichas").delete().eq("id", id);
    buscarTreinos();
  }

  async function buscarUltimaCarga(itemTreinoId) {
    const { data, error } = await supabase
      .from("series_executadas")
      .select("peso, repeticoes, created_at")
      .eq("item_treino_id", itemTreinoId)
      .order("created_at", { ascending: false }) // Pega o mais recente primeiro
      .limit(1) // Queremos apenas o último
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
      }}
    >
      {children}
    </TrainContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTrain = () => useContext(TrainContext);
