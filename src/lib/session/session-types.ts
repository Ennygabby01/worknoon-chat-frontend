import type { ApiUser } from "@/types/api";

export type { UserRole } from "@/types/api";

export type SessionUser = ApiUser;

export type AuthSession = {
  user: SessionUser;
  accessToken: string;
};
