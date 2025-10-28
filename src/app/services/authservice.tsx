"use client";

import React, { createContext, ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import usePermissionStore from "@/store/usePermissionStore";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (
    credentials: { email: string; password: string },
    rememberMe?: boolean
  ) => Promise<void>;
  logout: () => void;
  token: string | undefined;
}

interface LoginResponseType {
  data: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    user: {
      id: number;
      email: string;
      roleId: number;
      isActive: boolean;
    };
  };
  statusCode: number;
  message: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Storage keys
const ACCESS_TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refresh_token";
const ACCESS_TOKEN_EXPIRES_AT_KEY = "accessTokenExpiresAt"; // epoch ms
const AUTH_STORAGE_KEY = "auth_storage"; // 'local' | 'session'

// Single-flight refresh guard and scheduled refresh timer
let refreshPromise: Promise<string | void> | null = null;
let refreshTimeoutId: number | null = null;

const clearRefreshTimer = () => {
  if (refreshTimeoutId !== null) {
    clearTimeout(refreshTimeoutId);
    refreshTimeoutId = null;
  }
};

type AuthStorageMode = "local" | "session";

const getStorageMode = (): AuthStorageMode => {
  try {
    const mode = localStorage.getItem(AUTH_STORAGE_KEY);
    return mode === "session" ? "session" : "local";
  } catch {
    return "local";
  }
};

const setStorageMode = (mode: AuthStorageMode) => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, mode);
  } catch {
    // ignore
  }
};

const getStore = (): Storage => {
  return getStorageMode() === "session" ? sessionStorage : localStorage;
};

const resolveAndSetStorageModeFromExistingTokens = (): Storage => {
  try {
    if (
      localStorage.getItem(ACCESS_TOKEN_KEY) ||
      localStorage.getItem(REFRESH_TOKEN_KEY)
    ) {
      setStorageMode("local");
      return localStorage;
    }
    if (
      sessionStorage.getItem(ACCESS_TOKEN_KEY) ||
      sessionStorage.getItem(REFRESH_TOKEN_KEY)
    ) {
      setStorageMode("session");
      return sessionStorage;
    }
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // ignore
  }
  return localStorage;
};

const removeFromAllStores = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch {}
  try {
    sessionStorage.removeItem(key);
  } catch {}
};

const getExpiryFromAccessToken = (accessToken: string): number | null => {
  try {
    const parts = accessToken.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (!payload || typeof payload.exp !== "number") return null;
    // exp is in seconds
    return payload.exp * 1000;
  } catch {
    return null;
  }
};

