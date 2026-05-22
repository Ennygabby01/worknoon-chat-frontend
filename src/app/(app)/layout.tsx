"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/session/session-context";
import { UserCacheProvider } from "@/lib/users/user-cache-context";
import { Avatar } from "@/components/ui/Avatar";
import { Spinner } from "@/components/ui/Spinner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { session, loading, logout } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !session) {
      router.replace("/login");
    }
  }, [loading, session, router]);

  if (loading) {
    return (
      <div className="loading-screen" style={{ minHeight: "100svh" }}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (!session) return null;

  const { user } = session;

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <UserCacheProvider>
      <div className="chat-layout">
        <aside className="chat-sidebar">
          <div className="sidebar-brand">
            <div className="sidebar-brand-mark">
              <BrandIcon />
            </div>
            <span className="sidebar-brand-name">Worknoon</span>
          </div>

          <nav className="sidebar-nav">
            <Link
              href="/inbox"
              className={`nav-link${pathname.startsWith("/inbox") ? " is-active" : ""}`}
            >
              <InboxIcon className="nav-link-icon" />
              Inbox
            </Link>

            <Link
              href="/profile"
              className={`nav-link${pathname === "/profile" ? " is-active" : ""}`}
            >
              <UserIcon className="nav-link-icon" />
              Profile
            </Link>

            {user.role === "admin" && (
              <Link
                href="/admin"
                className={`nav-link${pathname === "/admin" ? " is-active" : ""}`}
              >
                <ShieldIcon className="nav-link-icon" />
                Admin
              </Link>
            )}
          </nav>

          <div className="sidebar-user">
            <Avatar name={user.name} src={user.avatarUrl} size="sm" />
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user.name}</div>
              <div className="sidebar-user-role">{user.role}</div>
            </div>
            <button
              className="signout-btn"
              onClick={() => void handleLogout()}
              aria-label="Sign out"
            >
              <SignOutIcon />
            </button>
          </div>
        </aside>

        {children}
      </div>
    </UserCacheProvider>
  );
}

function BrandIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function InboxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
