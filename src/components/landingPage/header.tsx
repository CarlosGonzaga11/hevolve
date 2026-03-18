import { Dumbbell } from "lucide-react";

export default function Header() {
  return (
    <header className="flex border border-b-[#D9D9D9] justify-between px-6 py-4 bg-[#1C1C1C]">
      <div className="flex flex-row items-center gap-2">
        <span>
          <Dumbbell size={24} color="#2E7D32" />
        </span>
        <span className="text-[#FAFAFA] text-2xl"> Evolve</span>
      </div>
      <div className="sm:flex items-center hidden">
        <nav className="flex gap-4 text-[#B3B3B3] transition-all duration-150">
          <ul>
            <li>
              <a className="hover:text-[#FAFAFA]">Como Funciona</a>
            </li>
          </ul>
          <ul>
            <li>
              <a className="hover:text-[#FAFAFA]">Beneficios</a>
            </li>
          </ul>
          <ul>
            <li>
              <a className="hover:text-[#FAFAFA]">Planos</a>
            </li>
          </ul>
          <ul>
            <li>
              <a className="hover:text-[#FAFAFA]">FAQ</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
