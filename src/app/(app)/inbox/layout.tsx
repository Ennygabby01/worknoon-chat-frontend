"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ConversationList } from "@/features/inbox/ConversationList";
import { NewConversationDrawer, type ConversationEntry } from "@/features/new-conversation/NewConversationDrawer";
import { SupportBotView } from "@/features/support-bot/SupportBotView";
import { BrowsePanel } from "@/features/new-conversation/BrowsePanel";
import { useSession } from "@/lib/session/session-context";
import type { ConversationFilter, ConversationSort } from "@/features/inbox/ConversationList";

const PRIVILEGED_FILTERS: ConversationFilter[] = ["all", "open", "escalated", "assigned", "resolved"];
const BASIC_FILTERS: ConversationFilter[] = ["all", "open", "resolved"];

const FILTER_LABELS: Record<ConversationFilter, string> = {
  all: "All",
  open: "Open",
  escalated: "Escalated",
  assigned: "Assigned",
  resolved: "Resolved",
};

export default function InboxLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { session } = useSession();
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeEntry, setActiveEntry] = useState<ConversationEntry | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sort, setSort] = useState<ConversationSort>("newest");
  const [filter, setFilter] = useState<ConversationFilter>("all");
  const filterRef = useRef<HTMLDivElement>(null);

  const role = session?.user.role;
  const filterOptions = (role === "admin" || role === "agent") ? PRIVILEGED_FILTERS : BASIC_FILTERS;

  const effectiveFilter = filterOptions.includes(filter) ? filter : "all";
  const hasActiveChat = pathname !== "/inbox" || activeEntry !== null;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }
    if (filterOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [filterOpen]);

  function handleSelect(entry: ConversationEntry) {
    setActiveEntry(entry);
  }

  function handleEntryClose() {
    setActiveEntry(null);
  }

  return (
    <>
      <div className={`inbox-panel${hasActiveChat ? " panel-hidden" : ""}`}>
        <div className="inbox-header">
          <h2 className="inbox-title">Inbox</h2>
        </div>

        <div className="inbox-search-wrap">
          <div className="inbox-search-row">
            <SearchIcon />
            <input
              type="search"
              className="inbox-search"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search conversations"
            />
            <div className="inbox-filter-wrap" ref={filterRef}>
              <button
                className={`inbox-filter-btn${filterOpen ? " is-active" : ""}${filter !== "all" ? " has-filter" : ""}`}
                type="button"
                aria-label="Filter conversations"
                aria-expanded={filterOpen}
                onClick={() => setFilterOpen((v) => !v)}
              >
                <FilterIcon />
              </button>
              {filterOpen && (
                <div className="inbox-filter-dropdown">
                  <p className="inbox-filter-group-label">Sort</p>
                  {(["newest", "oldest"] as ConversationSort[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`inbox-filter-option${sort === s ? " is-selected" : ""}`}
                      onClick={() => { setSort(s); setFilterOpen(false); }}
                    >
                      {s === "newest" ? "Newest first" : "Oldest first"}
                    </button>
                  ))}
                  <div className="inbox-filter-divider" />
                  <p className="inbox-filter-group-label">Filter</p>
                  {filterOptions.map((f) => (
                    <button
                      key={f}
                      type="button"
                      className={`inbox-filter-option${filter === f ? " is-selected" : ""}`}
                      onClick={() => { setFilter(f); setFilterOpen(false); }}
                    >
                      {FILTER_LABELS[f]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="conversation-list">
          <ConversationList search={search} sort={sort} filter={effectiveFilter} />
        </div>

        <button
          className="inbox-fab"
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="New conversation"
        >
          <ComposeIcon />
        </button>
      </div>

      {activeEntry === "support" ? (
        <SupportBotView onClose={handleEntryClose} />
      ) : activeEntry === "browse-designer" ? (
        <BrowsePanel role="designer" onClose={handleEntryClose} />
      ) : activeEntry === "browse-merchant" ? (
        <BrowsePanel role="merchant" onClose={handleEntryClose} />
      ) : (
        children
      )}

      <NewConversationDrawer
        open={drawerOpen}
        currentRole={role}
        onClose={() => setDrawerOpen(false)}
        onSelect={handleSelect}
      />
    </>
  );
}

function ComposeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M19.186 2.09c.521.25 1.136.612 1.625 1.101.49.49.852 1.104 1.1 1.625.313.654.11 1.408-.401 1.92l-7.214 7.213c-.31.31-.688.541-1.105.675l-4.222 1.353a.75.75 0 0 1-.943-.944l1.353-4.221a2.75 2.75 0 0 1 .674-1.105l7.214-7.214c.512-.512 1.266-.714 1.92-.402zm.211 2.516a3.608 3.608 0 0 0-.828-.586l-6.994 6.994a1.002 1.002 0 0 0-.178.241L9.9 14.102l2.846-1.496c.09-.047.171-.107.242-.178l6.994-6.994a3.61 3.61 0 0 0-.586-.828zM4.999 5.5A.5.5 0 0 1 5.47 5l5.53.005a1 1 0 0 0 0-2L5.5 3A2.5 2.5 0 0 0 3 5.5v12.577c0 .76.082 1.185.319 1.627.224.419.558.754.977.978.442.236.866.318 1.627.318h12.154c.76 0 1.185-.082 1.627-.318.42-.224.754-.559.978-.978.236-.442.318-.866.318-1.627V13a1 1 0 1 0-2 0v5.077c0 .459-.021.571-.082.684a.364.364 0 0 1-.157.157c-.113.06-.225.082-.684.082H5.923c-.459 0-.57-.022-.684-.082a.363.363 0 0 1-.157-.157c-.06-.113-.082-.225-.082-.684V5.5z" fill="currentColor" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.027 9.92L16 13.95 14 16l-4.075-3.976A6.465 6.465 0 0 1 6.5 13C2.91 13 0 10.083 0 6.5 0 2.91 2.917 0 6.5 0 10.09 0 13 2.917 13 6.5a6.463 6.463 0 0 1-.973 3.42zM1.997 6.452c0 2.48 2.014 4.5 4.5 4.5 2.48 0 4.5-2.015 4.5-4.5 0-2.48-2.015-4.5-4.5-4.5-2.48 0-4.5 2.014-4.5 4.5z" fillRule="evenodd" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M204,128a12.00028,12.00028,0,0,1-12,12H64a12,12,0,0,1,0-24H192A12.00028,12.00028,0,0,1,204,128Zm28-60H24a12,12,0,0,0,0,24H232a12,12,0,0,0,0-24Zm-80,96H104a12,12,0,0,0,0,24h48a12,12,0,0,0,0-24Z" />
    </svg>
  );
}
