type CardFichaProps = {
  nome: string;
  series: number;
  repeticoes: number;
};
export default function CardFichaExercicios({
  nome,
  series,
  repeticoes,
}: CardFichaProps) {
  return (
    <div className="bg-[#121212] border border-white/10 rounded-lg p-3 flex flex-col gap-2 w-full max-w-xs">
      <span className="text-sm font-semibold text-white">{nome}</span>

      <div className="flex justify-between text-xs text-white/70">
        <span>Séries: {series}</span>
        <span>Reps: {repeticoes}</span>
      </div>
    </div>
  );
}
