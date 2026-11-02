
"use client";

import { getProfile } from "@/services/auth.service";
import type { User } from "@/types/user";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef
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
  console.log("AUTH CONTEXT STATE:", {
  user,
  isLoading,
});

  const refreshProfile = async (): Promise<User | null> => {
  const requestId = ++profileRequestId.current;

  try {
    console.log("MULAI REFRESH PROFILE");
    const profile = await getProfile();
     console.log("PROFILE BERHASIL:", profile);

    setUser(profile)

   return profile;
    
  } catch (error) {
    console.error("PROFILE GAGAL:", error);

    setUser(null)
    return null;
  } finally {
    console.log("PROFILE SELESAI, LOADING FALSE");
    setIsLoading(false);
  }
};

  useEffect(() => {
    const loadProfile = async () => {
      console.log("MULAI LOAD PROFILE");
      await refreshProfile();
      console.log("PROFILE SELESAI");

    };

    loadProfile();
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
