import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "../supabase";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function handleAuth() {
      try {
        // 1. Verifica se a URL retornada possui access_token do OAuth
        const fullUrl = window.location.href;
        if (fullUrl.includes("access_token=")) {
          // Extrai o trecho do access_token mesmo se o HashRouter tiver bagunçado a hash
          const hashString = fullUrl.substring(fullUrl.indexOf("access_token="));
          const params = new URLSearchParams(hashString);
          
          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");

          if (accessToken && refreshToken) {
            // Força o Supabase a registrar a sessão no localStorage
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (!error && data.session && isMounted) {
              setUser(data.session.user);
              setLoading(false);
              // Limpa a URL e envia o usuário para o dashboard
              window.history.replaceState(null, "", import.meta.env.BASE_URL);
              window.location.hash = "#/dashboard/treino";
              return;
            }
          }
        }

        // 2. Se não houver tokens na URL, busca a sessão normalmente salva no storage
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted) {
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error("Erro no processamento da autenticação:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    handleAuth();

    // 3. Listener global de mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function logout() {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error("Erro ao realizar logout:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}