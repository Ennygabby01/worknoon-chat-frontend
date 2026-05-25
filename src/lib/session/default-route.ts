import type { UserRole } from "@/types/api";

export function getDefaultAppRoute(role: UserRole): string {
  return role === "admin" ? "/secure-end/Admin" : "/inbox";
}
