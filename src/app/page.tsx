"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session/session-context";
import { getDefaultAppRoute } from "@/lib/session/default-route";
import { Spinner } from "@/components/ui/Spinner";

export default function HomePage() {
  const { session, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    router.replace(session ? getDefaultAppRoute(session.user.role) : "/login");
  }, [loading, session, router]);

  return (
    <div className="loading-screen" style={{ minHeight: "100svh" }}>
      <Spinner size="lg" />
    </div>
  );
}
