"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode
} from "react";
import { listChatContacts, listUsers } from "@/lib/api/users";
import { useSession } from "@/lib/session/session-context";
import type { ApiUser } from "@/types/api";

type UserCache = Map<string, ApiUser>;

const UserCacheContext = createContext<UserCache>(new Map());

export function UserCacheProvider({ children }: { children: ReactNode }) {
  const { session } = useSession();
  const [cache, setCache] = useState<UserCache>(new Map());
  const loaded = useRef(false);

  useEffect(() => {
    if (!session || loaded.current) return;
    loaded.current = true;

    async function loadCache() {
      const initial = new Map<string, ApiUser>();
      initial.set(session!.user.id, session!.user);

      try {
        const { users } = session!.user.role === "admin"
          ? await listUsers({ limit: 200 })
          : await listChatContacts({ limit: 200 });
        for (const u of users) initial.set(u.id, u);
      } catch {
        // Keep the current session user cached if contact preloading fails.
      }
      setCache(initial);
    }

    void loadCache();
  }, [session]);

  return (
    <UserCacheContext.Provider value={cache}>{children}</UserCacheContext.Provider>
  );
}

export function useUserCache(): UserCache {
  return useContext(UserCacheContext);
}

export function useUserName(userId: string): string {
  const cache = useUserCache();
  const user = cache.get(userId);
  return user?.name ?? "";
}

export function useUserRole(userId: string): string | null {
  const cache = useUserCache();
  return cache.get(userId)?.role ?? null;
}
