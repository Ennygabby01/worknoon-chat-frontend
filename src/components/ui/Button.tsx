import { type ButtonHTMLAttributes } from "react";
import { Spinner } from "./Spinner";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "default" | "sm";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  full?: boolean;
  loading?: boolean;
};

export function Button({
  variant = "primary",
  size = "default",
  full,
  loading,
  children,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const classes = [
    "btn",
    `btn-${variant}`,
    size === "sm" ? "btn-sm" : "",
    full ? "btn-full" : "",
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button {...props} disabled={disabled ?? loading} className={classes}>
      {loading ? <Spinner /> : children}
    </button>
  );
}
