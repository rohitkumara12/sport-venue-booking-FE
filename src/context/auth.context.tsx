
"use client";

import { getProfile } from "@/services/auth.service";
import type { User } from "@/types/user";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshProfile: () => Promise<User | null>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const profileRequestId = useRef(0);
  const mounted = useRef(false);

  const refreshProfile = async (): Promise<User | null> => {
    const requestId = ++profileRequestId.current;

    try {
      const profile = await getProfile();

      if (mounted.current && requestId === profileRequestId.current) {
        setUser(profile);
      }

      return profile;
    } catch (error) {
      console.error("Gagal mengambil profile:", error);

      if (mounted.current && requestId === profileRequestId.current) {
        setUser(null);
      }

      return null;
    } finally {
      if (mounted.current && requestId === profileRequestId.current) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    mounted.current = true;
    refreshProfile();

    return () => {
      mounted.current = false;
      profileRequestId.current++;
    };
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    refreshProfile,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
