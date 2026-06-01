import {
  BarChart3,
  Dumbbell,
  FilePlus,
  MessageCircle,
  Trash,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

export default function Dashboard() {
  const [open, setIsOpen] = useState(true);
  return (
    <div className="text-white flex  ">
      {/* mobile */}

      {open ? (
        <div className="fixed inset-0 z-50 sm:hidden flex ">
          <div
            onClick={() => setIsOpen(false)}
            className={`absolute inset-0 bg-black/50 transition-opacity duration-300
    ${open ? "opacity-100 pointer-events-auto" : "opacity-0"}`}
          />
          <div
            className={`absolute top-0 left-0 h-full w-64 bg-[#121212] p-4
    transform transition-transform duration-300
    ${open ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="flex justify-end">
              <button onClick={() => setIsOpen(false)}>
                <X />
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              <NavLink
                to="/"
                onClick={() => setIsOpen(false)}
                className="flex gap-3 p-2 hover:bg-[#22c55e] rounded"
              >
                <Dumbbell size={20} /> Treino
              </NavLink>

              <NavLink
                to="/progress"
                onClick={() => setIsOpen(false)}
                className="flex gap-3 p-2 hover:bg-[#22c55e] rounded"
              >
                <BarChart3 size={20} /> Progresso
              </NavLink>

              <NavLink
                to="/create"
                onClick={() => setIsOpen(false)}
                className="flex gap-3 p-2 hover:bg-[#22c55e] rounded"
              >
                <MessageCircle size={20} /> Chat
              </NavLink>

              <NavLink
                to="/create"
                onClick={() => setIsOpen(false)}
                className="flex gap-3 p-2 hover:bg-[#22c55e] rounded"
              >
                <FilePlus size={20} /> Criar Treino
              </NavLink>

              <NavLink
                to="/user"
                onClick={() => setIsOpen(false)}
                className="flex gap-3 p-2 hover:bg-[#22c55e] rounded"
              >
                <User size={20} /> Perfil
              </NavLink>

              <NavLink
                to="/lixeira"
                onClick={() => setIsOpen(false)}
                className="flex gap-3 p-2 hover:bg-[#22c55e] rounded"
              >
                <Trash size={20} /> Lixeira
              </NavLink>
            </nav>
          </div>
        </div>
      ) : (
        <></>
      )}
      {open ? (
        <></>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="sm:hidden fixed top-4 left-4 z-50 bg-[#121212] p-2 rounded flex justify-end"
        >
          ☰
        </button>
      )}
      {/* pc */}
      <div className="hidden md:flex flex-col w-75 h-screen bg-[#121212] border-r border-r-[#D9D9D9]/10 ">
        <Link
          to="/"
          className="flex flex-row items-center gap-2 py-4 px-8 border-b border-b-[#D9D9D9]/10"
        >
          <span>
            <Dumbbell color="#22c55e" className="w-10 h-10" />
          </span>
          <span className="uppercase  text-2xl"> hevolve</span>
        </Link>
        <div className="mt-8 text-base">
          <NavLink
            to="/"
            className="flex items-center gap-4 px-8 hover:bg-[#22c55e] hover:text-[#f3f3f3]  py-3 "
          >
            <span>
              <Dumbbell size={22} />
            </span>
            <span> Treino</span>
          </NavLink>
          <NavLink
            to="/progress"
            className="flex items-center gap-4 px-8 hover:bg-[#22c55e] hover:text-[#f3f3f3] py-3"
          >
            <span>
              <BarChart3 size={22} />
            </span>
            <span> Progresso</span>
          </NavLink>
          {/* <NavLink
            to="create"
            className="flex items-center gap-4 px-8 hover:bg-[#22c55e] hover:text-[#f3f3f3] py-3"
          >
            <span>
              <MessageCircle size={22} />
            </span>
            <span> Chat</span>
          </NavLink> */}
          <NavLink
            to="create"
            className="flex items-center gap-4 px-8 hover:bg-[#22c55e] hover:text-[#f3f3f3] py-3"
          >
            <span>
              <FilePlus size={22} />
            </span>
            <span> Criar Treino</span>
          </NavLink>

          <NavLink
            to="user"
            className="flex items-center gap-4 px-8 hover:bg-[#22c55e] hover:text-[#f3f3f3] py-3"
          >
            <span>
              <User size={22} />
            </span>
            <span> Perfil</span>
          </NavLink>
          <NavLink
            to="lixeira"
            className="flex items-center  gap-4 px-8 hover:bg-[#22c55e] hover:text-[#f3f3f3] py-3"
          >
            <span>
              <Trash size={22} />
            </span>
            <span> Lixeira</span>
          </NavLink>
        </div>
      </div>
      <div className="flex flex-col  w-full h-screen overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
