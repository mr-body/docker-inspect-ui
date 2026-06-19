"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getSessionAction } from "@/service/auth-actions";

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  access_token: string | null | undefined;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [access_token, setAcessToken] = useState<string | null>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);

  const checkSession = async () => {
    try {
      const session = await getSessionAction();
      if (session?.token) {
        setAcessToken(session?.token);
        setIsAuthenticated(true);
        setUsername("admin");
      } else {
        setIsAuthenticated(false);
        setUsername(null);
      }
    } catch (e) {
      setIsAuthenticated(false);
      setUsername(null);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, checkSession, access_token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
