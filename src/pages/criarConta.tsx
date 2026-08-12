import { Dumbbell, Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import { supabase } from "../supabase";
import { FcGoogle } from "react-icons/fc";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function Register() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard/treino", { replace: true });
    }
  }, [user, loading, navigate]);

  async function signInWithGoogle() {
    setIsAuthenticating(true);
    setErrorMessage(null);

    try {
      const redirectUrl = `${window.location.origin}/dashboard/treino`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        setIsAuthenticating(false);
        setErrorMessage(error.message);
        console.error("Erro no login:", error.message);
      }
    } catch (err) {
      setIsAuthenticating(false);
      setErrorMessage("Ocorreu um erro inesperado ao conectar com o Google.");
      console.error("Erro inesperado:", err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center gap-3 text-white">
        <Loader2 className="animate-spin text-[#22c55e]" size={36} />
        <p className="text-zinc-400 text-sm font-medium">
          Validando sua sessão...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#22c55e]/10 rounded-full blur-[120px] pointer-events-none" />

      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium"
      >
        <ArrowLeft size={18} />
        <span>Voltar ao início</span>
      </Link>

      <div className="max-w-md w-full relative z-10 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20 shadow-lg shadow-[#22c55e]/5">
            <Dumbbell size={28} className="text-[#22c55e]" />
          </div>
          <span className="text-3xl font-black tracking-wider text-white">
            HEVOLVE
          </span>
        </div>

        <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
            Bem-vindo de volta!
          </h2>

          <p className="text-center text-zinc-400 text-sm mt-2 mb-8">
            Acesse sua conta para organizar seus treinos e acompanhar sua
            evolução.
          </p>

          {errorMessage && (
            <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle size={18} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            onClick={signInWithGoogle}
            disabled={isAuthenticating}
            className="cursor-pointer w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-100 text-zinc-900 py-3.5 px-4 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {isAuthenticating ? (
              <>
                <Loader2 className="animate-spin text-zinc-900" size={20} />
                <span>Conectando ao Google...</span>
              </>
            ) : (
              <>
                <FcGoogle
                  size={22}
                  className="group-hover:scale-110 transition-transform"
                />
                <span>Continuar com Google</span>
              </>
            )}
          </button>

          <p className="text-center text-xs text-zinc-500 mt-6 leading-relaxed">
            Ao continuar você concorda com nossos{" "}
            <a href="#" className="underline hover:text-zinc-400">
              Termos de Uso
            </a>{" "}
            e{" "}
            <a href="#" className="underline hover:text-zinc-400">
              Política de Privacidade
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
