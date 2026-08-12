import {
  BarChart3,
  Dumbbell,
  FilePlus,
  LogOut,
  MessageCircle,
  Trash,
  User,
  X,
  Menu,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function Dashboard() {
  const [open, setIsOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const navigate = useNavigate();

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Erro ao encerrar sessão:", error);
      return;
    }
    navigate("/registro");
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 p-2.5 rounded transition-colors font-medium ${
      isActive
        ? "bg-[#22c55e] text-black font-bold"
        : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
    }`;

  return (
    <div className="text-white flex min-h-screen bg-black">
      {open && (
        <div className="fixed inset-0 z-50 sm:hidden flex">
          <div
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
          />

          <div className="relative z-10 h-full w-64 bg-[#121212] p-4 flex flex-col justify-between border-r border-white/10">
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="font-black text-lg text-[#22c55e] tracking-wider">
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
                  to="treino"
                  onClick={() => setIsOpen(false)}
                  className={getNavLinkClass}
                >
                  <Dumbbell size={20} />
                  <span>Treino</span>
                </NavLink>

                <NavLink
                  to="progress"
                  onClick={() => setIsOpen(false)}
                  className={getNavLinkClass}
                >
                  <BarChart3 size={20} />
                  <span>Progresso</span>
                </NavLink>

                <NavLink
                  to="chat"
                  onClick={() => setIsOpen(false)}
                  className={getNavLinkClass}
                >
                  <MessageCircle size={20} />
                  <span>Chat</span>
                </NavLink>

                <NavLink
                  to="create"
                  onClick={() => setIsOpen(false)}
                  className={getNavLinkClass}
                >
                  <FilePlus size={20} />
                  <span>Criar Treino</span>
                </NavLink>

                <NavLink
                  to="user"
                  onClick={() => setIsOpen(false)}
                  className={getNavLinkClass}
                >
                  <User size={20} />
                  <span>Perfil</span>
                </NavLink>

                <NavLink
                  to="lixeira"
                  onClick={() => setIsOpen(false)}
                  className={getNavLinkClass}
                >
                  <Trash size={20} />
                  <span>Lixeira</span>
                </NavLink>
              </nav>
            </div>

            {user && (
              <div className="border-t border-white/10 pt-4">
                <div className="flex gap-3 items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="Perfil"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="text-zinc-400" size={20} />
                    )}
                  </div>
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
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-colors border border-red-500/20 text-sm font-medium cursor-pointer"
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
          className="sm:hidden fixed top-4 left-4 z-40 bg-[#121212] border border-white/10 p-2.5 rounded-lg text-white shadow-lg cursor-pointer hover:bg-zinc-800"
        >
          <Menu size={20} />
        </button>
      )}

      <aside className="hidden md:flex flex-col w-72 justify-between h-screen bg-[#121212] border-r border-white/10 sticky top-0 shrink-0">
        <div>
          <Link
            to="/"
            className="flex flex-row items-center gap-3 py-5 px-6 border-b border-white/10"
          >
            <Dumbbell className="w-8 h-8 text-[#22c55e]" />
            <span className="uppercase text-xl font-black tracking-wider text-white">
              HEVOLVE
            </span>
          </Link>

          <div className="mt-6 px-4">
            <nav className="flex flex-col gap-1.5">
              <NavLink to="treino" className={getNavLinkClass}>
                <Dumbbell size={20} />
                <span>Treino</span>
              </NavLink>

              <NavLink to="progress" className={getNavLinkClass}>
                <BarChart3 size={20} />
                <span>Progresso</span>
              </NavLink>

              <NavLink to="chat" className={getNavLinkClass}>
                <MessageCircle size={20} />
                <span>Chat AI</span>
              </NavLink>

              <NavLink to="create" className={getNavLinkClass}>
                <FilePlus size={20} />
                <span>Criar Treino</span>
              </NavLink>

              <NavLink to="user" className={getNavLinkClass}>
                <User size={20} />
                <span>Perfil</span>
              </NavLink>

              <NavLink to="lixeira" className={getNavLinkClass}>
                <Trash size={20} />
                <span>Lixeira</span>
              </NavLink>
            </nav>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-3 px-5 py-4 border-t border-white/10 bg-zinc-950/40">
            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="text-zinc-400" size={20} />
              )}
            </div>

            <div className="flex flex-col overflow-hidden min-w-0 flex-1">
              <span className="font-bold text-sm truncate text-white">
                {user.user_metadata?.full_name || "Usuário"}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-medium transition cursor-pointer mt-0.5"
              >
                <LogOut size={14} />
                <span>Sair</span>
              </button>
            </div>
          </div>
        )}
      </aside>

      <main className="flex-1 h-screen overflow-y-auto bg-black">
        <Outlet />
      </main>
    </div>
  );
}
