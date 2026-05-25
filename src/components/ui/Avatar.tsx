type AvatarSize = "sm" | "md" | "lg" | "xl";

type AvatarProps = {
  name: string;
  src?: string | null;
  size?: AvatarSize;
};

const PALETTE = [
  { bg: "#f0fdf9", text: "#0d7268" },
  { bg: "#eff6ff", text: "#2563eb" },
  { bg: "#fdf4ff", text: "#9333ea" },
  { bg: "#fff7ed", text: "#c2410c" },
  { bg: "#fef2f2", text: "#dc2626" },
  { bg: "#f0fdf4", text: "#15803d" },
  { bg: "#fefce8", text: "#a16207" },
  { bg: "#fdf2f8", text: "#be185d" },
];

function nameColorIndex(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  }
  return h % PALETTE.length;
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="55%" height="55%" aria-hidden>
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
    </svg>
  );
}

export function Avatar({ name, src, size = "md" }: AvatarProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={name} className={`avatar avatar-${size}`} />
    );
  }

  const { bg, text } = PALETTE[nameColorIndex(name)];

  return (
    <div
      className={`avatar avatar-${size}`}
      aria-label={name || "User"}
      style={{ background: bg, color: text, borderColor: "transparent" }}
    >
      <PersonIcon />
    </div>
  );
}
