"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { SearchIcon } from "@/components/ui/SearchIcon";
import { MOCK_USERS } from "./admin-mock";
import type { ApiUser, UserRole } from "@/types/api";

const ROLES: UserRole[] = ["customer", "designer", "merchant", "agent", "admin"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RoleDropdown({
  value,
  onChange,
}: {
  value: UserRole;
  onChange: (r: UserRole) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  return (
    <div className="order-filter" ref={ref}>
      <button
        className={`order-filter-trigger${open ? " is-open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{value}</span>
        <ChevronIcon />
      </button>
      {open && (
        <div className="order-filter-dropdown" role="listbox">
          {ROLES.map((r) => (
            <button
              key={r}
              role="option"
              aria-selected={r === value}
              className={`order-filter-option${r === value ? " is-selected" : ""}`}
              onClick={() => {
                onChange(r);
                setOpen(false);
              }}
            >
              {r}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function UserAccordionItem({
  user,
  open,
  onToggle,
  onRoleChange,
  onBanToggle,
}: {
  user: ApiUser;
  open: boolean;
  onToggle: () => void;
  onRoleChange: (role: UserRole) => void;
  onBanToggle: () => void;
}) {
  return (
    <div className={`oac-item${open ? " is-open" : ""}${user.banned ? " admin-row-banned" : ""}`}>
      <button className="oac-trigger" onClick={onToggle}>
        <div className="oac-trigger-left">
          <Avatar name={user.name} src={user.avatarUrl} size="sm" />
          <div className="oac-trigger-info">
            <span className="oac-product">{user.name}</span>
            <span className="admin-muted" style={{ fontSize: "0.78rem" }}>{user.email}</span>
          </div>
        </div>
        <div className="oac-trigger-right">
          {user.banned
            ? <span className="admin-badge-banned">Banned</span>
            : <span className="admin-badge-active">Active</span>
          }
          <ChevronIcon />
        </div>
      </button>

      <div className="oac-body-wrap">
        <div className="oac-body-inner">
          <div className="oac-body">
            <div className="oac-row">
              <span className="oac-label">Role</span>
              <RoleDropdown value={user.role} onChange={onRoleChange} />
            </div>
            <div className="oac-row">
              <span className="oac-label">Joined</span>
              <span className="admin-muted">{formatDate(user.createdAt)}</span>
            </div>
            <div className="oac-row">
              <button
                className={`admin-action-btn${user.banned ? " admin-action-unban" : " admin-action-ban"}`}
                onClick={onBanToggle}
              >
                {user.banned ? "Unban" : "Ban"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<ApiUser[]>(MOCK_USERS);
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  function handleRoleChange(userId: string, role: UserRole) {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
  }

  function handleBanToggle(user: ApiUser) {
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, banned: !u.banned } : u))
    );
  }

  const filtered = users.filter(
    (u) =>
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-table-wrap">
      <div className="admin-table-toolbar">
        <div className="admin-search-wrap">
          <SearchIcon />
          <input
            className="admin-search-input"
            type="search"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="admin-table-count">{filtered.length} users</span>
      </div>

      <div className="admin-table-card">
        {/* desktop table */}
        <div className="admin-desktop-only">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className={u.banned ? "admin-row-banned" : ""}>
                  <td>
                    <div className="admin-user-cell">
                      <Avatar name={u.name} src={u.avatarUrl} size="sm" />
                      <span className="admin-user-name">{u.name}</span>
                    </div>
                  </td>
                  <td className="admin-muted">{u.email}</td>
                  <td>
                    <RoleDropdown
                      value={u.role}
                      onChange={(r) => handleRoleChange(u.id, r)}
                    />
                  </td>
                  <td>
                    {u.banned
                      ? <span className="admin-badge-banned">Banned</span>
                      : <span className="admin-badge-active">Active</span>
                    }
                  </td>
                  <td className="admin-muted">{formatDate(u.createdAt)}</td>
                  <td>
                    <button
                      className={`admin-action-btn${u.banned ? " admin-action-unban" : " admin-action-ban"}`}
                      onClick={() => handleBanToggle(u)}
                    >
                      {u.banned ? "Unban" : "Ban"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="empty-state">No users found.</div>}
        </div>

        {/* mobile accordion */}
        <div className="orders-accordion admin-mobile-only">
          {filtered.length === 0 && (
            <div className="orders-accordion-empty">No users found.</div>
          )}
          {filtered.map((u) => (
            <UserAccordionItem
              key={u.id}
              user={u}
              open={openId === u.id}
              onToggle={() => setOpenId((prev) => (prev === u.id ? null : u.id))}
              onRoleChange={(r) => handleRoleChange(u.id, r)}
              onBanToggle={() => handleBanToggle(u)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
