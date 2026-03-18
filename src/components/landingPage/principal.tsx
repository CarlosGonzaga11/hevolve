import { ArrowRight } from "lucide-react";

export default function Principal() {
  return (
    <main className="bg-[#121212] h-screen">
      <div className="flex items-center flex-col pt-20 text-center">
        <p className="text-[#4CAF50]">TREINO PERSONALIZADO ONLINE</p>
        <div className="sm:text-8xl  text-6xl font-bold  flex flex-col items-center leading-tight text-center ">
          <h1 className="text-[#FFFFFF] ">SUA MELHOR</h1>
          <h1>
            <span className="text-[#4CAF50] ">VERSÃO</span>
            <span className="text-[#FFFFFF]">COMEÇA AQUI</span>
          </h1>
        </div>
        <div className="py-4 text-[#B3B3B3] max-w-2xl  text-xl flex flex-col  items-center">
          <p>
            Treinos criados por profissionais, adaptados ao seu corpo, objetivo
          </p>
          <p> e rotina. Evolua com acompanhamento real.</p>
        </div>

        <div className=" mt-8 text-lg py-3  px-6 flex flex-row gap-2 items-center rounded  border-white bg-[#2E7D32] ">
          <button className="">COMEÇAR AGORA</button>
          <ArrowRight size={20} />
        </div>
      </div>
    </main>
  );
}
