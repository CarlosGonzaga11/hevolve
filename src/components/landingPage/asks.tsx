import { ChevronDown, Dumbbell } from "lucide-react";
import { useState } from "react";

const asks = [
  {
    id: 1,
    question: "O Hevolve é gratuito?",
    answer:
      "Sim! Você pode começar gratuitamente e organizar seus treinos sem custo.",
  },
  {
    id: 2,
    question: "Posso criar mais de uma ficha de treino?",
    answer:
      "Sim. Crie diferentes fichas para cada objetivo, como hipertrofia, cardio ou treino funcional.",
  },
  {
    id: 3,
    question: "Consigo acessar pelo celular?",
    answer:
      "Sim. O Hevolve é responsivo e funciona perfeitamente em celulares, tablets e computadores.",
  },
  {
    id: 4,
    question: "Posso registrar cargas e repetições?",
    answer:
      "Sim. Registre suas cargas, séries e repetições para acompanhar sua evolução ao longo do tempo.",
  },
  {
    id: 5,
    question: "Meus dados ficam salvos?",
    answer:
      "Sim. Todas as suas informações ficam armazenadas na sua conta para acesso a qualquer momento.",
  },
  {
    id: 6,
    question: "Como acompanho meu progresso?",
    answer:
      "Através de estatísticas, histórico de treinos e gráficos de evolução conforme você atualiza suas cargas.",
  },
];

export default function Asks() {
  const [openAsk, setOpenAsk] = useState<number | null>(null);

  function handleOpenAsk(id: number) {
    setOpenAsk((prev) => (prev === id ? null : id));
  }

  return (
    <section
      id="duvidas"
      className="bg-[#121212] pt-24 border-t border-white/5 flex flex-col justify-between min-h-screen"
    >
      <div className="max-w-4xl mx-auto px-6 w-full">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-[#39FF14]/10 text-[#39FF14] text-xs font-bold tracking-widest uppercase mb-4 border border-[#39FF14]/20">
            Dúvidas Frequentes
          </span>

          <h2 className="text-white text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            PERGUNTAS <span className="text-[#39FF14]">FREQUENTES</span>
          </h2>
        </div>

        <div className="space-y-4">
          {asks.map((item) => {
            const isOpen = openAsk === item.id;
            return (
              <div
                key={item.id}
                className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "border-[#39FF14]/40 bg-white/[0.07] shadow-lg shadow-[#39FF14]/5"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <button
                  onClick={() => handleOpenAsk(item.id)}
                  className="w-full px-6 py-5 flex justify-between items-center text-left cursor-pointer focus:outline-none"
                >
                  <span className="font-semibold text-white text-base sm:text-lg pr-4">
                    {item.question}
                  </span>
                  <div
                    className={`p-1.5 rounded-lg transition-colors ${isOpen ? "bg-[#39FF14]/10 text-[#39FF14]" : "text-zinc-400"}`}
                  >
                    <ChevronDown
                      size={20}
                      className={`transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                <div
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-40 pb-5 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-zinc-400 text-sm sm:text-base leading-relaxed border-t border-white/5 pt-3">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <footer className="mt-24 border-t border-white/10 py-8 px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#39FF14]/10 border border-[#39FF14]/20">
              <Dumbbell size={20} className="text-[#39FF14]" />
            </div>
            <span className="text-white font-black tracking-wider text-lg">
              HEVOLVE
            </span>
          </div>

          <p className="text-xs text-zinc-500 text-center md:text-right">
            © 2026 Hevolve. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </section>
  );
}
