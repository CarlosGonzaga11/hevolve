import {
  ClipboardList,
  Dumbbell,
  History,
  Smartphone,
  Target,
  TrendingUp,
} from "lucide-react";
import CardBenefits from "./cardBenefits";

export default function Benefits() {
  return (
    <section
      id="beneficios"
      className="bg-[#121212] py-24 border-t border-white/5 relative"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-[#39FF14]/10 text-[#39FF14] text-xs font-bold tracking-widest uppercase mb-4 border border-[#39FF14]/20">
            Benefícios
          </span>

          <h2 className="text-white text-3xl sm:text-5xl font-extrabold tracking-tight max-w-3xl leading-tight">
            ACOMPANHE SUA EVOLUÇÃO DE FORMA{" "}
            <span className="text-[#39FF14]">INTELIGENTE</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardBenefits
            icon={<Target size={26} className="text-[#39FF14]" />}
            title="Monte Seu Próprio Treino"
            text="Crie fichas personalizadas de acordo com seus objetivos e estilo de treino."
          />

          <CardBenefits
            icon={<ClipboardList size={26} className="text-[#39FF14]" />}
            title="Treinos Organizados"
            text="Tenha todas as suas fichas de treino organizadas e acessíveis sempre que precisar."
          />

          <CardBenefits
            icon={<Dumbbell size={26} className="text-[#39FF14]" />}
            title="Progressão de Carga"
            text="Registre pesos, repetições e acompanhe sua evolução exercício por exercício."
          />

          <CardBenefits
            icon={<TrendingUp size={26} className="text-[#39FF14]" />}
            title="Evolução Constante"
            text="Visualize seu progresso e saiba exatamente quando aumentar a carga."
          />

          <CardBenefits
            icon={<Smartphone size={26} className="text-[#39FF14]" />}
            title="Acesso em Qualquer Lugar"
            text="Consulte seus treinos pelo celular, tablet ou computador sem precisar de papel."
          />

          <CardBenefits
            icon={<History size={26} className="text-[#39FF14]" />}
            title="Histórico de Treinos"
            text="Consulte treinos anteriores e acompanhe sua evolução ao longo do tempo."
          />
        </div>
      </div>
    </section>
  );
}
