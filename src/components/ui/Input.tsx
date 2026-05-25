import { forwardRef, type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, id, className = "", ...props },
  ref
) {
  return (
    <div className="field">
      {label && (
        <label className="field-label" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        suppressHydrationWarning
        className={`field-input${error ? " has-error" : ""} ${className}`}
        {...props}
      />
      {error && <span className="field-error">{error}</span>}
    </div>
  );
});
