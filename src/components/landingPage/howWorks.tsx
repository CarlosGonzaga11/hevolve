import { ClipboardList } from "lucide-react";

export default function HowWorks() {
  return (
    <section className="bg-[#121212] pb-20">
      <div className="flex flex-col items-center">
        <span className="text-[#4CAF50] uppercase tracking-[0.3em]">
          como funciona
        </span>
        <h2 className="text-[#FFFFFF] text-5xl font-bold">
          3 PASSOS PARA EVOLUIR
        </h2>
      </div>
      <div className=" mt-14 grid sm:grid-cols-3 gap-4 px-4 grid-cols-1">
        <div
          className="
          group relative
          rounded-xl
          border border-white/20
          bg-white/10
          backdrop-blur-md
          transition-all duration-300
          hover:border-primary/40
          hover:shadow-2xl
          z-10
        "
        >
          <div className="absolute -top-4 right-6 font-heading text-6xl font-bold  z-0 text-[#4CAF50]/10  rounded-full px-4">
            01
          </div>
          <div className="pt-8 pl-8 pb-4 flex items-center">
            <span className="p-3 rounded bg-[#97eb9a]/10 ">
              <ClipboardList size={28} color="#4CAF50" />
            </span>
          </div>
          <span className="text-xl font-bold px-8 pb-1 text-[#FFFFFF]">
            PREENCHA SEU PERFIL
          </span>
          <p className="text-sm px-8 pb-8 text-[#B3B3B3]">
            Responda perguntas sobre seus objetivos, nível e rotina para
            criarmos seu plano.
          </p>
        </div>
        <div
          className="
          group relative
          rounded-xl
          border border-white/20
          bg-white/10
          backdrop-blur-md
          transition-all duration-300
          hover:border-primary/40
          hover:shadow-2xl
          z-10
        "
        >
          <div className="absolute -top-4 right-6 font-heading text-6xl font-bold  z-0 text-[#4CAF50]/10 rounded-full px-4">
            01
          </div>
          <div className="pt-8 pl-8 pb-4 flex items-center">
            <span className="p-3 rounded bg-[#97eb9a]/10 ">
              <ClipboardList size={28} color="#4CAF50" />
            </span>
          </div>
          <span className="text-xl font-bold px-8 pb-1 text-[#FFFFFF]">
            PREENCHA SEU PERFIL
          </span>
          <p className="text-sm px-8 pb-8 text-[#B3B3B3]">
            Responda perguntas sobre seus objetivos, nível e rotina para
            criarmos seu plano.
          </p>
        </div>
        <div
          className="
          group relative
          rounded-xl
          border border-white/20
          bg-white/10
          backdrop-blur-md
          transition-all duration-300
          hover:border-primary/40
          hover:shadow-2xl
          z-10
        "
        >
          <div className="absolute -top-4 right-6 font-heading text-6xl font-bold  z-0 text-[#4CAF50]/10 rounded-full px-4">
            01
          </div>
          <div className="pt-8 pl-8 pb-4 flex items-center">
            <span className="p-3 rounded bg-[#97eb9a]/10 ">
              <ClipboardList size={28} color="#4CAF50" />
            </span>
          </div>
          <span className="text-xl font-bold px-8 pb-1 text-[#FFFFFF]">
            PREENCHA SEU PERFIL
          </span>
          <p className="text-sm px-8 pb-8 text-[#B3B3B3]">
            Responda perguntas sobre seus objetivos, nível e rotina para
            criarmos seu plano.
          </p>
        </div>
      </div>
    </section>
  );
}
