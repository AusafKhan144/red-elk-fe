import { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react";
import { supabase } from "../lib/supabase";
import api from "../lib/api";
import type { User } from "../types/api";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  waitForUserLoad: () => Promise<User>;
  reloadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const userLoadResolversRef = useRef<Array<(user: User) => void>>([]);

  async function loadUser() {
    try {
      const { data } = await api.get<User>("/auth/me");
      setUser(data);
      userLoadResolversRef.current.forEach((resolve) => resolve(data));
      userLoadResolversRef.current = [];
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  function waitForUserLoad(): Promise<User> {
    return new Promise((resolve) => {
      if (user) {
        resolve(user);
      } else {
        userLoadResolversRef.current.push(resolve);
      }
    });
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        loadUser();
      } else {
        setIsLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        loadUser();
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, logout, waitForUserLoad, reloadUser: loadUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
