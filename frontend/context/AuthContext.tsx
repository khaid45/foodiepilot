"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { getCurrentUser } from "@/lib/api";

type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    const validateSavedToken = async () => {
      const savedToken =
        localStorage.getItem("foodiepilot_token");

      if (!savedToken) {
        return;
      }

      try {
        await getCurrentUser(savedToken);
        setTokenState(savedToken);
      } catch {
        localStorage.removeItem("foodiepilot_token");
        setTokenState(null);
      }
    };

    validateSavedToken();
  }, []);

  const setToken = (newToken: string) => {
    localStorage.setItem(
      "foodiepilot_token",
      newToken
    );

    setTokenState(newToken);
  };

  const logout = () => {
    localStorage.removeItem("foodiepilot_token");
    setTokenState(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        setToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return context;
}