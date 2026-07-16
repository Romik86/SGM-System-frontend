import * as React from "react";

interface LoaderProps {
  size?: number;
  className?: string;
}

/** Small inline spinner — use inside buttons or next to text. */
export function Loader({ size = 16, className = "" }: LoaderProps) {
  return (
    <svg
      className={`animate-spin ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label="Loading"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

interface LoaderOverlayProps {
  message?: string;
}

/** Full-screen overlay — use while a form is submitting. */
export function LoaderOverlay({ message = "Please wait..." }: LoaderOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-black/40 backdrop-blur-sm">
      <Loader size={32} className="text-[var(--accent)]" />
      <p className="text-sm font-medium text-white">{message}</p>
    </div>
  );
}