const getAccessTokenExpiryMs = (): number | null => {
  try {
    const raw = getStore().getItem(ACCESS_TOKEN_EXPIRES_AT_KEY);
    if (!raw) return null;
    const parsed = parseInt(raw, 10);
    return Number.isFinite(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const scheduleTokenRefresh = () => {
  clearRefreshTimer();
  const expiryMs = getAccessTokenExpiryMs();
  if (!expiryMs) return;
  const now = Date.now();
  // Refresh 60s before expiry. If already within that window, skip scheduling;
  // on-demand pre-refresh in fetchWithAuth will handle it.
  const delay = expiryMs - now - 60_000;
  if (delay <= 0) return;
  refreshTimeoutId = window.setTimeout(() => {
    void refreshAccessToken().catch(() => {
      // ignore here; requests will handle auth failures
    });
  }, delay);
};

const setTokens = (
  accessToken: string,
  refreshToken: string,
  expiresInSeconds: number
) => {
  // Prefer JWT exp claim if present; fallback to expires_in
  const expFromJwt = getExpiryFromAccessToken(accessToken);
  const fallbackExp = Date.now() + expiresInSeconds * 1000;
  const expiryAtMs = expFromJwt && Number.isFinite(expFromJwt) ? expFromJwt : fallbackExp;
  const store = getStore();
  store.setItem(ACCESS_TOKEN_KEY, accessToken);
  store.setItem(REFRESH_TOKEN_KEY, refreshToken);
  store.setItem(ACCESS_TOKEN_EXPIRES_AT_KEY, expiryAtMs.toString());
  scheduleTokenRefresh();
};

const clearTokens = () => {
  clearRefreshTimer();
  removeFromAllStores(ACCESS_TOKEN_KEY);
  removeFromAllStores(REFRESH_TOKEN_KEY);
  removeFromAllStores(ACCESS_TOKEN_EXPIRES_AT_KEY);
  removeFromAllStores("roleId");
  removeFromAllStores("email");
};

export const refreshAccessToken = async (): Promise<string | void> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = getStore().getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      refreshPromise = null;
      throw new Error("No refresh token available");
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data: {
        data: { access_token: string; refresh_token: string; expires_in: number };
      } = await response.json();

      setTokens(
        data.data.access_token,
        data.data.refresh_token,
        data.data.expires_in
      );

      return data.data.access_token;
    } finally {
      // Reset the single-flight guard regardless of outcome
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | undefined>(undefined);
  const pathname = usePathname();
  const router = useRouter();

  const { fetchPermissionsByRole } = usePermissionStore();

  const login = async (
    credentials: { email: string; password: string },
    rememberMe: boolean = true
  ) => {
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
        const refreshToken = data.data.refresh_token;
        const expiresIn = data.data.expires_in;

        setStorageMode(rememberMe ? "local" : "session");
        setTokens(token, refreshToken, expiresIn);
        const store = getStore();
        store.setItem("email", data?.data?.user?.email);
        store.setItem("roleId", data?.data?.user?.roleId?.toString());

        setToken(token);
        setIsAuthenticated(true);
        await fetchPermissionsByRole();
        router.push("/dashboard");
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
    const store = getStore();
    const refreshToken = store.getItem(REFRESH_TOKEN_KEY);
    if (refreshToken) {
      void fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      }).catch(() => {});
    }
    setToken(undefined);
    setIsAuthenticated(false);
    clearTokens();
    router.push("/");
  };

  useEffect(() => {
    const init = async () => {
      const store = resolveAndSetStorageModeFromExistingTokens();
      const storedToken = store.getItem(ACCESS_TOKEN_KEY);
      const hasRefresh = !!store.getItem(REFRESH_TOKEN_KEY);
      const roleId = store.getItem("roleId");

      if (storedToken) {
        setToken(storedToken);
        setIsAuthenticated(true);
        scheduleTokenRefresh();
        if (roleId) {
          await fetchPermissionsByRole();
        }
        if (pathname === "/") {
          router.push("/dashboard");
        }
        return;
      }

      if (!storedToken && hasRefresh) {
        try {
          const newAccess = await refreshAccessToken();
          if (newAccess) {
            setToken(newAccess as string);
            setIsAuthenticated(true);
            if (roleId) {
              await fetchPermissionsByRole();
            }
            if (pathname === "/") {
              router.push("/dashboard");
            }
            return;
          }
        } catch {
          // fall through to redirect
        }
      }

      if (pathname !== "/") {
        router.push("/");
      }
    };

    void init();
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
  // Pre-refresh if token is about to expire (within 30s)
  try {
    const exp = getAccessTokenExpiryMs();
    if (exp && Date.now() > exp - 30_000) {
      await refreshAccessToken();
    }
  } catch {
    // ignore here; request may still succeed or will 401
  }

  const attachAuthAndFetch = async (): Promise<Response> => {
    const currentToken = getStore().getItem(ACCESS_TOKEN_KEY);
    const headers = new Headers(options.headers || {});
    if (currentToken) {
      headers.set("Authorization", `Bearer ${currentToken}`);
    }
    return fetch(url, { ...options, headers });
  };

  let response = await attachAuthAndFetch();
  if (response.status === 401) {
    // Attempt one refresh then retry once
    try {
      await refreshAccessToken();
      response = await attachAuthAndFetch();
      if (response.status !== 401) {
        return response;
      }
    } catch {
      // ignore and fall through to redirect
    }
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
