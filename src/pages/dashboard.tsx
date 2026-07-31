import {
  BarChart3,
  Dumbbell,
  FilePlus,
  LogOut,
  MessageCircle,
  Trash,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function Dashboard() {
  const [open, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
      return;
    }
    navigate("/registro");
  }

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log(user);
      setUser(user);
    }
    loadUser();
  }, []);

  return (
    <div className="text-white flex min-h-screen">
      {open && (
        <div className="fixed inset-0 z-50 sm:hidden flex">
          <div
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          />

          <div className="relative z-10 h-full w-64 bg-[#121212] p-4 flex flex-col justify-between border-r border-white/10">
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="font-black text-lg text-[#22c55e]">
                  HEVOLVE
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white p-1"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="flex flex-col gap-2">
                <NavLink
                  to="/dashboard/treino"
                  onClick={() => setIsOpen(false)}
                  className="flex gap-3 p-2.5 hover:bg-[#22c55e] rounded transition-colors"
                >
                  <Dumbbell size={20} /> Treino
                </NavLink>

                <NavLink
                  to="/dashboard/progress"
                  onClick={() => setIsOpen(false)}
                  className="flex gap-3 p-2.5 hover:bg-[#22c55e] rounded transition-colors"
                >
                  <BarChart3 size={20} /> Progresso
                </NavLink>

                <NavLink
                  to="/dashboard/create"
                  onClick={() => setIsOpen(false)}
                  className="flex gap-3 p-2.5 hover:bg-[#22c55e] rounded transition-colors"
                >
                  <MessageCircle size={20} /> Chat
                </NavLink>

                <NavLink
                  to="/dashboard/create"
                  onClick={() => setIsOpen(false)}
                  className="flex gap-3 p-2.5 hover:bg-[#22c55e] rounded transition-colors"
                >
                  <FilePlus size={20} /> Criar Treino
                </NavLink>

                <NavLink
                  to="/dashboard/user"
                  onClick={() => setIsOpen(false)}
                  className="flex gap-3 p-2.5 hover:bg-[#22c55e] rounded transition-colors"
                >
                  <User size={20} /> Perfil
                </NavLink>

                <NavLink
                  to="/dashboard/lixeira"
                  onClick={() => setIsOpen(false)}
                  className="flex gap-3 p-2.5 hover:bg-[#22c55e] rounded transition-colors"
                >
                  <Trash size={20} /> Lixeira
                </NavLink>
              </nav>
            </div>

            {user && (
              <div className="border-t border-white/10 pt-4">
                <div className="flex gap-3 items-center mb-3">
                  <img
                    src={
                      user.user_metadata?.avatar_url ||
                      "https://via.placeholder.com/40"
                    }
                    alt="Perfil"
                    className="w-10 h-10 rounded-full border border-white/10 object-cover"
                  />
                  <div className="flex flex-col leading-tight overflow-hidden">
                    <span className="font-bold text-sm truncate">
                      {user.user_metadata?.full_name || "Usuário"}
                    </span>
                    <span className="text-xs text-gray-400 truncate">
                      {user.email}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-colors border border-red-500/20 text-sm font-medium"
                >
                  <LogOut size={16} />
                  <span>Desconectar</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {!open && (
        <button
          onClick={() => setIsOpen(true)}
          className="sm:hidden fixed top-4 left-4 z-40 bg-[#121212] border border-white/10 p-2.5 rounded text-white shadow-lg"
        >
          ☰
        </button>
      )}

      {/* pc*/}
      <div className="hidden md:flex flex-col w-75 justify-between h-screen bg-[#121212] border-r border-[#D9D9D9]/10 sticky top-0">
        <div>
          <Link
            to="/"
            className="flex flex-row items-center gap-2 py-4 px-8 border-b border-[#D9D9D9]/10"
          >
            <Dumbbell color="#22c55e" className="w-10 h-10" />
            <span className="uppercase text-2xl font-black tracking-wider">
              HEVOLVE
            </span>
          </Link>
          <div className="mt-8 text-base flex px-4 flex-col">
            <nav className="flex flex-col gap-2">
              <NavLink
                to="treino"
                className="flex gap-3 p-2.5 hover:bg-[#22c55e] rounded transition-colors"
              >
                <Dumbbell size={22} />
                <span>Treino</span>
              </NavLink>
              <NavLink
                to="progress"
                className="flex gap-3 p-2.5 hover:bg-[#22c55e] rounded transition-colors"
              >
                <BarChart3 size={22} />
                <span>Progresso</span>
              </NavLink>
              <NavLink
                to="create"
                className="flex gap-3 p-2.5 hover:bg-[#22c55e] rounded transition-colors"
              >
                <FilePlus size={22} />
                <span>Criar Treino</span>
              </NavLink>
              <NavLink
                to="user"
                className="flex gap-3 p-2.5 hover:bg-[#22c55e] rounded transition-colors"
              >
                <User size={22} />
                <span>Perfil</span>
              </NavLink>
              <NavLink
                to="lixeira"
                className="flex gap-3 p-2.5 hover:bg-[#22c55e] rounded transition-colors"
              >
                <Trash size={22} />
                <span>Lixeira</span>
              </NavLink>
            </nav>
          </div>
        </div>

        {user && (
          <div className="flex gap-4 items-center px-6 py-6 border-t border-white/10">
            <img
              src={
                user.user_metadata?.avatar_url ||
                "https://via.placeholder.com/40"
              }
              alt="Perfil"
              className="w-10 h-10 rounded-full border border-white/10 object-cover"
            />
            <div className="flex flex-col items-start leading-none overflow-hidden gap-2">
              <span className="font-bold truncate max-w-[120px]">
                {user.user_metadata?.full_name || "Usuário"}
              </span>
              <button
                onClick={handleLogout}
                className="cursor-pointer  flex items-center justify-c gap-2  px-3 
                 hover:bg-red-500/20 text-red-400 rounded transition-colors 
                  border-red-500/20 text-sm font-medium"
              >
                <LogOut size={16} />
                <span>Sair</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 h-screen overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
