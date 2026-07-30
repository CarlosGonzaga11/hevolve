import { ClipboardList, TrendingUp, User } from "lucide-react";

export default function HowWorks() {
  const steps = [
    {
      step: "01",
      icon: <User size={26} className="text-[#39FF14]" />,
      title: "CRIE SUA CONTA",
      description:
        "Cadastre-se em poucos segundos e personalize seu perfil com seus objetivos, experiência e frequência de treinos.",
    },
    {
      step: "02",
      icon: <ClipboardList size={26} className="text-[#39FF14]" />,
      title: "MONTE SEU TREINO",
      description:
        "Crie fichas personalizadas, organize exercícios, séries e repetições de acordo com a sua rotina.",
    },
    {
      step: "03",
      icon: <TrendingUp size={26} className="text-[#39FF14]" />,
      title: "ACOMPANHE SUA EVOLUÇÃO",
      description:
        "Registre seus treinos, acompanhe cargas, histórico e veja seu progresso real ao longo do tempo.",
    },
  ];

  return (
    <section
      id="como-funciona"
      className="bg-[#121212] py-24 border-t border-white/5 relative"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Cabeçalho */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-[#39FF14]/10 text-[#39FF14] text-xs font-bold tracking-widest uppercase mb-4 border border-[#39FF14]/20">
            Como Funciona
          </span>

          <h2 className="text-white text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            3 PASSOS PARA <span className="text-[#39FF14]">EVOLUIR</span>
          </h2>
        </div>

        {/* Grid de Passos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item) => (
            <div
              key={item.step}
              className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 transition-all duration-300 hover:border-[#39FF14]/40 hover:bg-white/[0.07] hover:-translate-y-1 overflow-hidden"
            >
              {/* Número Destaque de Fundo */}
              <span className="absolute -top-2 right-4 text-7xl font-black text-white/[0.04] group-hover:text-[#39FF14]/10 transition-colors duration-300 select-none pointer-events-none">
                {item.step}
              </span>

              {/* Ícone */}
              <div className="w-12 h-12 rounded-xl bg-[#39FF14]/10 border border-[#39FF14]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>

              {/* Conteúdo */}
              <h3 className="text-xl font-bold text-white mb-3 tracking-wide">
                {item.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
