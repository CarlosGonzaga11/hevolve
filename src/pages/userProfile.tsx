import { Calendar, Mail, Target, User2, LogOut, LogIn } from "lucide-react";
import CardUser from "../components/cardUser";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase"; // Importado para disparar o login do Google

export default function UserProfile() {
  const { user, loading, logout } = useAuth();
  
  // Função para disparar o login do Google caso ele não esteja logado
  const handleLoginGoogle = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard/user' // Volta direto para cá pós-login
        }
      });
    } catch (error) {
      console.error("Erro ao iniciar login com Google:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center min-h-screen text-zinc-500 animate-pulse bg-[#09090b]">
        Carregando perfil...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col w-full items-center justify-center min-h-[70vh] px-6 text-[#FAFAFA]">
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-md w-full text-center shadow-xl">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-750">
            <User2 size={32} className="text-zinc-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Acesse sua conta</h2>
          <p className="text-zinc-400 text-sm mb-6">
            Você não está conectado. Faça login para acompanhar seus treinos, evoluções e conquistas no Hevolve.
          </p>
          
          <button
            onClick={handleLoginGoogle}
            className="flex items-center justify-center gap-3 w-full py-3 bg-white hover:bg-zinc-150 text-black font-semibold rounded-xl transition-all shadow-md"
          >
            <LogIn size={18} />
            Entrar com o Google
          </button>
        </div>
      </div>
    );
  }

  const nomeReal = user.user_metadata?.full_name || "Usuário Hevolve";
  const emailReal = user.email || "Sem e-mail cadastrado";
  const fotoPerfil = user.user_metadata?.avatar_url;

  return (
    <div className="flex flex-col w-full text-[#FAFAFA]">
      <div className="mt-12 px-6 flex items-center gap-4">
        {fotoPerfil ? (
          <img 
            src={fotoPerfil} 
            alt={nomeReal} 
            className="w-16 h-16 rounded-full border-2 border-[#22c55e] object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-zinc-750 flex items-center justify-center">
            <User2 size={32} className="text-zinc-400" />
          </div>
        )}
        
        <div>
          <h1 className="uppercase text-2xl font-bold">Meu perfil</h1>
          <p className="text-sm text-zinc-400">Bem-vindo de volta!</p>
        </div>
      </div>

      <div className="mt-8 flex w-full flex-col px-6 gap-2">
        <CardUser
          icon={<User2 color="#22c55e" />}
          title="Nome"
          subject={nomeReal}
        />

        <CardUser
          icon={<Mail color="#22c55e" />}
          title="Email"
          subject={emailReal}
        />
        
        <CardUser
          icon={<Target color="#22c55e" />}
          title="Objetivo"
          subject="Hipertrofia"
        />

        <CardUser
          icon={<Calendar color="#22c55e" />}
          title="Plano"
          subject="Gratuito"
        />
        
<div className="flex max-w-lg">
          <button 
          onClick={logout}
          className=" cursor-pointer mt-6 flex items-center justify-center gap-2 w-full py-3 bg-zinc-900 border border-red-900/30 hover:bg-red-950/20 text-red-500 rounded-xl transition-all font-semibold"
        >
          <LogOut size={18} />
          Desconectar Conta
        </button>
</div>
      </div>
    </div>
  );
}