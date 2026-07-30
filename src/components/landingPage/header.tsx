import { Dumbbell } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-[#121212]/80 border-b border-white/10 px-6 py-4 flex justify-between items-center transition-all">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-[#4ADE80]/10 border border-[#4ADE80]/20">
          <Dumbbell size={24} className="text-[#4ADE80]" />
        </div>
        <span className="text-2xl font-black tracking-wider text-white">
          HEVOLVE
        </span>
      </div>

      <nav className="hidden sm:flex items-center">
        <ul className="flex gap-8 text-zinc-400 font-medium text-sm">
          <li>
            <a
              href="#como-funciona"
              className="hover:text-[#4ADE80] transition-colors duration-200"
            >
              Como Funciona
            </a>
          </li>
          <li>
            <a
              href="#beneficios"
              className="hover:text-[#4ADE80] transition-colors duration-200"
            >
              Benefícios
            </a>
          </li>
          <li>
            <a
              href="#duvidas"
              className="hover:text-[#4ADE80] transition-colors duration-200"
            >
              Dúvidas
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
