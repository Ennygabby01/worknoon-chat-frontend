import { io, type Socket } from "socket.io-client";
import { apiConfig } from "../api/config";

let socket: Socket | null = null;

export function getSocket(): Socket {
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
