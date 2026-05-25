"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getSocket } from "./socket";
import { realtimeEvents } from "./events";

export type PresenceStatus = "online" | "away" | "offline";
type PresenceMap = Map<string, PresenceStatus>;

const OnlineStatusContext = createContext<PresenceMap>(new Map());

export function OnlineStatusProvider({ children }: { children: ReactNode }) {
  const [presence, setPresence] = useState<PresenceMap>(() => new Map());

  useEffect(() => {
    const socket = getSocket();

    function handlePresence(payload: { userId: string; status: PresenceStatus }) {
      setPresence((prev) => {
        const next = new Map(prev);
        next.set(payload.userId, payload.status);
        return next;
      });
    }

    socket.on(realtimeEvents.presenceUpdate, handlePresence);
    return () => {
      socket.off(realtimeEvents.presenceUpdate, handlePresence);
    };
  }, []);

  return (
    <OnlineStatusContext.Provider value={presence}>{children}</OnlineStatusContext.Provider>
  );
}

export function usePresence(userId: string): PresenceStatus {
  return useContext(OnlineStatusContext).get(userId) ?? "offline";
}

export function useIsOnline(userId: string): boolean {
  return usePresence(userId) === "online";
}
