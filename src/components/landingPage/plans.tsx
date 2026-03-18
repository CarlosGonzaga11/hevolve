import { Check } from "lucide-react";

export default function Plans() {
  return (
    <section className="bg-[#121212] pb-20 py-24">
      <div className="flex flex-col items-center">
        <span className="text-[#4CAF50] uppercase tracking-[0.3em] font-semibold">
          Planos
        </span>
        <h2 className="text-[#FFFFFF] text-5xl font-bold p-2">
          ESCOLHA SEU PLANO
        </h2>
      </div>
      <div className=" mt-14 grid sm:grid-cols-3 items-center  gap-8  px-20 grid-cols-1">
        {/** */}
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
          pb-8
          hover:border-[#4CAF50]
        "
        >
          <div className="flex flex-col pt-8 pl-8 text-[#FAFAFA]">
            <span className="text-2xl font-bold">BÁSICO</span>
          </div>
          <div className="flex pt-2 pl-8">
            <span className="text-4xl font-bold text-[#FAFAFA]">R$ 79</span>
            <span className="text-[#B3B3B3] flex items-end text-lg">/mês</span>
          </div>
          <div className="pl-8 pt-4 flex flex-col gap-2">
            <div className="flex gap-3 items-center">
              <Check size={14} color="#4CAF50" />
              <p className="text-[#B3B3B3]">Treino personalizado</p>
            </div>

            <div className="flex gap-3 items-center">
              <Check size={14} color="#4CAF50" />
              <p className="text-[#B3B3B3]">Atualização mensal</p>
            </div>

            <div className="flex gap-3 items-center">
              <Check size={14} color="#4CAF50" />
              <p className="text-[#B3B3B3]">Suporte por chat</p>
            </div>

            <div className="flex gap-3 items-center pb-16">
              <Check size={14} color="#4CAF50" />
              <p className="text-[#B3B3B3]">Videos dos exercicios</p>
            </div>
          </div>
          <div className="flex  justify-center">
            <button className="flex  items-center  text-[#FAFAFA] text-lg p-2 border border-[#B3B3B3]/10 px-8 rounded">
              ESCOLHER PLANO
            </button>
          </div>
        </div>
        {/** */}
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
          pb-8
          hover:border-[#4CAF50]
        "
        >
          <div className="flex flex-col pt-8 pl-8 text-[#FAFAFA]">
            <span className="text-2xl font-bold">BÁSICO</span>
          </div>
          <div className="flex pt-2 pl-8">
            <span className="text-4xl font-bold text-[#FAFAFA]">R$ 79</span>
            <span className="text-[#B3B3B3] flex items-end text-lg">/mês</span>
          </div>
          <div className="pl-8 pt-4 flex flex-col gap-2">
            <div className="flex gap-3 items-center">
              <Check size={14} color="#4CAF50" />
              <p className="text-[#B3B3B3]">Treino personalizado</p>
            </div>

            <div className="flex gap-3 items-center">
              <Check size={14} color="#4CAF50" />
              <p className="text-[#B3B3B3]">Atualização mensal</p>
            </div>

            <div className="flex gap-3 items-center">
              <Check size={14} color="#4CAF50" />
              <p className="text-[#B3B3B3]">Suporte por chat</p>
            </div>

            <div className="flex gap-3 items-center pb-16">
              <Check size={14} color="#4CAF50" />
              <p className="text-[#B3B3B3]">Videos dos exercicios</p>
            </div>
          </div>
          <div className="flex  justify-center">
            <button className="flex  items-center  text-[#FAFAFA] text-lg p-2 border border-[#B3B3B3]/10 px-8 rounded">
              ESCOLHER PLANO
            </button>
          </div>
        </div>
        {/** */}
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
          pb-8
          hover:border-[#4CAF50]
        "
        >
          <div className="flex flex-col pt-8 pl-8 text-[#FAFAFA]">
            <span className="text-2xl font-bold">BÁSICO</span>
          </div>
          <div className="flex pt-2 pl-8">
            <span className="text-4xl font-bold text-[#FAFAFA]">R$ 79</span>
            <span className="text-[#B3B3B3] flex items-end text-lg">/mês</span>
          </div>
          <div className="pl-8 pt-4 flex flex-col gap-2">
            <div className="flex gap-3 items-center">
              <Check size={14} color="#4CAF50" />
              <p className="text-[#B3B3B3]">Treino personalizado</p>
            </div>

            <div className="flex gap-3 items-center">
              <Check size={14} color="#4CAF50" />
              <p className="text-[#B3B3B3]">Atualização mensal</p>
            </div>

            <div className="flex gap-3 items-center">
              <Check size={14} color="#4CAF50" />
              <p className="text-[#B3B3B3]">Suporte por chat</p>
            </div>

            <div className="flex gap-3 items-center pb-16">
              <Check size={14} color="#4CAF50" />
              <p className="text-[#B3B3B3]">Videos dos exercicios</p>
            </div>
          </div>
          <div className="flex  justify-center">
            <button className="flex  items-center  text-[#FAFAFA] text-lg p-2 border border-[#B3B3B3]/10 px-8 rounded">
              ESCOLHER PLANO
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
