import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function Principal() {
  return (
    <main className="bg-[#121212] min-h-screen pt-32 pb-16 px-4 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#39FF14]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex flex-col items-center text-center max-w-4xl relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#4ADE80] text-xs font-semibold uppercase tracking-widest mb-6 backdrop-blur-sm">
          <Sparkles size={14} />
          <span>Ficha de treino online</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight leading-tight">
          SUA MELHOR{" "}
          <span className="text-[#39FF14] drop-shadow-[0_0_25px_rgba(57,255,20,0.4)]">
            VERSÃO
          </span>{" "}
          COMEÇA AQUI
        </h1>

        <p className="mt-6 text-zinc-400 text-lg sm:text-xl max-w-2xl font-normal leading-relaxed">
          Fichas de treinos online intuitivas com análise gráfica completa de
          evolução de carga.
        </p>

        <Link to="/registro" className="mt-10">
          <button className="flex items-center gap-3 px-8 py-4 bg-[#39FF14] text-black font-bold text-lg rounded-xl shadow-lg shadow-[#39FF14]/20 transition-all duration-300 hover:bg-[#32e612] hover:scale-105 hover:shadow-[#39FF14]/40 cursor-pointer">
            COMEÇAR AGORA
            <ArrowRight size={22} />
          </button>
        </Link>
      </div>
    </main>
  );
}
