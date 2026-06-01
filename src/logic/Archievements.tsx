import { supabase } from "../supabase";

export const METAS_ESTATICAS = [
  { chave: 'treino_1', nome: 'Recruta', objetivo: 1, tipo: 'volume', icone: '🥉' },
  { chave: 'treino_10', nome: 'Constante', objetivo: 10, tipo: 'volume', icone: '🥈' },
  { chave: 'treino_50', nome: 'Veterano', objetivo: 50, tipo: 'volume', icone: '🥇' },
];

/**
 * Processa as conquistas comparando o treino atual com o histórico
 */
export async function processarConquistas(
  totalTreinos: number, 
  seriesDoTreino: any[], 
  nomesExercicios: Record<number, string>
) {
  const novasConquistas = [];

  // --- 1. Lógica de Volume (Metas Estáticas) ---
  for (const meta of METAS_ESTATICAS) {
    if (meta.tipo === 'volume' && totalTreinos >= meta.objetivo) {
      const ganhou = await salvarConquistaSeNaoExistir(meta.chave);
      if (ganhou) novasConquistas.push(meta.nome);
    }
  }

// --- 2. Lógica de PR (Recorde Pessoal) ---
// --- 2. Lógica de PR (Recorde Pessoal) ---
// --- 2. Lógica de PR (Recorde Pessoal) ---
// --- 2. Lógica de PR e Alertas de Carga ---
  const idsNoTreino = [...new Set(seriesDoTreino.map(s => s.item_treino_id))];

  for (const id of idsNoTreino) {
    const seriesDesteItem = seriesDoTreino.filter(s => s.item_treino_id === id);
    const maiorPesoHoje = Math.max(...seriesDesteItem.map(s => s.peso || 0));

    if (maiorPesoHoje === 0) continue;

    const agoraMesmo = new Date(Date.now() - 5000).toISOString();

    // Buscamos o maior peso registrado ANTES de agora
    const { data: recordes } = await supabase
      .from("series_executadas")
      .select("peso")
      .eq("item_treino_id", id)
      .lt("created_at", agoraMesmo)
      .order("peso", { ascending: false })
      .limit(1);

    const recordeAnterior = recordes?.[0]?.peso || 0;
    const nomeExercicio = nomesExercicios[id] || "Exercício";

    // CASO 1: Bateu o Recorde (Peso Maior)
    if (maiorPesoHoje > recordeAnterior && recordeAnterior > 0) {
      const chavePR = `pr_item_${id}_${maiorPesoHoje}`;
      const ganhou = await salvarConquistaSeNaoExistir(chavePR, { 
        tipo: 'PR', item_id: id, nome: nomeExercicio, peso: maiorPesoHoje 
      });
      
      if (ganhou) {
        novasConquistas.push(`🏆 Novo recorde no ${nomeExercicio}: ${maiorPesoHoje}kg!`);
      }
    } 
    // CASO 2: Abaixou o peso (Aviso)
    else if (maiorPesoHoje < recordeAnterior && recordeAnterior > 0) {
      // Aqui não salvamos no banco, apenas enviamos para o array de mensagens
      // Usamos um prefixo diferente para tratar no Toast depois, se quiser
      novasConquistas.push(`Atenção no ${nomeExercicio}: Você usou menos peso que o seu recorde (${recordeAnterior}kg).`);
    }
  }
  return novasConquistas;
}

/**
 * Salva no banco apenas se a conquista for inédita
 */
async function salvarConquistaSeNaoExistir(chave: string, metadados: any = {}) {
  // Verificação prévia para evitar erros de duplicata no console
  const { data: existe } = await supabase
    .from("conquistas_desbloqueadas")
    .select("chave_conquista")
    .eq("chave_conquista", chave)
    .maybeSingle();

  if (existe) return false;

  const { error } = await supabase
    .from("conquistas_desbloqueadas")
    .insert([{ 
        chave_conquista: chave, 
        metadados: metadados 
    }]);

  if (error) {
    if (error.code !== '23505') { 
       console.error("Erro real no Supabase:", error.message);
    }
    return false;
  }

  return true; 
}