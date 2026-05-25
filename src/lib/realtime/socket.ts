import { io, type Socket } from "socket.io-client";
import { apiConfig } from "../api/config";
import { MOCK_MODE } from "@/lib/mock";

const mockSocket = {
  connected: true,
  auth: {} as Record<string, unknown>,
  emit: () => mockSocket,
  on:   () => mockSocket,
  off:  () => mockSocket,
  connect:    () => {},
  disconnect: () => {},
} as unknown as Socket;

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (MOCK_MODE) return mockSocket;
  if (!socket) {
    socket = io(apiConfig.baseUrl, {
      autoConnect: false
    });
  }
  return socket;
}

export function connectSocket(accessToken: string): void {
  const s = getSocket();
  s.auth = { token: accessToken };
  if (!s.connected) {
    s.connect();
  }
}

export function updateSocketAuth(accessToken: string): void {
  const s = getSocket();
  s.auth = { token: accessToken };
}

export function disconnectSocket(): void {
  socket?.disconnect();
  socket = null;
}
