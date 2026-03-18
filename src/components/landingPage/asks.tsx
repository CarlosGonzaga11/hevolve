import { ChevronDown, Dumbbell } from "lucide-react";
import { useState } from "react";

const asks = [
  {
    id: 1,
    question: "Preciso ter experiência para começar?",
    answer:
      "Não! Nossos treinos são adaptados para todos os níveis, do iniciante ao avançado.",
  },
  {
    id: 2,
    question: "Quantas vezes por semana devo treinar?",
    answer: "O ideal é de 3 a 5 vezes por semana, dependendo do seu objetivo.",
  },
  {
    id: 3,
    question: "Os treinos são feitos para academia ou casa?",
    answer:
      "Ambos! Você pode escolher treinar com equipamentos de academia ou com opções para casa.",
  },
  {
    id: 4,
    question: "Como funciona o contato com o treinador?",
    answer:
      "Você tem acesso direto ao seu treinador pelo chat da plataforma, podendo tirar dúvidas a qualquer momento.",
  },
  {
    id: 5,
    question: "De quanto em quanto tempo o treino é atualizado?",
    answer:
      "Depende do seu plano. No plano Básico é mensal, no Pro quinzenal e no Elite semanal",
  },
  {
    id: 6,
    question: "Posso cancelar a qualquer momento?",
    answer:
      "Sim! Não há fidelidade. Você pode cancelar quando quiser, sem taxas extras.",
  },
];

export default function Asks() {
  const [openAsk, setOpenAsk] = useState(null);

  function handleOpenAsk(id) {
    setOpenAsk((prev) => (prev === id ? null : id));
  }
  return (
    <section className="bg-[#121212]  ">
      <div className="flex flex-col items-center">
        <span className="text-[#4CAF50] uppercase tracking-[0.3em] font-semibold">
          faq
        </span>
        <h2 className="text-[#FFFFFF] text-5xl font-bold p-2">
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
                    <ChevronDown size={14} color="#FAFAFA" />
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
          <span className="text-[#FAFAFA] text-lg">EVOLVE</span>
        </div>
        <p className="px-8 text-sm text-[#B3B3B3]">
          © 2026 Evolve. Todos os direitos reservados.
        </p>
      </footer>
    </section>
  );
}
