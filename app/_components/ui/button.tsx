// app/_components/ui/button.tsx
import * as React from "react";
import { cn } from "../../_lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", loading, disabled, children, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold",
          "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]",
          "disabled:cursor-not-allowed disabled:opacity-60",
          variant === "primary" &&
            "bg-[var(--accent)] text-[var(--accent-ink)] hover:bg-[var(--accent-hover)]",
          variant === "ghost" &&
            "border border-[var(--line)] bg-transparent text-[var(--text)] hover:bg-[var(--surface-2)]",
          className
        )}
        {...props}
      >
        {loading && (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden
          />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
