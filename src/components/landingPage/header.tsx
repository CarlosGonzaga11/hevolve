import { Dumbbell } from "lucide-react";

export default function Header() {
  const handleScroll = (e, id) => {
    e.preventDefault();
    
    if (!id || id === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-[#121212]/80 border-b border-white/10 px-6 py-4 flex justify-between items-center transition-all">
      <a 
        href="#"
        onClick={(e) => handleScroll(e, "#")}
        className="flex items-center gap-2 cursor-pointer group"
      >
        <div className="p-2 rounded-xl bg-[#4ADE80]/10 border border-[#4ADE80]/20 group-hover:border-[#4ADE80]/40 transition-colors">
          <Dumbbell size={24} className="text-[#4ADE80]" />
        </div>
        <span className="text-2xl font-black tracking-wider text-white">
          HEVOLVE
        </span>
      </a>

      <nav className="hidden sm:flex items-center">
        <ul className="flex gap-8 text-zinc-400 font-medium text-sm">
          <li>
            <a
              href="#como-funciona"
              onClick={(e) => handleScroll(e, "como-funciona")}
              className="hover:text-[#4ADE80] transition-colors duration-200"
            >
              Como Funciona
            </a>
          </li>
          <li>
            <a
              href="#beneficios"
              onClick={(e) => handleScroll(e, "beneficios")}
              className="hover:text-[#4ADE80] transition-colors duration-200"
            >
              Benefícios
            </a>
          </li>
          <li>
            <a
              href="#duvidas"
              onClick={(e) => handleScroll(e, "duvidas")}
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