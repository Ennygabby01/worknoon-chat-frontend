"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session/session-context";
import type { UserRole } from "@/types/api";

export function useRequireRole(role: UserRole | UserRole[]) {
  const { session, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!session) {
      router.replace("/login");
      return;
    }
    const allowed = Array.isArray(role) ? role : [role];
    if (!allowed.includes(session.user.role)) {
      router.replace("/inbox");
    }
  }, [loading, session, router, role]);

  return { session, loading };
}
