// app/_components/ui/alert-banner.tsx
export function AlertBanner({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-md border border-[var(--red-pen)]/30 bg-[var(--red-pen)]/10 px-3.5 py-2.5 text-sm text-[var(--red-pen)]"
    >
      <span aria-hidden className="mt-0.5">✕</span>
      <span>{message}</span>
    </div>
  );
}
