"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode
} from "react";
import { listUsers } from "@/lib/api/users";
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

      if (session!.user.role === "admin") {
        try {
          const { users } = await listUsers({ limit: 100 });
          for (const u of users) initial.set(u.id, u);
        } catch {}
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
  return user?.name ?? `User …${userId.slice(-5)}`;
}
