"use client";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { createContext, ReactNode, useEffect, useState } from "react";

interface AuthContextType {
  user: string | undefined;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => void;
  logout: () => void;
  token: string | undefined;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<string | undefined>(undefined);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | undefined>(undefined);
  const pathname = usePathname();
  const router = useRouter();

  const login = async (credentials: { email: string; password: string }) => {
    // apicall
    // set token to local Storage
    // setToken in hook
  };

  const logout = () => {
    setToken(undefined);
    setUser(undefined);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    let token = localStorage.getItem("token");
    token = "sdnasndj";
    if (!token) {
      if (pathname !== "/login") {
        router.push("/login");
      }
      setIsAuthenticated(false);
    } else {
      setToken(token);
      setIsAuthenticated(true);
      // If the user is logged in and visits the login page, redirect them elsewhere
      if (pathname === "/login") {
        router.push("/dashboard");
      }
    }
  }, [pathname]);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, token }}
    >
      {children}
    </AuthContext.Provider>
  );
};
