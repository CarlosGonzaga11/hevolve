import { supabase } from "../supabase";

export interface Meta {
  chave: string;
  nome: string;
  objetivo: number;
  tipo: "treinos" | "outros" | "especial" | "volume";
  icone: string;
  descricao: string;
  escondida?: boolean;
}

export interface SerieExecutada {
  id?: string | number;
  item_treino_id: number;
  peso: number;
  reps?: number;
  created_at?: string;
}

export interface MetadadosConquista {
  tipo?: string;
  item_id?: number;
  nome?: string;
  peso?: number;
  [key: string]: unknown;
}

export const METAS_ESTATICAS: Meta[] = [
  { chave: "treino_1", nome: "Recruta", objetivo: 1, tipo: "treinos", icone: "🥉", descricao: "Conclua 1 treino" },
  { chave: "treino_10", nome: "Constante", objetivo: 10, tipo: "treinos", icone: "🥈", descricao: "Conclua 10 treinos" },
  { chave: "treino_50", nome: "Veterano", objetivo: 50, tipo: "treinos", icone: "🥇", descricao: "Conclua 50 treinos" },

  { chave: "supino_100", nome: "Clube dos 100kg", objetivo: 100, tipo: "especial", icone: "🏋️‍♂️", descricao: "Levantou 100kg em um exercício", escondida: true },
  { chave: "peso_1t", nome: "Levantador de Fusca", objetivo: 1000, tipo: "volume", icone: "🚗", descricao: "1.000 kg acumulados", escondida: true },
  { chave: "superou_limite", nome: "PR Quebrado!", objetivo: 1, tipo: "especial", icone: "💥", descricao: "Bateu um recorde pessoal", escondida: true },
];

export async function processarConquistas(
  totalTreinos: number,
  seriesDoTreino: SerieExecutada[],
  nomesExercicios: Record<number, string>
): Promise<string[]> {
  const novasConquistas: string[] = [];

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return novasConquistas;

  // 1. Processa conquistas de contagem total de treinos
  for (const meta of METAS_ESTATICAS) {
    if (meta.tipo === "treinos" && totalTreinos >= meta.objetivo) {
      const ganhou = await salvarConquistaSeNaoExistir(meta.chave, user.id);
      if (ganhou) novasConquistas.push(`🏆 Conquista Desbloqueada: ${meta.nome}`);
    }
  }

  const idsNoTreino = [...new Set(seriesDoTreino.map((s) => s.item_treino_id))];
  if (idsNoTreino.length === 0) return novasConquistas;

  // 2. Busca o histórico de pesos anteriores em batch (uma única query)
  const { data: historicoSeries } = await supabase
    .from("series_executadas")
    .select("item_treino_id, peso, created_at")
    .in("item_treino_id", idsNoTreino)
    .order("created_at", { ascending: false });

  // 3. Agrupa por exercício e calcula progressão de carga
  for (const id of idsNoTreino) {
    const seriesDesteItem = seriesDoTreino.filter((s) => s.item_treino_id === id);
    const maiorPesoHoje = Math.max(...seriesDesteItem.map((s) => s.peso || 0), 0);

    if (maiorPesoHoje === 0) continue;

    // Milestone especial de 100kg
    if (maiorPesoHoje >= 100) {
      const ganhou100kg = await salvarConquistaSeNaoExistir(
        "supino_100",
        user.id,
        { peso: maiorPesoHoje, item_id: id }
      );
      if (ganhou100kg) {
        novasConquistas.push("🏋️‍♂️ Entrou para o Clube dos 100kg!");
      }
    }

    const nomeExercicio = nomesExercicios[id] || "Exercício";

    // Filtra histórico anterior (ignorando as séries executadas no treino atual por timestamp)
    const agora = Date.now();
    const seriesAnteriores = (historicoSeries || []).filter((r) => {
      if (r.item_treino_id !== id) return false;
      const dataCriacao = new Date(r.created_at).getTime();
      return agora - dataCriacao > 30000; // Considera registros criados antes da sessão atual
    });

    const pesoAnterior = seriesAnteriores.length > 0
      ? Math.max(...seriesAnteriores.map((s) => s.peso || 0))
      : 0;

    if (pesoAnterior > 0) {
      if (maiorPesoHoje > pesoAnterior) {
        const chavePR = `pr_item_${id}_${maiorPesoHoje}`;
        const eNovoPR = await salvarConquistaSeNaoExistir(chavePR, user.id, {
          tipo: "PR",
          item_id: id,
          nome: nomeExercicio,
          peso: maiorPesoHoje,
        });

        if (eNovoPR) {
          await salvarConquistaSeNaoExistir("superou_limite", user.id);
          novasConquistas.push(
            `🔥 Novo recorde no ${nomeExercicio}: ${maiorPesoHoje}kg! (Anterior: ${pesoAnterior}kg)`
          );
        }
      } else if (maiorPesoHoje < pesoAnterior) {
        const diferenca = pesoAnterior - maiorPesoHoje;
        novasConquistas.push(
          `⚠️ Carga menor no ${nomeExercicio}: ${maiorPesoHoje}kg (${diferenca}kg a menos que a última vez)`
        );
      }
    } else {
      // Primeiro registro histórico do exercício
      const chavePR = `pr_item_${id}_${maiorPesoHoje}`;
      const eNovoPR = await salvarConquistaSeNaoExistir(chavePR, user.id, {
        tipo: "PR",
        item_id: id,
        nome: nomeExercicio,
        peso: maiorPesoHoje,
      });

      if (eNovoPR) {
        novasConquistas.push(
          `⚡ Primeiro registro de peso no ${nomeExercicio}: ${maiorPesoHoje}kg!`
        );
      }
    }
  }

  return novasConquistas;
}

async function salvarConquistaSeNaoExistir(
  chave: string,
  userId: string,
  metadados: MetadadosConquista = {}
): Promise<boolean> {
  const { data: existe } = await supabase
    .from("conquistas_desbloqueadas")
    .select("chave_conquista")
    .eq("user_id", userId)
    .eq("chave_conquista", chave)
    .maybeSingle();

  if (existe) return false;

  const { error } = await supabase
    .from("conquistas_desbloqueadas")
    .insert([{ user_id: userId, chave_conquista: chave, metadados }]);

  if (error) {
    if (error.code !== "23505") { // Código de violação de Unique Constraint no Postgres
      console.error("Erro ao salvar conquista no Supabase:", error.message);
    }
    return false;
  }

  return true;
}