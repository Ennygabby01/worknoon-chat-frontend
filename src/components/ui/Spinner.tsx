type SpinnerProps = {
  size?: "default" | "lg";
};

export function Spinner({ size = "default" }: SpinnerProps) {
  return (
    <div
      className={`spinner${size === "lg" ? " spinner-lg" : ""}`}
      role="status"
      aria-label="Loading"
    />
  );
}
