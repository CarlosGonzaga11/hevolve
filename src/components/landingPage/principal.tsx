import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Principal() {
  return (
    <main className="bg-[#121212] h-screen">
      <div className="flex items-center flex-col pt-20 text-center ">
        <p className="text-[#4CAF50] leading-3 tracking-widest uppercase shadow-sm">
          ficha de treino online{" "}
        </p>
        <div className="sm:text-8xl  text-6xl font-bold  flex flex-col items-center leading-tight text-center ">
          <h1 className="text-[#FFFFFF]  tracking-widest leading-none shadow-sm">
            SUA MELHOR
          </h1>
          <h1>
            <span className="text-[#39FF14] tracking-tight leading-none shadow-sm animate-pulse">
              VERSÃO
            </span>
            <span className="text-[#FFFFFF]  tracking-widest leading-none shadow-sm">
              {" "}
              COMEÇA AQUI
            </span>
          </h1>
        </div>
        <div className="py-4 text-[#B3B3B3] max-w-2xl  text-xl flex flex-col  items-center leading-none">
          <p>Fichas de treinos online com analise gráfica de evolução</p>
        </div>

        <Link to="registro">
          <button
            className="mt-8 flex items-center gap-2 px-8 py-4 bg-[#39FF14] text-black font-bold rounded-xl shadow-lg shadow-[#39FF14]/20
    transition-all duration-300 hover:scale-105 hover:shadow-[#39FF14]/40 hover:-translate-y-1 cursor-pointer
  "
          >
            COMEÇAR AGORA
            <ArrowRight size={20} />
          </button>
        </Link>
      </div>
    </main>
  );
}
