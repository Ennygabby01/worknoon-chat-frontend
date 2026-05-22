"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session/session-context";
import { Spinner } from "@/components/ui/Spinner";

export default function HomePage() {
  const { session, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    router.replace(session ? "/inbox" : "/login");
  }, [loading, session, router]);

  return (
    <div className="loading-screen" style={{ minHeight: "100svh" }}>
      <Spinner size="lg" />
    </div>
  );
}
