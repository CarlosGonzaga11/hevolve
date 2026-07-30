import { Dumbbell, Loader2 } from "lucide-react";
import { supabase } from "../supabase";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function Register() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  function signInWithGoogle() {
    setIsAuthenticating(true);
    setTimeout(async () => {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/hevolve/#/dashboard`,
          },
        });

        if (error) {
          setIsAuthenticating(false);
          console.error("Erro no login:", error.message);
        }
      } catch (err) {
        setIsAuthenticating(false);
        console.error("Erro inesperado:", err);
      }
    }, 600);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center gap-3 text-white">
        <Loader2 className="animate-spin text-[#4ADE80]" size={36} />
        <p className="text-gray-400 text-sm">Validando sua sessão...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="flex justify-center items-center gap-2 mb-8">
          <Dumbbell size={32} color="#4ADE80" />
          <h1 className="text-3xl font-bold text-white">HEVOLVE</h1>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
          <h2 className="text-3xl font-bold text-white text-center">
            Bem-vindo
          </h2>

          <p className="text-center text-[#B3B3B3] mt-2 mb-8">
            Entre e acompanhe sua evolução nos treinos.
          </p>

          <button
            onClick={signInWithGoogle}
            disabled={isAuthenticating}
            className="cursor-pointer w-full flex items-center justify-center gap-3 bg-white text-gray-900 py-3 rounded-xl font-medium hover:bg-gray-100 transition disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isAuthenticating ? (
              <>
                <Loader2 className="animate-spin text-gray-900" size={22} />
                Conectando ao Google...
              </>
            ) : (
              <>
                <FcGoogle size={24} />
                Continuar com Google
              </>
            )}
          </button>

          <p className="text-center text-xs text-[#B3B3B3] mt-6">
            Ao continuar você concorda com os Termos de Uso e Política de
            Privacidade.
          </p>
        </div>
      </div>
    </div>
  );
}
