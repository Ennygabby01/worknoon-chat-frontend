"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { createConversation } from "@/lib/api/conversations";
import { MOCK_MODE, MOCK_USERS } from "@/lib/mock";
import { usePresence } from "@/lib/realtime/online-status-context";
import { useSession } from "@/lib/session/session-context";
import type { UserRole } from "@/types/api";
import type { ApiUser } from "@/types/api";

type BrowsePanelProps = {
  role: "designer" | "merchant";
  onClose: () => void;
};

const ROLE_LABEL: Record<string, string> = {
  designer: "Designers",
  merchant: "Merchants",
};

const ROLE_SUBTITLE: Record<string, string> = {
  designer: "Choose a designer to message about your project",
  merchant: "Choose a merchant to ask about a product",
};

function BrowseRow({
  user,
  onStart,
  starting,
}: {
  user: ApiUser;
  onStart: (user: ApiUser) => void;
  starting: boolean;
}) {
  const presence = usePresence(user.id);
  return (
    <div className="browse-row">
      <div className="avatar-wrap">
        <Avatar name={user.name} src={user.avatarUrl} size="md" />
        {presence !== "offline" && (
          <span className={`online-dot online-dot--${presence}`} aria-label={presence} />
        )}
      </div>
      <div className="browse-row-info">
        <span className="browse-row-name">{user.name}</span>
        <span className="browse-row-role">
          <Badge label={user.role} />
        </span>
      </div>
      <button
        type="button"
        className="browse-row-action"
        onClick={() => onStart(user)}
        disabled={starting}
      >
        Message
      </button>
    </div>
  );
}

export function BrowsePanel({ role, onClose }: BrowsePanelProps) {
  const router = useRouter();
  const { session } = useSession();
  const [startingUserId, setStartingUserId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const contacts: ApiUser[] = MOCK_MODE
    ? MOCK_USERS.filter((u) => u.role === (role as UserRole))
    : [];

  async function handleStart(user: ApiUser) {
    setStartingUserId(user.id);
    setError("");
    try {
      const conversation = await createConversation({
        participantIds: [user.id],
        type: "direct",
      }, session!.user.id);
      onClose();
      router.push(`/inbox/${conversation.id}`);
    } catch {
      setError("We could not start that conversation. Please try again.");
      setStartingUserId(null);
    }
  }

  return (
    <div className="chat-area panel-active">
      <div className="browse-panel">
        <div className="browse-header">
          <button className="browse-back" onClick={onClose} aria-label="Back">
            <BackIcon />
          </button>
          <div className="browse-heading-wrap">
            <span className="browse-heading">{ROLE_LABEL[role]}</span>
            <span className="browse-sub">{ROLE_SUBTITLE[role]}</span>
          </div>
        </div>

        {error && <div className="error-banner" style={{ margin: "12px 20px 0" }}>{error}</div>}

        <div className="browse-list">
          {contacts.length === 0 && (
            <div className="empty-state">No {ROLE_LABEL[role].toLowerCase()} available.</div>
          )}
          {contacts.map((user) => (
            <BrowseRow
              key={user.id}
              user={user}
              onStart={handleStart}
              starting={startingUserId !== null}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
