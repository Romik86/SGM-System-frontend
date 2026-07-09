// app/_components/ui/input.tsx
import * as React from "react";
import { cn } from "../../_lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-md border bg-[var(--surface)] px-3.5 py-1.5 text-sm text-[var(--text)]",
          "placeholder:text-[var(--text-muted)] outline-none transition-all duration-150",
          "border-b-2",
          error
            ? "border-[var(--line)] border-b-[var(--red-pen)]"
            : "border-[var(--line)] focus:border-b-[var(--red-pen)]",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={htmlFor}
        className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--text-muted)]"
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-[var(--red-pen)]">
          <span aria-hidden>✕</span> {error}
        </p>
      )}
    </div>
  );
}
