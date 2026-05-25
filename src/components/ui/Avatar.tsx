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

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
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
      aria-label={name}
      style={{ background: bg, color: text, borderColor: "transparent" }}
    >
      {initials(name)}
    </div>
  );
}
