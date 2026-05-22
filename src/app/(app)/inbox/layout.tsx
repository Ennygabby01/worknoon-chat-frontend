"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ConversationList } from "@/features/inbox/ConversationList";
import { Button } from "@/components/ui/Button";

export default function InboxLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const hasActiveChat = pathname !== "/inbox";

  return (
    <>
      <div className={`inbox-panel${hasActiveChat ? " panel-hidden" : ""}`}>
        <div className="inbox-header">
          <h2 className="inbox-title">Inbox</h2>
          <Button variant="secondary" size="sm">
            New
          </Button>
        </div>

        <div className="inbox-search-wrap">
          <input
            type="search"
            className="inbox-search"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search conversations"
          />
        </div>

        <div className="conversation-list">
          <ConversationList />
        </div>
      </div>

      {children}
    </>
  );
}
