import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import Loader from "../components/loader";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error || !session) {
        console.error("Erro ao validar login no callback:", error);
        navigate("/", { replace: true });
      } else {
        navigate("/dashboard/treino", { replace: true });
      }
    });
  }, [navigate]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black">
      <Loader />
    </div>
  );
}