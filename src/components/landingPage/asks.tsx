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
      "Através de estatísticas, histórico de treinos e conquistas desbloqueadas conforme sua evolução.",
  },
];

export default function Asks() {
  const [openAsk, setOpenAsk] = useState(null);

  function handleOpenAsk(id) {
    setOpenAsk((prev) => (prev === id ? null : id));
  }
  return (
    <section id="duvidas" className="bg-[#121212]  ">
      <div className="flex flex-col items-center">
        <span className="text-[#4CAF50] uppercase tracking-widest font-semibold">
          DÚVIDAS
        </span>
        <h2 className="text-[#FFFFFF] text-4xl sm:text-5xl font-bold p-2 text-center">
          PERGUNTAS FREQUENTES
        </h2>
      </div>
      <div className=" pt-14">
        <div className="px-6 mx-auto max-w-2xl grid-cols-1 grid gap-3">
          {asks.map((item) => {
            const isOpen = openAsk === item.id;
            return (
              <div className="border border-[#B3B3B3]/10 px-6 relative rounded  bg-white/10 ">
                <div onClick={() => handleOpenAsk(item.id)}>
                  <div className="absolute right-8 top-5">
                    <ChevronDown
                      size={14}
                      color="#FAFAFA"
                      className={`transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  <div className="p-4">
                    <span className="font-semibold text-[#FAFAFA] text-sm ">
                      {item.question}
                    </span>
                  </div>
                </div>
                <div
                  className={`px-4
                 overflow-hidden transition-all duration-300 ease-in-out
                 ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <p className="transition-all  duration-200 text-[#B3B3B3] text-sm py-2 ">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <footer className="py-12 flex flex-col items-center justify-between md:flex-row md:justify-between md:text-left">
        <div className="flex gap-2 px-8">
          <Dumbbell color="#4CAF50" />
          <span className="text-[#FAFAFA] text-lg">HEVOLVE</span>
        </div>
        <p className="px-8 text-sm text-[#B3B3B3]">
          © 2026 Evolve. Todos os direitos reservados.
        </p>
      </footer>
    </section>
  );
}
