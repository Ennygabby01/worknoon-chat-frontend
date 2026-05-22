"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react";
import {
  login as apiLogin,
  logout as apiLogout,
  refreshSession,
  register as apiRegister
} from "@/lib/api/auth";
import { setAccessToken, subscribeAccessToken } from "./session-store";
import { connectSocket, disconnectSocket, updateSocketAuth } from "@/lib/realtime/socket";
import type { AuthSession } from "./session-types";
import type { PublicRegistrationRole } from "@/types/api";

type SessionContextValue = {
  session: AuthSession | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: {
    name: string;
    email: string;
    password: string;
    role: PublicRegistrationRole;
  }) => Promise<void>;
  logout: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshSession()
      .then((result) => {
        connectSocket(result.accessToken);
        setSession({ user: result.user, accessToken: result.accessToken });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    return subscribeAccessToken((token) => {
      if (!token) {
        disconnectSocket();
        setSession(null);
        return;
      }

      updateSocketAuth(token);
      setSession((current) => {
        if (!current) return current;
        return { ...current, accessToken: token };
      });
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await apiLogin({ email, password });
    setAccessToken(result.accessToken);
    connectSocket(result.accessToken);
    setSession({ user: result.user, accessToken: result.accessToken });
  }, []);

  const register = useCallback(
    async (input: {
      name: string;
      email: string;
      password: string;
      role: PublicRegistrationRole;
    }) => {
      const result = await apiRegister(input);
      setAccessToken(result.accessToken);
      connectSocket(result.accessToken);
      setSession({ user: result.user, accessToken: result.accessToken });
    },
    []
  );

  const logout = useCallback(async () => {
    await apiLogout();
    disconnectSocket();
    setSession(null);
  }, []);

  return (
    <SessionContext.Provider value={{ session, loading, login, register, logout }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
