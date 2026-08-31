import {
  Calendar,
  Mail,
  Target,
  User2,
  LogOut,
  LogIn,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import CardUser from "../components/cardUser";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase";
import Loader from "../components/loader";

export default function UserProfile() {
  const { user, loading, logout } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

const handleLoginGoogle = async () => {
  try {
    setIsLoggingIn(true);

    const redirectTo = window.location.origin + window.location.pathname;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (error) throw error;
  } catch (error) {
    console.error("Erro no login:", error);
    setIsLoggingIn(false);
  }
};

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center min-h-screen bg-black">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col w-full items-center justify-center min-h-[70vh] px-6 text-[#FAFAFA]">
        <div className="bg-[#121212] border border-white/10 p-8 rounded-2xl max-w-md w-full text-center shadow-xl backdrop-blur-md">
          <div className="w-16 h-16 bg-zinc-800/80 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-700">
            <User2 size={32} className="text-zinc-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-white">
            Acesse sua conta
          </h2>
          <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
            Você não está conectado. Faça login para acompanhar seus treinos,
            evoluções e conquistas no Hevolve.
          </p>

          <button
            onClick={handleLoginGoogle}
            disabled={isLoggingIn}
            className="flex items-center justify-center gap-3 w-full py-3 bg-white hover:bg-zinc-200 disabled:opacity-70 text-black font-semibold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoggingIn ? (
              <Loader2 size={18} className="animate-spin text-black" />
            ) : (
              <LogIn size={18} />
            )}
            <span>
              {isLoggingIn ? "Redirecionando..." : "Entrar com o Google"}
            </span>
          </button>
        </div>
      </div>
    );
  }

  const nomeReal = user.user_metadata?.full_name || "Usuário Hevolve";
  const emailReal = user.email || "Sem e-mail cadastrado";
  const fotoPerfil = user.user_metadata?.avatar_url;

  return (
    <div className="flex flex-col w-full text-[#FAFAFA] min-h-screen bg-black pb-12">
      <div className="mt-16  px-6 flex items-center gap-4">
        {fotoPerfil ? (
          <img
            src={fotoPerfil}
            alt={nomeReal}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-full border-2 border-[#22c55e] object-cover shadow-md"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center">
            <User2 size={32} className="text-zinc-400" />
          </div>
        )}

        <div>
          <h1 className="uppercase text-2xl font-bold tracking-tight text-white">
            Meu perfil
          </h1>
          <p className="text-sm text-zinc-400">Bem-vindo de volta!</p>
        </div>
      </div>

      <div className="mt-8 flex w-full flex-col px-6 gap-2 max-w-lg">
        <CardUser
          icon={<User2 color="#22c55e" size={20} />}
          title="Nome"
          subject={nomeReal}
        />

        <CardUser
          icon={<Mail color="#22c55e" size={20} />}
          title="Email"
          subject={emailReal}
        />

        <CardUser
          icon={<Target color="#22c55e" size={20} />}
          title="Objetivo"
          subject="Hipertrofia"
        />

        <CardUser
          icon={<Calendar color="#22c55e" size={20} />}
          title="Plano"
          subject="Gratuito"
        />
        <button
          onClick={logout}
          className="cursor-pointer mt-6 flex items-center justify-center gap-2 w-full py-3 bg-[#121212] border border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40 text-red-500 rounded-xl transition-all duration-200 font-semibold active:scale-98"
        >
          <LogOut size={18} />
          <span>Desconectar Conta</span>
        </button>
      </div>
    </div>
  );
}
