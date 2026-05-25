"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/session/session-context";
import { UserCacheProvider } from "@/lib/users/user-cache-context";
import { OnlineStatusProvider } from "@/lib/realtime/online-status-context";
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
  const inActiveChat = pathname.startsWith("/inbox/");
  const isAdmin = user.role === "admin";
  const isAgent = user.role === "agent";

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <UserCacheProvider>
    <OnlineStatusProvider>
      <div className="chat-layout" data-chat-active={inActiveChat}>
        <aside className="chat-sidebar">
          <div className="sidebar-brand">
            <div className="sidebar-brand-mark">
              <BrandIcon />
            </div>
            <span className="sidebar-brand-name">Worknoon</span>
          </div>

          <nav className="sidebar-nav">
            {isAdmin && (
              <>
                <Link href="/secure-end/Admin" className={`nav-link${pathname === "/secure-end/Admin" ? " is-active" : ""}`}>
                  <DashboardIcon className="nav-link-icon" />
                  Dashboard
                </Link>
                <Link href="/secure-end/Admin/users" className={`nav-link${pathname.startsWith("/secure-end/Admin/users") ? " is-active" : ""}`}>
                  <PeopleIcon className="nav-link-icon" />
                  Users
                </Link>
                <Link href="/secure-end/Admin/agents" className={`nav-link${pathname.startsWith("/secure-end/Admin/agents") ? " is-active" : ""}`}>
                  <AgentIcon className="nav-link-icon" />
                  Agents
                </Link>
                <Link href="/secure-end/Admin/conversations" className={`nav-link${pathname.startsWith("/secure-end/Admin/conversations") ? " is-active" : ""}`}>
                  <MessagesIcon className="nav-link-icon" />
                  Conversations
                </Link>
                <Link href="/secure-end/Admin/telemetry" className={`nav-link${pathname.startsWith("/secure-end/Admin/telemetry") ? " is-active" : ""}`}>
                  <TelemetryIcon className="nav-link-icon" />
                  Telemetry
                </Link>
              </>
            )}

            {isAgent && (
              <>
                <Link href="/inbox" className={`nav-link${pathname.startsWith("/inbox") ? " is-active" : ""}`}>
                  <MessagesIcon className="nav-link-icon" />
                  Messages
                </Link>
                <Link href="/queue" className={`nav-link${pathname.startsWith("/queue") ? " is-active" : ""}`}>
                  <QueueIcon className="nav-link-icon" />
                  Queue
                </Link>
                <Link href="/my-cases" className={`nav-link${pathname.startsWith("/my-cases") ? " is-active" : ""}`}>
                  <CasesIcon className="nav-link-icon" />
                  My Cases
                </Link>
              </>
            )}

            {!isAdmin && !isAgent && (
              <>
                <Link href="/inbox" className={`nav-link${pathname.startsWith("/inbox") ? " is-active" : ""}`}>
                  <MessagesIcon className="nav-link-icon" />
                  Messages
                </Link>
                <Link href="/people" className={`nav-link${pathname.startsWith("/people") ? " is-active" : ""}`}>
                  <DirectoryIcon className="nav-link-icon" />
                  Directory
                </Link>
                <Link href="/orders" className={`nav-link${pathname.startsWith("/orders") ? " is-active" : ""}`}>
                  <OrdersIcon className="nav-link-icon" />
                  Orders
                </Link>
              </>
            )}

            <Link href="/profile" className={`nav-link nav-link-settings${pathname === "/profile" ? " is-active" : ""}`}>
              <SettingsIcon className="nav-link-icon" />
              Settings
            </Link>
          </nav>

          <div className="sidebar-user">
            <div className="sidebar-user-card">
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
          </div>
        </aside>

        {children}

        {!inActiveChat && (
          <nav className="mobile-tab-bar" aria-label="Main navigation">
            {isAdmin && (
              <>
                <Link href="/secure-end/Admin" className={`tab-bar-item${pathname === "/secure-end/Admin" ? " is-active" : ""}`}>
                  <DashboardIcon className="tab-bar-icon" />
                  <span>Dashboard</span>
                </Link>
                <Link href="/secure-end/Admin/users" className={`tab-bar-item${pathname.startsWith("/secure-end/Admin/users") ? " is-active" : ""}`}>
                  <PeopleIcon className="tab-bar-icon" />
                  <span>Users</span>
                </Link>
                <Link href="/secure-end/Admin/agents" className={`tab-bar-item${pathname.startsWith("/secure-end/Admin/agents") ? " is-active" : ""}`}>
                  <AgentIcon className="tab-bar-icon" />
                  <span>Agents</span>
                </Link>
                <Link href="/profile" className={`tab-bar-item${pathname === "/profile" ? " is-active" : ""}`}>
                  <SettingsIcon className="tab-bar-icon" />
                  <span>Settings</span>
                </Link>
              </>
            )}

            {isAgent && (
              <>
                <Link href="/inbox" className={`tab-bar-item${pathname.startsWith("/inbox") ? " is-active" : ""}`}>
                  <MessagesIcon className="tab-bar-icon" />
                  <span>Messages</span>
                </Link>
                <Link href="/queue" className={`tab-bar-item${pathname.startsWith("/queue") ? " is-active" : ""}`}>
                  <QueueIcon className="tab-bar-icon" />
                  <span>Queue</span>
                </Link>
                <Link href="/my-cases" className={`tab-bar-item${pathname.startsWith("/my-cases") ? " is-active" : ""}`}>
                  <CasesIcon className="tab-bar-icon" />
                  <span>My Cases</span>
                </Link>
                <Link href="/profile" className={`tab-bar-item${pathname === "/profile" ? " is-active" : ""}`}>
                  <SettingsIcon className="tab-bar-icon" />
                  <span>Settings</span>
                </Link>
              </>
            )}

            {!isAdmin && !isAgent && (
              <>
                <Link href="/inbox" className={`tab-bar-item${pathname.startsWith("/inbox") ? " is-active" : ""}`}>
                  <MessagesIcon className="tab-bar-icon" />
                  <span>Messages</span>
                </Link>
                <Link href="/people" className={`tab-bar-item${pathname.startsWith("/people") ? " is-active" : ""}`}>
                  <DirectoryIcon className="tab-bar-icon" />
                  <span>Directory</span>
                </Link>
                <Link href="/orders" className={`tab-bar-item${pathname.startsWith("/orders") ? " is-active" : ""}`}>
                  <OrdersIcon className="tab-bar-icon" />
                  <span>Orders</span>
                </Link>
                <Link href="/profile" className={`tab-bar-item${pathname === "/profile" ? " is-active" : ""}`}>
                  <SettingsIcon className="tab-bar-icon" />
                  <span>Settings</span>
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </OnlineStatusProvider>
    </UserCacheProvider>
  );
}

function BrandIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 2H7C4.24 2 2 4.23 2 6.98V12.96V13.96C2 16.71 4.24 18.94 7 18.94H8.5C8.77 18.94 9.13 19.12 9.3 19.34L10.8 21.33C11.46 22.21 12.54 22.21 13.2 21.33L14.7 19.34C14.89 19.09 15.19 18.94 15.5 18.94H17C19.76 18.94 22 16.71 22 13.96V6.98C22 4.23 19.76 2 17 2ZM13 13.75H7C6.59 13.75 6.25 13.41 6.25 13C6.25 12.59 6.59 12.25 7 12.25H13C13.41 12.25 13.75 12.59 13.75 13C13.75 13.41 13.41 13.75 13 13.75ZM17 8.75H7C6.59 8.75 6.25 8.41 6.25 8C6.25 7.59 6.59 7.25 7 7.25H17C17.41 7.25 17.75 7.59 17.75 8C17.75 8.41 17.41 8.75 17 8.75Z" fill="currentColor" />
    </svg>
  );
}

function MessagesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.59 12.4V16.47C15.59 16.83 15.55 17.17 15.46 17.48C15.09 18.95 13.87 19.87 12.19 19.87H9.47L6.45 21.88C6 22.19 5.4 21.86 5.4 21.32V19.87C4.38 19.87 3.53 19.53 2.94 18.94C2.34 18.34 2 17.49 2 16.47V12.4C2 10.5 3.18 9.19 5 9.02C5.13 9.01 5.26 9 5.4 9H12.19C14.23 9 15.59 10.36 15.59 12.4Z" fill="currentColor" />
      <path d="M17.75 15.6C19.02 15.6 20.09 15.18 20.83 14.43C21.58 13.69 22 12.62 22 11.35V6.25C22 3.9 20.1 2 17.75 2H9.25C6.9 2 5 3.9 5 6.25V7C5 7.28 5.22 7.5 5.5 7.5H12.19C14.9 7.5 17.09 9.69 17.09 12.4V15.1C17.09 15.38 17.31 15.6 17.59 15.6H17.75Z" fill="currentColor" />
    </svg>
  );
}

function DirectoryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="m12.71 11.96v.016c0 .225-.084.431-.222.588l.001-.001c-.13.156-.325.255-.542.255-.005 0-.01 0-.015 0h.001c-.005 0-.01 0-.016 0-.225 0-.431-.084-.588-.222l.001.001c-.156-.13-.255-.325-.255-.542 0-.005 0-.01 0-.015v.001c0-.004 0-.009 0-.014 0-.227.087-.434.229-.589l-.001.001c.134-.156.331-.254.551-.254h.009.01c.223 0 .427.084.581.222l-.001-.001c.157.13.256.325.256.544v.013-.001zm.2.777 4.69-7.782q-.121.107-.904.837t-1.68 1.56-1.828 1.701-1.567 1.48c-.242.216-.463.441-.668.68l-.008.009-4.674 7.768q.094-.094.898-.83t1.687-1.56q.88-.824 1.822-1.701t1.563-1.486q.63-.613.67-.676zm8.666-.737v.061c0 1.817-.519 3.513-1.416 4.947l.023-.039-.228-.147q-.187-.121-.355-.221c-.063-.046-.137-.081-.217-.1l-.004-.001c-.007-.001-.015-.002-.022-.002-.085 0-.154.069-.154.154 0 .008.001.016.002.023v-.001q0 .134.79.59c-.671 1.007-1.492 1.854-2.442 2.531l-.029.02c-.921.664-2.002 1.175-3.17 1.466l-.065.014-.214-.895q-.014-.134-.201-.134c-.048.001-.089.031-.107.073v.001c-.018.028-.029.061-.029.098 0 .01.001.021.003.031v-.001l.214.91c-.583.126-1.252.198-1.938.198-.006 0-.013 0-.019 0h.001c-.008 0-.017 0-.026 0-1.835 0-3.547-.524-4.996-1.43l.04.023q.014-.026.174-.274t.288-.449c.056-.072.099-.157.126-.249l.001-.005c.001-.007.002-.015.002-.022 0-.085-.069-.154-.154-.154-.008 0-.016.001-.023.002h.001q-.08 0-.228.194c-.1.133-.2.284-.29.441l-.011.021q-.154.268-.181.308c-1.016-.681-1.87-1.515-2.55-2.481l-.02-.03c-.666-.932-1.176-2.028-1.461-3.21l-.013-.064.922-.202c.079-.023.135-.094.135-.179 0-.008 0-.016-.001-.023v.001c-.001-.048-.031-.089-.073-.107h-.001c-.03-.018-.067-.029-.106-.029-.012 0-.024.001-.036.003h.001l-.91.201c-.116-.559-.183-1.202-.185-1.86v-.002c0-.019 0-.041 0-.063 0-1.861.544-3.594 1.482-5.05l-.022.037q.026.014.248.16t.4.254c.067.048.145.085.23.106l.005.001q.174 0 .174-.16 0-.08-.167-.207c-.124-.093-.266-.188-.413-.276l-.022-.012-.268-.16c.691-1 1.532-1.841 2.5-2.511l.032-.021c.932-.651 2.026-1.147 3.205-1.42l.063-.012.201.898q.026.134.201.134c.048-.001.089-.031.107-.073v-.001c.018-.03.029-.067.029-.106 0-.012-.001-.024-.003-.036v.001l-.201-.88c.537-.108 1.157-.173 1.791-.178h.005.037c1.869 0 3.611.544 5.076 1.483l-.038-.023c-.206.251-.381.538-.514.847l-.009.023q0 .174.16.174.147 0 .64-.857c1.95 1.336 3.366 3.328 3.938 5.652l.014.066-.75.16q-.134.026-.134.214c.001.048.031.089.073.107h.001c.028.018.061.029.098.029.01 0 .021-.001.031-.003h-.001l.763-.174c.118.563.187 1.21.19 1.873v.003zm1.138 0c0-.01 0-.022 0-.035 0-1.493-.313-2.913-.877-4.197l.026.067c-1.093-2.588-3.111-4.606-5.63-5.673l-.069-.026c-1.229-.538-2.66-.85-4.165-.85s-2.937.313-4.234.877l.069-.027c-2.588 1.093-4.605 3.111-5.672 5.63l-.026.069c-.538 1.229-.85 2.66-.85 4.165s.313 2.937.877 4.234l-.027-.069c1.093 2.588 3.111 4.605 5.63 5.672l.069.026c1.229.538 2.66.85 4.165.85s2.937-.313 4.234-.877l-.069.027c2.588-1.093 4.605-3.111 5.629-5.629l.026-.069c.538-1.218.85-2.637.85-4.13 0-.012 0-.025 0-.037v.002zm1.286 0v.033c0 1.672-.35 3.263-.981 4.703l.029-.075c-1.222 2.903-3.485 5.166-6.311 6.359l-.077.029c-1.375.601-2.977.951-4.661.951s-3.286-.35-4.738-.981l.077.03c-2.903-1.222-5.166-3.485-6.359-6.311l-.029-.077c-.601-1.375-.951-2.977-.951-4.661s.35-3.286.981-4.738l-.03.077c1.222-2.903 3.485-5.166 6.311-6.359l.077-.029c1.375-.601 2.977-.951 4.661-.951s3.286.35 4.738.981l-.077-.03c2.903 1.222 5.166 3.485 6.359 6.311l.029.077c.601 1.364.951 2.955.951 4.627v.035-.002z" />
    </svg>
  );
}

function PeopleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M5 9.5C5 7.01472 7.01472 5 9.5 5C11.9853 5 14 7.01472 14 9.5C14 11.9853 11.9853 14 9.5 14C7.01472 14 5 11.9853 5 9.5Z" fill="currentColor" />
      <path d="M14.3675 12.0632C14.322 12.1494 14.3413 12.2569 14.4196 12.3149C15.0012 12.7454 15.7209 13 16.5 13C18.433 13 20 11.433 20 9.5C20 7.567 18.433 6 16.5 6C15.7209 6 15.0012 6.2546 14.4196 6.68513C14.3413 6.74313 14.322 6.85058 14.3675 6.93679C14.7714 7.70219 15 8.5744 15 9.5C15 10.4256 14.7714 11.2978 14.3675 12.0632Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M4.64115 15.6993C5.87351 15.1644 7.49045 15 9.49995 15C11.5112 15 13.1293 15.1647 14.3621 15.7008C15.705 16.2847 16.5212 17.2793 16.949 18.6836C17.1495 19.3418 16.6551 20 15.9738 20H3.02801C2.34589 20 1.85045 19.3408 2.05157 18.6814C2.47994 17.2769 3.29738 16.2826 4.64115 15.6993Z" fill="currentColor" />
      <path d="M14.8185 14.0364C14.4045 14.0621 14.3802 14.6183 14.7606 14.7837V14.7837C15.803 15.237 16.5879 15.9043 17.1508 16.756C17.6127 17.4549 18.33 18 19.1677 18H20.9483C21.6555 18 22.1715 17.2973 21.9227 16.6108C21.9084 16.5713 21.8935 16.5321 21.8781 16.4932C21.5357 15.6286 20.9488 14.9921 20.0798 14.5864C19.2639 14.2055 18.2425 14.0483 17.0392 14.0008L17.0194 14H16.9997C16.2909 14 15.5506 13.9909 14.8185 14.0364Z" fill="currentColor" />
    </svg>
  );
}

function OrdersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="-3 -4.5 33 33" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="m25.714 10.286h.027c.465 0 .885.192 1.185.502.31.301.502.721.502 1.186v.028-.001.027c0 .465-.192.885-.502 1.185-.301.31-.721.502-1.186.502-.009 0-.019 0-.028 0h.001-.201l-1.541 8.869c-.069.413-.283.767-.587 1.015l-.003.002c-.29.249-.67.401-1.085.401-.004 0-.008 0-.013 0h-17.142c-.004 0-.008 0-.012 0-.415 0-.795-.152-1.087-.403l.002.002c-.307-.251-.52-.604-.588-1.008l-.001-.01-1.541-8.869h-.201c-.008 0-.017 0-.027 0-.465 0-.885-.192-1.185-.502-.31-.301-.502-.721-.502-1.186 0-.009 0-.019 0-.028v.001c0-.008 0-.017 0-.027 0-.465.192-.885.502-1.185.301-.31.721-.502 1.186-.502h.028-.001zm-19.223 10.714c.236-.017.442-.13.581-.3l.001-.001c.131-.146.211-.339.211-.552 0-.025-.001-.05-.003-.074v.003l-.429-5.572c-.017-.236-.13-.442-.3-.581l-.001-.001c-.146-.131-.339-.211-.552-.211-.025 0-.05.001-.074.003h.003c-.236.017-.442.13-.581.3l-.001.001c-.131.146-.211.339-.211.552 0 .025.001.05.003.074v-.003l.429 5.572c.015.224.118.422.274.562l.001.001c.149.141.35.228.572.228h.011-.001zm5.505-.856v-5.572c0-.002 0-.005 0-.008 0-.234-.097-.445-.254-.594-.15-.157-.361-.254-.595-.254-.003 0-.005 0-.008 0-.002 0-.005 0-.008 0-.234 0-.445.097-.594.254-.157.15-.254.361-.254.595v.008 5.572.008c0 .234.097.445.254.594.15.157.361.254.595.254h.008.008c.234 0 .445-.097.594-.254.159-.15.258-.363.258-.598 0-.002 0-.004 0-.006zm5.143 0v-5.572c0-.002 0-.005 0-.008 0-.234-.097-.445-.254-.594-.15-.157-.361-.254-.595-.254-.003 0-.005 0-.008 0-.002 0-.005 0-.008 0-.234 0-.445.097-.594.254-.157.15-.254.361-.254.595v.008 5.572.008c0 .234.097.445.254.594.15.157.361.254.595.254h.008.008c.234 0 .445-.097.594-.254.159-.15.258-.363.258-.598 0-.002 0-.004 0-.006zm4.714.066.429-5.572c.002-.021.003-.046.003-.071 0-.212-.08-.406-.211-.553l.001.001c-.141-.172-.347-.285-.58-.302h-.003c-.021-.002-.046-.003-.071-.003-.212 0-.406.08-.553.211l.001-.001c-.172.141-.285.347-.302.58v.003l-.429 5.572c-.002.021-.003.046-.003.071 0 .212.08.406.211.553l-.001-.001c.141.172.347.285.58.302h.003.067.01c.222 0 .423-.087.573-.228.159-.141.263-.34.279-.564v-.003zm-15.478-16.3-1.245 5.518h-1.768l1.352-5.906c.163-.785.59-1.45 1.182-1.915l.007-.005c.571-.464 1.306-.744 2.107-.744h.038-.002 2.236c0-.002 0-.005 0-.008 0-.234.097-.445.254-.594.15-.157.361-.255.596-.255h.012 5.142.008c.234 0 .445.097.594.254.157.15.254.361.254.595v.008h2.236.037c.801 0 1.536.28 2.112.748l-.006-.005c.599.47 1.025 1.135 1.185 1.899l.004.021 1.352 5.906h-1.768l-1.245-5.518c-.095-.392-.312-.724-.606-.962l-.003-.003c-.282-.233-.647-.375-1.046-.375-.007 0-.014 0-.02 0h-2.235v.008c0 .234-.097.445-.254.594-.15.157-.361.254-.595.254-.003 0-.005 0-.008 0h-5.142c-.002 0-.005 0-.008 0-.234 0-.445-.097-.594-.254-.157-.15-.254-.361-.254-.595 0-.003 0-.005 0-.008h-2.236c-.006 0-.013 0-.019 0-.398 0-.764.142-1.048.377l.003-.002c-.297.242-.512.574-.603.954l-.002.012z" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M14.2788 2.15224C13.9085 2 13.439 2 12.5 2C11.561 2 11.0915 2 10.7212 2.15224C10.2274 2.35523 9.83509 2.74458 9.63056 3.23463C9.53719 3.45834 9.50065 3.7185 9.48635 4.09799C9.46534 4.65568 9.17716 5.17189 8.69017 5.45093C8.20318 5.72996 7.60864 5.71954 7.11149 5.45876C6.77318 5.2813 6.52789 5.18262 6.28599 5.15102C5.75609 5.08178 5.22018 5.22429 4.79616 5.5472C4.47814 5.78938 4.24339 6.1929 3.7739 6.99993C3.30441 7.80697 3.06967 8.21048 3.01735 8.60491C2.94758 9.1308 3.09118 9.66266 3.41655 10.0835C3.56506 10.2756 3.77377 10.437 4.0977 10.639C4.57391 10.936 4.88032 11.4419 4.88029 12C4.88026 12.5581 4.57386 13.0639 4.0977 13.3608C3.77372 13.5629 3.56497 13.7244 3.41645 13.9165C3.09108 14.3373 2.94749 14.8691 3.01725 15.395C3.06957 15.7894 3.30432 16.193 3.7738 17C4.24329 17.807 4.47804 18.2106 4.79606 18.4527C5.22008 18.7756 5.75599 18.9181 6.28589 18.8489C6.52778 18.8173 6.77305 18.7186 7.11133 18.5412C7.60852 18.2804 8.2031 18.27 8.69012 18.549C9.17714 18.8281 9.46533 19.3443 9.48635 19.9021C9.50065 20.2815 9.53719 20.5417 9.63056 20.7654C9.83509 21.2554 10.2274 21.6448 10.7212 21.8478C11.0915 22 11.561 22 12.5 22C13.439 22 13.9085 22 14.2788 21.8478C14.7726 21.6448 15.1649 21.2554 15.3694 20.7654C15.4628 20.5417 15.4994 20.2815 15.5137 19.902C15.5347 19.3443 15.8228 18.8281 16.3098 18.549C16.7968 18.2699 17.3914 18.2804 17.8886 18.5412C18.2269 18.7186 18.4721 18.8172 18.714 18.8488C19.2439 18.9181 19.7798 18.7756 20.2038 18.4527C20.5219 18.2105 20.7566 17.807 21.2261 16.9999C21.6956 16.1929 21.9303 15.7894 21.9827 15.395C22.0524 14.8691 21.9088 14.3372 21.5835 13.9164C21.4349 13.7243 21.2262 13.5628 20.9022 13.3608C20.4261 13.0639 20.1197 12.558 20.1197 11.9999C20.1197 11.4418 20.4261 10.9361 20.9022 10.6392C21.2263 10.4371 21.435 10.2757 21.5836 10.0835C21.9089 9.66273 22.0525 9.13087 21.9828 8.60497C21.9304 8.21055 21.6957 7.80703 21.2262 7C20.7567 6.19297 20.522 5.78945 20.2039 5.54727C19.7799 5.22436 19.244 5.08185 18.7141 5.15109C18.4722 5.18269 18.2269 5.28136 17.8887 5.4588C17.3915 5.71959 16.7969 5.73002 16.3099 5.45096C15.8229 5.17191 15.5347 4.65566 15.5136 4.09794C15.4993 3.71848 15.4628 3.45833 15.3694 3.23463C15.1649 2.74458 14.7726 2.35523 14.2788 2.15224ZM12.5 15C14.1695 15 15.5228 13.6569 15.5228 12C15.5228 10.3431 14.1695 9 12.5 9C10.8305 9 9.47716 10.3431 9.47716 12C9.47716 13.6569 10.8305 15 12.5 15Z" fill="currentColor" />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 12h-9.5m7.5 3l3-3-3-3m-5-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h5a2 2 0 002-2v-1" />
    </svg>
  );
}

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="9" height="11" rx="2" />
      <rect x="13" y="2" width="9" height="7" rx="2" />
      <rect x="2" y="15" width="9" height="7" rx="2" />
      <rect x="13" y="11" width="9" height="11" rx="2" />
    </svg>
  );
}

function AgentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 414.594 414.594" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M357.594,298.009l-84.891-33.848l-19.881-16.748c-5.25-4.438-13.004-4.11-17.873,0.73l-27.64,27.481l-27.717-27.492c-4.874-4.832-12.618-5.146-17.864-0.722l-19.879,16.748l-84.895,33.854C29.622,308.9,29.644,405.708,27.297,414.594h360C384.955,405.73,384.941,308.885,357.594,298.009z" />
      <path d="M314.002,87.668C308.106,38.434,262.505,0,207.297,0s-100.81,38.434-106.705,87.668c-4.898,3.137-8.153,8.613-8.153,14.859v39.996c0,9.743,7.899,17.646,17.646,17.646l15.942-0.04c9.848,51.453,44.795,80.728,81.27,80.728c36.475,0,57.666-17.339,71.719-49.293c-10.729,8.416-26.324,16.114-48.134,17.704c-2.004,2.985-5.411,4.951-9.276,4.951h-10.189c-6.167,0-11.167-4.999-11.167-11.167s5-11.167,11.167-11.167h10.189c3.611,0,6.813,1.723,8.854,4.383c35.067-2.815,51.558-24.083,58.134-36.091l15.916-0.006c9.746,0,17.646-7.903,17.646-17.646v-39.996C322.154,96.281,318.899,90.805,314.002,87.668z M287.961,89.47c-10.407-32.854-40.473-52.385-80.664-52.385c-40.192,0-70.276,19.519-80.694,52.357c-1.612-1.456-3.49-2.616-5.559-3.401C127.705,48.656,163.845,20,207.297,20s79.591,28.656,86.253,66.041C291.468,86.832,289.58,88,287.961,89.47z" />
    </svg>
  );
}

function QueueIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 92 92" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M72.8,24.9L53.4,66.7c-1.7,4.3-4.7,6.8-8,6.8c-2.7,0-5-1.4-6.3-3.6c-1.4-2.6-1.3-5.8,0.4-8.5v0l25.4-40.7c1.3-2,3.9-2.7,6-1.6C73,20.2,73.8,22.7,72.8,24.9z M79.6,37c-1.5-1.6-4-1.7-5.7-0.2c-1.6,1.5-1.7,4-0.2,5.7C80.3,49.7,84,59.1,84,69c0,2.2,1.8,4,4,4s4-1.8,4-4C92,57.1,87.6,45.7,79.6,37z M49.2,30.4c2.2,0.2,4.1-1.4,4.3-3.6c0.2-2.2-1.4-4.1-3.6-4.3c-1.3-0.1-2.6-0.2-3.9-0.2c-25.4,0-46,21-46,46.8c0,2.2,1.8,4,4,4s4-1.8,4-4c0-21.4,17-38.8,38-38.8C47.1,30.2,48.2,30.3,49.2,30.4z" />
    </svg>
  );
}

function CasesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="-1.5 -1.5 19 19" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M0 4a4 4 0 014-4h8a4 4 0 014 4v8a4 4 0 01-4 4H4a4 4 0 01-4-4V4zm6.996.165a1.017 1.017 0 112.012 0L8 11 6.996 4.165zM8 11a1 1 0 110 2 1 1 0 010-2z" />
    </svg>
  );
}

function TelemetryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1000 1000" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M500 70q-117 0-217 59-97 57-154 154-59 100-59 217t59 217q57 97 154 154 100 59 217 59t217-59q97-57 154-154 59-100 59-217t-59-217q-57-97-154-154-100-59-217-59zm0 108q79 0 148 36t114.5 99.5T819 455h-69q-12 0-25.5-6.5T704 432l-86-114q-7-10-17.5-10T583 318L417 540q-7 9-17.5 9t-17.5-9l-46-61q-7-10-20.5-17t-24.5-7H181q11-78 56.5-141.5T352 214t148-36zm0 644q-79 0-148-36t-114.5-99.5T181 545h69q12 0 25.5 7t20.5 16l86 115q7 9 17.5 9t17.5-9l166-222q7-10 17.5-10t17.5 10l46 61q7 9 20.5 16t24.5 7h110q-11 78-56.5 141.5T648 786t-148 36z" />
    </svg>
  );
}
