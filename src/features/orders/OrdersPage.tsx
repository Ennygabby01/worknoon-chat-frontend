"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MOCK_ORDERS, STATUS_LABEL, type MockOrder, type OrderStatus } from "./orders-mock";

const PAGE_SIZE = 5;

function ChatBtnIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 233.058 233.058" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M116.538,4.05C52.284,4.05,0,45.321,0,96.043c0,28.631,16.729,55.208,45.889,72.911c4.525,2.737,7.635,7.283,8.572,12.478c2.876,16.045-0.991,32.948-6.758,47.576c19.239-9.134,39.064-23.161,54.8-36.63c3.879-3.314,9.055-4.701,14.087-4.354h0.023c64.191,0,116.445-41.259,116.445-91.987C233.058,45.321,180.792,4.05,116.538,4.05z" />
    </svg>
  );
}

const currencyFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function compactNumber(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  if (n >= 1_000_000)     return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000)         return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

function compactCurrency(n: number): string {
  if (n >= 1_000_000_000) return "$" + (n / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  if (n >= 1_000_000)     return "$" + (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000)         return "$" + (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return currencyFmt.format(n);
}

const STATUS_META: Record<OrderStatus, { cls: string }> = {
  pending:    { cls: "order-status--pending" },
  processing: { cls: "order-status--processing" },
  shipped:    { cls: "order-status--shipped" },
  delivered:  { cls: "order-status--delivered" },
  cancelled:  { cls: "order-status--cancelled" },
  returned:   { cls: "order-status--returned" },
};

type FilterValue = "all" | OrderStatus;

const FILTER_OPTIONS: { value: FilterValue; label: string }[] = [
  { value: "all",        label: "All orders" },
  { value: "pending",    label: STATUS_LABEL.pending },
  { value: "processing", label: STATUS_LABEL.processing },
  { value: "shipped",    label: STATUS_LABEL.shipped },
  { value: "delivered",  label: STATUS_LABEL.delivered },
  { value: "cancelled",  label: STATUS_LABEL.cancelled },
  { value: "returned",   label: STATUS_LABEL.returned },
];

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`order-status ${STATUS_META[status].cls}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

function StatusFilterDropdown({
  value,
  onChange,
}: {
  value: FilterValue;
  onChange: (v: FilterValue) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const selected = FILTER_OPTIONS.find((o) => o.value === value)!;

  return (
    <div className="order-filter" ref={ref}>
      <button
        className={`order-filter-trigger${open ? " is-open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{selected.label}</span>
        <ChevronIcon />
      </button>

      {open && (
        <div className="order-filter-dropdown" role="listbox">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              className={`order-filter-option${opt.value === value ? " is-selected" : ""}`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.value !== "all" && (
                <span className={`order-filter-dot order-filter-dot--${opt.value}`} />
              )}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function summary() {
  const total = MOCK_ORDERS.length;
  const delivered = MOCK_ORDERS.filter((o) => o.status === "delivered").length;
  const active = MOCK_ORDERS.filter(
    (o) => o.status === "shipped" || o.status === "processing",
  ).length;
  const spent = MOCK_ORDERS.filter(
    (o) => o.status !== "cancelled" && o.status !== "returned",
  ).reduce((sum, o) => sum + o.amount, 0);
  return { total, delivered, active, spent };
}

export function OrdersPage() {
  const { total, delivered, active, spent } = summary();
  const [filter, setFilter] = useState<FilterValue>("all");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered =
    filter === "all" ? MOCK_ORDERS : MOCK_ORDERS.filter((o) => o.status === filter);

  function handleFilterChange(v: FilterValue) {
    setFilter(v);
    setVisible(PAGE_SIZE);
    setOpenId(null);
  }

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  return (
    <>
      <div className="orders-stats">
        <StatCard label="Total orders" value={compactNumber(total)}    icon={<BagIcon />} />
        <StatCard label="Delivered"    value={compactNumber(delivered)} icon={<CheckIcon />} />
        <StatCard label="In progress"  value={compactNumber(active)}   icon={<TruckIcon />} />
        <StatCard label="Total spent"  value={compactCurrency(spent)}  icon={<WalletIcon />} />
      </div>

      <div className="orders-card">
        <div className="orders-table-header">
          <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>Your orders</span>
          <StatusFilterDropdown value={filter} onChange={handleFilterChange} />
        </div>

        {/* desktop table */}
        <div className="orders-table-wrap orders-desktop-only">
          <table className="data-table orders-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Product</th>
                <th>Seller</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Placed</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {shown.map((order, i) => (
                <OrderRow key={order.id} order={order} priority={i === 0} />
              ))}
              {shown.length === 0 && (
                <tr>
                  <td colSpan={7} className="orders-empty">
                    No orders match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* mobile accordion */}
        <div className="orders-accordion orders-mobile-only">
          {shown.length === 0 && (
            <div className="orders-accordion-empty">No orders match this filter.</div>
          )}
          {shown.map((order, i) => (
            <OrderAccordionItem
              key={order.id}
              order={order}
              priority={i === 0}
              open={openId === order.id}
              onToggle={() => setOpenId((prev) => (prev === order.id ? null : order.id))}
            />
          ))}
        </div>

        {hasMore && (
          <div className="orders-load-more">
            <button
              className="orders-load-more-btn"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
            >
              Load more
              <span className="orders-load-more-count">
                {filtered.length - visible} remaining
              </span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function OrderRow({ order, priority }: { order: MockOrder; priority?: boolean }) {
  return (
    <tr>
      <td>
        <span className="order-id">{order.id}</span>
      </td>
      <td>
        <div className="order-product-cell">
          <div className="order-product-img-wrap">
            <Image
              src={`https://picsum.photos/id/${order.imageId}/64/64`}
              alt={order.product}
              width={40}
              height={40}
              className="order-product-img"
              priority={priority}
            />
          </div>
          <span style={{ fontWeight: 500 }}>{order.product}</span>
        </div>
      </td>
      <td>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span>{order.seller}</span>
          <span className={`order-seller-role order-seller-role--${order.sellerRole}`}>
            {order.sellerRole}
          </span>
        </div>
      </td>
      <td style={{ fontWeight: 600 }}>{currencyFmt.format(order.amount)}</td>
      <td>
        <OrderStatusBadge status={order.status} />
      </td>
      <td style={{ color: "var(--color-muted)" }}>{formatDate(order.placedAt)}</td>
      <td>
        {order.conversationId ? (
          <Link href={`/inbox/${order.conversationId}`} className="order-chat-btn">
            <ChatBtnIcon />Chat
          </Link>
        ) : (
          <span className="order-chat-btn order-chat-btn--disabled"><ChatBtnIcon />Chat</span>
        )}
      </td>
    </tr>
  );
}

function OrderAccordionItem({
  order,
  priority,
  open,
  onToggle,
}: {
  order: MockOrder;
  priority?: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`oac-item${open ? " is-open" : ""}`}>
      <button className="oac-trigger" onClick={onToggle}>
        <div className="oac-trigger-left">
          <div className="order-product-img-wrap">
            <Image
              src={`https://picsum.photos/id/${order.imageId}/64/64`}
              alt={order.product}
              width={40}
              height={40}
              className="order-product-img"
              priority={priority}
            />
          </div>
          <div className="oac-trigger-info">
            <span className="oac-product">{order.product}</span>
            <span className="order-id">{order.id}</span>
          </div>
        </div>
        <div className="oac-trigger-right">
          <OrderStatusBadge status={order.status} />
          <ChevronIcon />
        </div>
      </button>

      <div className="oac-body-wrap">
        <div className="oac-body-inner">
          <div className="oac-body">
            <div className="oac-row">
              <span className="oac-label">Seller</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span>{order.seller}</span>
                <span className={`order-seller-role order-seller-role--${order.sellerRole}`}>
                  {order.sellerRole}
                </span>
              </div>
            </div>
            <div className="oac-row">
              <span className="oac-label">Amount</span>
              <span style={{ fontWeight: 600 }}>{currencyFmt.format(order.amount)}</span>
            </div>
            <div className="oac-row">
              <span className="oac-label">Placed</span>
              <span style={{ color: "var(--color-muted)" }}>{formatDate(order.placedAt)}</span>
            </div>
            <div className="oac-row">
              {order.conversationId ? (
                <Link href={`/inbox/${order.conversationId}`} className="order-chat-btn">
                  <ChatBtnIcon />Chat with seller
                </Link>
              ) : (
                <span className="order-chat-btn order-chat-btn--disabled"><ChatBtnIcon />Chat with seller</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="card orders-stat-card">
      <div className="osc-bg-icon" aria-hidden>{icon}</div>
      <div className="orders-stat-value">{value}</div>
      <div className="orders-stat-label">{label}</div>
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
    </svg>
  );
}
