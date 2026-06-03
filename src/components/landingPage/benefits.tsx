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
    <section id="beneficios" className="bg-[#242121] py-20">
      <div className="flex flex-col items-center text-center">
        <span className="text-[#39FF14] p-2 tracking-widest">
          BENEFÍCIOS 
        </span>

        <h2 className="text-white text-3xl sm:text-5xl font-bold max-w-4xl px-4">
          ACOMPANHE SUA EVOLUÇÃO DE FORMA INTELIGENTE
        </h2>
      </div>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-4">
        <CardBenefits
          icon={<Target size={28} color="#4ADE80" />}
          title="Monte Seu Próprio Treino"
          text="Crie fichas personalizadas de acordo com seus objetivos e estilo de treino."
        />

        <CardBenefits
          icon={<ClipboardList size={28} color="#4ADE80" />}
          title="Treinos Organizados"
          text="Tenha todas as suas fichas de treino organizadas e acessíveis sempre que precisar."
        />

        <CardBenefits
          icon={<Dumbbell size={28} color="#4ADE80" />}
          title="Progressão de Carga"
          text="Registre pesos, repetições e acompanhe sua evolução exercício por exercício."
        />

        <CardBenefits
          icon={<TrendingUp size={28} color="#4ADE80" />}
          title="Evolução Constante"
          text="Visualize seu progresso e saiba exatamente quando aumentar a carga."
        />

        <CardBenefits
          icon={<Smartphone size={28} color="#4ADE80" />}
          title="Acesso em Qualquer Lugar"
          text="Consulte seus treinos pelo celular, tablet ou computador sem precisar de papel."
        />

        <CardBenefits
          icon={<History size={28} color="#4ADE80" />}
          title="Histórico de Treinos"
          text="Consulte treinos anteriores e acompanhe sua evolução ao longo do tempo."
        />
      </div>
    </section>
  );
}