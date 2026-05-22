type AvatarSize = "sm" | "md" | "lg";

type AvatarProps = {
  name: string;
  src?: string | null;
  size?: AvatarSize;
};

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

  return (
    <div className={`avatar avatar-${size}`} aria-label={name}>
      {initials(name)}
    </div>
  );
}
