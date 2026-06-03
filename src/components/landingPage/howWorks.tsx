import { ClipboardList, TrendingUp, User } from "lucide-react";

export default function HowWorks() {
  return (
    <section id="como-funciona" className="bg-[#121212] py-20">
      <div className="flex flex-col items-center">
        <span className="text-[#4ADE80] uppercase tracking-widest mt-6">
          como funciona
        </span>
        <h2 className="text-white text-3xl sm:text-5xl font-bold max-w-4xl px-4">
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
          hover:border-primary/40
          hover:shadow-2xl
          z-10
          transition-all duration-300
          hover:-translate-y-1 

        "
        >
          <div className="absolute -top-4 right-6 font-heading text-6xl font-bold  z-0 text-[#4CAF50]/10  rounded-full px-4">
            01
          </div>
          <div className="pt-8 pl-8 pb-4 flex items-center">
            <span className="p-3 rounded bg-[#97eb9a]/10 ">
              <User size={28} color="#4CAF50" />
            </span>
          </div>
          <span className="text-xl font-bold px-8 pb-1 text-[#FFFFFF]">
            CRIE SUA CONTA
          </span>
          <p className="text-sm px-8 pb-8 text-[#B3B3B3]">
            Cadastre-se em poucos segundos e personalize seu perfil com seus
            objetivos, experiência e frequência de treinos.
          </p>
        </div>
        <div
          className="
          group relative
          rounded-xl
          border border-white/20
          bg-white/10
          backdrop-blur-md
          hover:border-primary/40
          hover:shadow-2xl
          z-10
           hover:-translate-y-1 transition-all duration-300
        "
        >
          <div className="absolute -top-4 right-6 font-heading text-6xl font-bold  z-0 text-[#4CAF50]/10 rounded-full px-4">
            02
          </div>
          <div className="pt-8 pl-8 pb-4 flex items-center">
            <span className="p-3 rounded bg-[#97eb9a]/10 ">
              <ClipboardList size={28} color="#4CAF50" />
            </span>
          </div>
          <span className="text-xl font-bold px-8 pb-1 text-[#FFFFFF]">
            MONTE SEU TREINO
          </span>
          <p className="text-sm px-8 pb-8 text-[#B3B3B3]">
            Crie fichas personalizadas, organize exercícios, séries e repetições
            de acordo com sua rotina.
          </p>
        </div>
        <div
          className="
          group relative
          rounded-xl
          border border-white/20
          bg-white/10
          backdrop-blur-md
          hover:border-primary/40
          hover:shadow-2xl
          z-10
          hover:-translate-y-1 transition-all duration-300

        "
        >
          <div className="absolute -top-4 right-6 font-heading text-6xl font-bold  z-0 text-[#4CAF50]/10 rounded-full px-4">
            03
          </div>
          <div className="pt-8 pl-8 pb-4 flex items-center">
            <span className="p-3 rounded bg-[#97eb9a]/10 ">
              <TrendingUp size={28} color="#4CAF50" />
            </span>
          </div>
          <span className="text-xl font-bold px-8 pb-1 text-[#FFFFFF]">
            ACOMPANHE SUA EVOLUÇÃO
          </span>
          <p className="text-sm px-8 pb-8 text-[#B3B3B3]">
            Registre seus treinos, acompanhe cargas, conquistas e veja seu
            progresso ao longo do tempo.
          </p>
        </div>
      </div>
    </section>
  );
}
