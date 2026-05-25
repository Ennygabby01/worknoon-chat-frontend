"use client";

import { useRef } from "react";

type OtpInputProps = {
  value: string[];
  onChange: (value: string[]) => void;
};

export function OtpInput({ value, onChange }: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  function updateDigit(index: number, rawValue: string) {
    const digits = rawValue.replace(/\D/g, "").split("");

    if (digits.length > 1) {
      const next = [...value];
      for (let offset = 0; offset < digits.length && index + offset < next.length; offset += 1) {
        next[index + offset] = digits[offset];
      }
      onChange(next);
      refs.current[Math.min(index + digits.length, value.length) - 1]?.focus();
      return;
    }

    const digit = digits[0] ?? "";
    const next = [...value];
    next[index] = digit;
    onChange(next);

    if (digit && index < value.length - 1) {
      refs.current[index + 1]?.focus();
    }
  }

  function handlePaste(rawValue: string) {
    const digits = rawValue.replace(/\D/g, "").slice(0, value.length).split("");
    if (digits.length === 0) return;

    const next = [...value];
    for (let index = 0; index < next.length; index += 1) {
      next[index] = digits[index] ?? "";
    }
    onChange(next);
    refs.current[Math.min(digits.length, value.length) - 1]?.focus();
  }

  return (
    <div className="otp-group" aria-label="Verification code">
      {value.map((digit, index) => (
        <input
          key={index}
          suppressHydrationWarning
          ref={(el) => {
            refs.current[index] = el;
          }}
          className={`otp-digit${digit ? " filled" : ""}`}
          value={digit}
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          aria-label={`Digit ${index + 1}`}
          onChange={(event) => updateDigit(index, event.target.value)}
          onPaste={(event) => {
            event.preventDefault();
            handlePaste(event.clipboardData.getData("text"));
          }}
          onKeyDown={(event) => {
            if (event.key === "Backspace" && !digit && index > 0) {
              refs.current[index - 1]?.focus();
            }
          }}
        />
      ))}
    </div>
  );
}
