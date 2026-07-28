import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import Loader from "../loader";

export default function HistoryTrain() {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);

  async function buscarHistoricoCompleto() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("treinos_realizados")
        .select(`
          id,
          data_realizacao,
          fichas ( nome ),
          series_executadas (
            peso,
            repeticoes
          )
        `)
        .order("data_realizacao", { ascending: false });

      if (error) throw error;
      setHistorico(data);
    } catch (err) {
      console.error("Erro ao buscar histórico:", err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    buscarHistoricoCompleto();
  }, []);

  // Função para formatar a data (ex: 01/04/2026)
  const formatarData = (dataIso) => {
    return new Date(dataIso).toLocaleDateString("pt-BR");
  };

  if (loading) return <div className="p-10 flex justify-center"><Loader /></div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-4">
      <h3 className="text-2xl font-bold mb-6">Histórico de Treinos</h3>

      {historico.length === 0 ? (
        <p className="text-zinc-500 text-center mt-10">Você ainda não realizou nenhum treino.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {historico.map((log) => (
            <div 
              key={log.id} 
              className="bg-zinc-900 border border-white/5 p-4 rounded-2xl flex justify-between items-center"
            >
              <div>
                <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">
                  {formatarData(log.data_realizacao)}
                </span>
                <h4 className="text-lg font-semibold text-zinc-100">
                  {log.fichas?.nome || "Treino Deletado"}
                </h4>
                <p className="text-xs text-zinc-500">
                  {log.series_executadas?.length} séries realizadas
                </p>
              </div>
              
              <div className="text-right">
                 <div className="bg-green-500/10 text-green-500 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}