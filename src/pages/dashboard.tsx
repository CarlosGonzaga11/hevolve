import {
  BarChart3,
  Dumbbell,
  FilePlus,
  MessageCircle,
  Trash,
  User,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="text-white flex ">
      <div className=" w-75 h-screen bg-[#121212] border-r border-r-[#D9D9D9]/10 ">
        <div className="flex flex-row items-center gap-2 py-4 px-8 border-b border-b-[#D9D9D9]/10">
          <span>
            <Dumbbell color="#22c55e" className="w-10 h-10" />
          </span>
          <span className="uppercase  text-2xl"> Evolve</span>
        </div>
        <div className="mt-8  ">
          <NavLink to="/" className="flex gap-4 px-8 hover:bg-[#22c55e] py-3 ">
            <span>
              <Dumbbell />
            </span>
            <span> Treino</span>
          </NavLink>
          <NavLink
            to="/progress"
            className="flex gap-4 px-8 hover:bg-[#22c55e] py-3"
          >
            <span>
              <BarChart3 />
            </span>
            <span> Progresso</span>
          </NavLink>
          <NavLink
            to="chat"
            className="flex gap-4 px-8 hover:bg-[#22c55e] py-3"
          >
            <span>
              <MessageCircle />
            </span>
            <span> Chat</span>
          </NavLink>
          <NavLink
            to="create"
            className="flex gap-4 px-8 hover:bg-[#22c55e] py-3"
          >
            <span>
              <FilePlus />
            </span>
            <span> Criar Treino</span>
          </NavLink>
          <NavLink
            to="user"
            className="flex gap-4 px-8 hover:bg-[#22c55e] py-3"
          >
            <span>
              <User />
            </span>
            <span> Perfil</span>
          </NavLink>
          <NavLink
            to="lixeira"
            className="flex gap-4 px-8 hover:bg-[#22c55e] py-3"
          >
            <span>
              <Trash />
            </span>
            <span> Lixeira</span>
          </NavLink>
        </div>
      </div>
      <div className="flex flex-col  w-full">
        <Outlet />
      </div>
    </div>
  );
}
