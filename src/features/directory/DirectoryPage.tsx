"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { SearchIcon } from "@/components/ui/SearchIcon";
import { createConversation } from "@/lib/api/conversations";
import { useSession } from "@/lib/session/session-context";
import {
  DIRECTORY_ENTRIES,
  MOCK_DIRECTORY_PRESENCE,
  type DirectoryEntry,
  type DirectoryRole,
} from "./directory-mock";

type FilterTab = "all" | DirectoryRole;

const TABS: { value: FilterTab; label: string }[] = [
  { value: "all",      label: "All" },
  { value: "merchant", label: "Merchants" },
  { value: "designer", label: "Designers" },
];

const COVER_COLORS = [
  "#d1fae5",
  "#dbeafe",
  "#ede9fe",
  "#ffedd5",
  "#fee2e2",
  "#dcfce7",
  "#fef9c3",
  "#fce7f3",
];

function coverColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  }
  return COVER_COLORS[h % COVER_COLORS.length];
}

function compactNumber(n: number): string {
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

function MessageIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 1C2.34315 1 1 2.34315 1 4V15C1 16.6569 2.34315 18 4 18H6V22C6 22.388 6.22446 22.741 6.57584 22.9056C6.92723 23.0702 7.3421 23.0166 7.64018 22.7682L13.362 18H20C21.6569 18 23 16.6569 23 15V4C23 2.34315 21.6569 1 20 1H4Z" />
    </svg>
  );
}

function DirectoryCard({ entry }: { entry: DirectoryEntry }) {
  const router = useRouter();
  const { session } = useSession();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");
  const presence = MOCK_DIRECTORY_PRESENCE[entry.id] ?? "offline";

  async function handleMessage() {
    setStarting(true);
    setError("");
    try {
      const conversation = await createConversation({
        participantIds: [entry.id],
        type: "direct",
      }, session!.user.id);
      router.push(`/inbox/${conversation.id}`);
    } catch {
      setError("Could not start conversation. Try again.");
      setStarting(false);
    }
  }

  return (
    <div className="dir-card">
      <div className="dir-card-cover" style={{ background: coverColor(entry.name) }} />

      <div className="dir-card-content">
        <div className="dir-card-avatar-wrap">
          <Avatar name={entry.name} src={entry.avatarUrl} size="xl" />
          {presence !== "offline" && (
            <span className={`online-dot online-dot--${presence} dir-presence`} aria-label={presence} />
          )}
        </div>

        <div className="dir-card-name">{entry.name}</div>
        <div className="dir-card-meta">
          <Badge label={entry.role} />
          <span className="dir-card-location">
            <LocationIcon />
            {entry.location}
          </span>
        </div>
        <p className="dir-card-bio">{entry.bio}</p>
        <div className="dir-card-stats">
          <span className="dir-stat">
            <span className="dir-stat-value">{compactNumber(entry.ordersCompleted)}</span>
            <span className="dir-stat-label">orders completed</span>
          </span>
        </div>

        {error && <span className="dir-card-error">{error}</span>}
        <button
          type="button"
          className="dir-message-btn"
          onClick={handleMessage}
          disabled={starting}
        >
          {!starting && <MessageIcon />}
          {starting ? "Opening..." : "Message"}
        </button>
      </div>
    </div>
  );
}

export function DirectoryPage() {
  const [filter, setFilter] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function toggleSearch() {
    setSearchOpen((prev) => {
      if (!prev) setTimeout(() => inputRef.current?.focus(), 20);
      else setSearch("");
      return !prev;
    });
  }

  const filtered = DIRECTORY_ENTRIES.filter((e) => {
    const matchRole = filter === "all" || e.role === filter;
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      e.name.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q) ||
      e.bio.toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  const presenceOrder = { online: 0, away: 1, offline: 2 } as const;
  const sorted = [...filtered].sort((a, b) => {
    const pa = MOCK_DIRECTORY_PRESENCE[a.id] ?? "offline";
    const pb = MOCK_DIRECTORY_PRESENCE[b.id] ?? "offline";
    return presenceOrder[pa] - presenceOrder[pb];
  });

  return (
    <div className="dir-page">
      <div className="dir-toolbar">
        <div className="dir-tabs" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              role="tab"
              aria-selected={filter === tab.value}
              className={`dir-tab${filter === tab.value ? " is-active" : ""}`}
              onClick={() => setFilter(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="dir-search-wrap">
          <SearchIcon />
          <input
            type="search"
            className="dir-search"
            placeholder="Search by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          type="button"
          className={`dir-search-toggle${searchOpen ? " is-active" : ""}`}
          onClick={toggleSearch}
          aria-label={searchOpen ? "Close search" : "Search"}
        >
          {searchOpen ? <CloseIcon /> : <SearchIcon />}
        </button>
      </div>

      <div className={`dir-search-bar${searchOpen ? " is-open" : ""}`}>
        <div className="dir-search-bar-inner">
          <SearchIcon />
          <input
            ref={inputRef}
            type="search"
            className="dir-search dir-search-mobile"
            placeholder="Search by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="dir-empty">No results for &ldquo;{search}&rdquo;</div>
      ) : (
        <div className="dir-grid">
          {sorted.map((entry) => (
            <DirectoryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

