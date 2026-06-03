import { Dumbbell } from "lucide-react";

export default function Header() {
  return (
    <header className="flex justify-between px-6 py-4 bg-[#4ADE80] shadow-sm ">
      <div className="flex flex-row items-center gap-2 ">
        <span>
          <Dumbbell size={24} color="#166534" />
        </span>
        <span className="text-2xl font-bold text-[#111827]">HEVOLVE</span>
      </div>
      <div className="sm:flex items-center hidden ">
        <nav className="flex gap-6 text-[#111827] font-medium">
          <ul className="flex gap-6">
            <li>
              <a  href="#como-funciona"className="cursor-pointer  hover:text-[#064E3B] transition-colors duration-200">
                Como Funciona
              </a>
            </li>
            <li>
              <a href="#beneficios" className="cursor-pointer hover:text-[#064E3B] transition-colors duration-200">
                Beneficios
              </a>
            </li>
            <li>
              <a href="#duvidas" className="cursor-pointer  hover:text-[#064E3B] transition-colors duration-200">
                Dúvidas
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
