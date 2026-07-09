// app/_components/auth-shell.tsx
import * as React from "react";
import { ThemeToggle } from "./theme-toggle";

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-[var(--bg)] text-[var(--text)] lg:grid-cols-[1.1fr_1fr]">
      {/* Form column */}
      <div className="flex flex-col justify-between px-6 py-6 sm:px-12 lg:px-16 lg:order-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--accent)] font-serif text-lg font-semibold text-[var(--accent)]">
              G
            </div>
            <span className="font-serif text-lg font-semibold tracking-tight">
              Gradebook
            </span>
          </div>
          <ThemeToggle />
        </div>

        <div className="mx-auto w-full max-w-sm py-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--accent)]">
            {eyebrow}
          </p>
          <h1 className="mt-2 font-serif text-2xl font-semibold leading-tight text-[var(--text)]">
            {title}
          </h1>
          <p className="mt-1.5 text-sm text-[var(--text-muted)]">{subtitle}</p>

          <div className="mt-4">{children}</div>
        </div>

        <div className="text-center text-sm text-[var(--text-muted)] lg:text-left">
          {footer}
        </div>
      </div>

      {/* Signature panel */}
      <div className="relative hidden overflow-hidden bg-[var(--chalkboard)] lg:flex lg:flex-col lg:justify-between lg:p-14 lg:order-1">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 28px)",
          }}
          aria-hidden
        />

        <p className="relative font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--chalk)]/60">
          Gradebook · Student &amp; Teacher Portal
        </p>

        <div className="relative max-w-md">
          <blockquote className="font-serif text-2xl italic leading-snug text-[var(--chalk)]">
            &ldquo;Every grade tells a story — we just make it easier to
            read.&rdquo;
          </blockquote>
        </div>

        {/* grade-stamp signature */}
        <div className="relative flex items-center gap-4">
          <div className="flex h-20 w-20 -rotate-6 items-center justify-center rounded-full border-[3px] border-[var(--gold)] text-[var(--gold)]">
            <div className="text-center leading-none">
              <div className="font-serif text-2xl font-bold">A+</div>
              <div className="mt-1 font-mono text-[8px] uppercase tracking-widest">
                Verified
              </div>
            </div>
          </div>
          <p className="text-sm text-[var(--chalk)]/70">
            Trusted by classrooms to keep grading fair, fast, and
            transparent.
          </p>
        </div>
      </div>
    </div>
  );
}
