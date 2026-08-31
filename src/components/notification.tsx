import { useState } from "react";
import { Bell, TrendingUp, CheckCircle, Trash2 } from "lucide-react";
import { useTrain } from "../context/TrainContext";

export function NotificationMenu() {
  const { notificacoes, limparNotificacoes } = useTrain();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 transition-colors text-zinc-300 hover:text-white border border-zinc-700/50"
        title="Histórico de Cargas"
      >
        <Bell className="w-5 h-5 cursor-pointer transition-all ease-in-out" />
        {notificacoes.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-black animate-pulse">
            {notificacoes.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl z-50 overflow-hidden">
          <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h3 className="font-semibold text-sm text-zinc-100">
                Progressão de Carga
              </h3>
            </div>
            {notificacoes.length > 0 && (
              <button
                onClick={limparNotificacoes}
                className="text-xs text-zinc-400 hover:text-rose-400 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Limpar
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-zinc-800/60">
            {notificacoes.length === 0 ? (
              <div className="p-6 text-center text-xs text-zinc-500">
                Nenhuma evolução de carga registrada nesta sessão.
              </div>
            ) : (
              notificacoes.map((n) => (
                <div
                  key={n.id}
                  className="p-3.5 hover:bg-zinc-800/40 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-medium text-sm text-zinc-200">
                      {n.exercicioNome}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {n.data.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>
                      Aumentou +{n.diferenca}kg ({n.pesoAnterior}kg ➔{" "}
                      {n.pesoNovo}kg)
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
