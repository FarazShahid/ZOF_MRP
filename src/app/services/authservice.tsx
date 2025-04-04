"use client";

import React, { createContext, ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  token: string | undefined;
}

interface LoginResponseType {
  data: {
    access_token: string;
    user: {
      id: number;
      email: string;
    };
  };
  statusCode: number;
  message: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | undefined>(undefined);
  const pathname = usePathname();
  const router = useRouter();

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      if (response.ok) {
        const data: LoginResponseType = await response.json();
        const token = data.data.access_token;
        localStorage.setItem("token", token);
        localStorage.setItem("email", data?.data?.user?.email);
        setToken(token);
        setIsAuthenticated(true);
        router.push("/adminDashboard");
      } else {
        const error = await response.json();
        toast.error(error.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An unexpected error occurred during login.");
    }
  };

  const logout = () => {
    setToken(undefined);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    router.push("/");
  };

  useEffect(() => {
    let storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    } else if (pathname !== "/") {
      router.push("/");
    }
  }, [pathname]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = localStorage.getItem("token");

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    console.error("Unauthorized! Redirecting to login.");
    window.location.href = "/";
  }

  return response;
};


export const fetchLoginEmail = () =>{
  const userEmail = localStorage.getItem("email");

  if(userEmail){
    return userEmail;
  }
}

export default AuthContext;
