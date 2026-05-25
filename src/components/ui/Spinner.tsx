type SpinnerProps = {
  size?: "default" | "lg";
  inverted?: boolean;
};

export function Spinner({ size = "default", inverted }: SpinnerProps) {
  const classes = [
    "spinner",
    size === "lg" ? "spinner-lg" : "",
    inverted ? "spinner-inverted" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classes} role="status" aria-label="Loading" />;
}
