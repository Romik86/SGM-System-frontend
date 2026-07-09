// app/_components/theme-toggle.tsx
"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { cn } from "../_lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    // avoid hydration mismatch — reserve the space silently
    return <div className={cn("h-9 w-16", className)} aria-hidden />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative inline-flex h-9 w-16 items-center rounded-full border transition-colors duration-300",
        "border-[var(--line)] bg-[var(--surface-2)]",
        className
      )}
    >
      <span
        className={cn(
          "absolute left-1 flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold",
          "bg-[var(--accent)] text-[var(--accent-ink)] shadow-sm transition-transform duration-300 ease-out",
          isDark ? "translate-x-7" : "translate-x-0"
        )}
      >
        {isDark ? "🌙" : "☀︎"}
      </span>
    </button>
  );
}
