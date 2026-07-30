import { supabase } from "../supabase";

export interface Meta {
  chave: string;
  nome: string;
  objetivo: number;
  tipo: "treinos" | "outros";
  icone: string;
  descricao: string;
  escondida?: boolean;
}

export const METAS_ESTATICAS: Meta[] = [
  // Visible / Padrão
  { chave: "treino_1", nome: "Recruta", objetivo: 1, tipo: "treinos", icone: "🥉", descricao: "Conclua 1 treino" },
  { chave: "treino_10", nome: "Constante", objetivo: 10, tipo: "treinos", icone: "🥈", descricao: "Conclua 10 treinos" },
  { chave: "treino_50", nome: "Veterano", objetivo: 50, tipo: "treinos", icone: "🥇", descricao: "Conclua 50 treinos" },

  // Escondidas / Secretas (Só revelam quando unlocked)
  { chave: "supino_100", nome: "Clube dos 100kg", objetivo: 100, tipo: "especial", icone: "🏋️‍♂️", descricao: "Levantou 100kg em um exercício", escondida: true },
  { chave: "peso_1t", nome: "Levantador de Fusca", objetivo: 1000, tipo: "volume", icone: "🚗", descricao: "1.000 kg acumulados", escondida: true },
  { chave: "superou_limite", nome: "PR Quebrado!", objetivo: 1, tipo: "especial", icone: "💥", descricao: "Bateu um recorde pessoal", escondida: true },
]
  export async function processarConquistas(
  totalTreinos: number,
  seriesDoTreino: any[],
  nomesExercicios: Record<number, string>,
) {
  const novasConquistas: string[] = [];

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return novasConquistas;

  // --- 1. Lógica de Metas de Treino ---
  for (const meta of METAS_ESTATICAS) {
    if (meta.tipo === "treinos" && totalTreinos >= meta.objetivo) {
      const ganhou = await salvarConquistaSeNaoExistir(meta.chave, user.id);
      if (ganhou) novasConquistas.push(meta.nome);
    }
  }

  // --- 2. Lógica de PR e Conquistas de Carga (Ex: 100kg) ---
  const idsNoTreino = [...new Set(seriesDoTreino.map((s) => s.item_treino_id))];

  for (const id of idsNoTreino) {
    const seriesDesteItem = seriesDoTreino.filter(
      (s) => s.item_treino_id === id,
    );
    const maiorPesoHoje = Math.max(...seriesDesteItem.map((s) => s.peso || 0));

    if (maiorPesoHoje === 0) continue;

    // ✅ VERIFICAÇÃO DO CLUBE DOS 100KG
    if (maiorPesoHoje >= 100) {
      const ganhou100kg = await salvarConquistaSeNaoExistir(
        "supino_100",
        user.id,
        {
          peso: maiorPesoHoje,
          item_id: id,
        },
      );
      if (ganhou100kg) {
        novasConquistas.push("🏋️‍♂️ Entrou para o Clube dos 100kg!");
      }
    }

    const agoraMesmo = new Date(Date.now() - 5000).toISOString();

    const { data: recordes } = await supabase
      .from("series_executadas")
      .select("peso")
      .eq("item_treino_id", id)
      .lt("created_at", agoraMesmo)
      .order("peso", { ascending: false })
      .limit(1);

    const recordeAnterior = recordes?.[0]?.peso || 0;
    const nomeExercicio = nomesExercicios[id] || "Exercício";

    // ✅ CORREÇÃO DE PR: Aceita se for maior que o anterior OU se for o 1º treino (recordeAnterior === 0)
    if (maiorPesoHoje > recordeAnterior) {
      // Salva o PR dinâmico do exercício
      const chavePR = `pr_item_${id}_${maiorPesoHoje}`;
      await salvarConquistaSeNaoExistir(chavePR, user.id, {
        tipo: "PR",
        item_id: id,
        nome: nomeExercicio,
        peso: maiorPesoHoje,
      });

      // Salva a conquista estática de "PR Quebrado" caso já existisse um histórico
      if (recordeAnterior > 0) {
        const ganhouPR = await salvarConquistaSeNaoExistir(
          "superou_limite",
          user.id,
        );
        if (ganhouPR) {
          novasConquistas.push(
            `🏆 Novo recorde no ${nomeExercicio}: ${maiorPesoHoje}kg!`,
          );
        }
      }
    }
  }

  return novasConquistas;
}
async function salvarConquistaSeNaoExistir(
  chave: string,
  userId: string,
  metadados: any = {},
) {
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
    if (error.code !== "23505") {
      console.error("Erro real no Supabase:", error.message);
    }
    return false;
  }

  return true;
}
