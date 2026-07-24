"use client";

import * as React from "react";
import Link from "next/link";
import { getStoredUser } from "@/app/_lib/auth";
import type { StoredUser } from "@/app/_interfaces/auth";

type QuickLink = {
  href: string;
  label: string;
  desc: string;
};

const ROLE_COPY: Record<
  "teacher" | "student",
  { eyebrow: string; heading: string; sub: string; links: QuickLink[] }
> = {
  teacher: {
    eyebrow: "TEACHER · OVERVIEW",
    heading: "Welcome back",
    sub: "Manage your classes, take attendance, and review grades.",
    links: [
      {
        href: "/dashboard/classes",
        label: "Classes",
        desc: "Manage your batches",
      },
      {
        href: "/dashboard/grades",
        label: "Grades",
        desc: "Review and enter marks",
      },
      {
        href: "/dashboard/attendance",
        label: "Attendance",
        desc: "Take today's attendance",
      },
    ],
  },
  student: {
    eyebrow: "STUDENT · OVERVIEW",
    heading: "Welcome back",
    sub: "Track your grades, assignments, and attendance.",
    links: [
      {
        href: "/dashboard/subjects",
        label: "My Subjects",
        desc: "See your enrolled subjects",
      },
      {
        href: "/dashboard/grades",
        label: "Grades",
        desc: "Check your latest marks",
      },
      {
        href: "/dashboard/assignments",
        label: "Assignments",
        desc: "View pending work",
      },
    ],
  },
};

export default function DashboardOverview() {
  const [user, setUser] = React.useState<StoredUser | null>(null);

  React.useEffect(() => {
    setUser(getStoredUser());
  }, []);

  if (!user) {
    return (
      <div className="animate-pulse">
        <div className="h-[140px] rounded-2xl bg-[var(--chalkboard)]" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-32 rounded-2xl border border-[var(--line)] bg-[var(--surface)]/60"
            />
          ))}
        </div>
      </div>
    );
  }

  const copy =
    ROLE_COPY[user.role as "teacher" | "student"] ?? ROLE_COPY.student;

  return (
    <div>
      {/* Hero banner — the "chalkboard" panel, always dark by design in either theme */}
      <div
        className="relative overflow-hidden rounded-2xl bg-[var(--chalkboard)] px-6 py-7 ring-1 ring-white/[0.06] sm:px-8 sm:py-8"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 1px, transparent 1px, transparent 34px)",
        }}
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
              {copy.eyebrow}
            </p>
            <h1 className="mt-1.5 font-serif text-[28px] font-bold leading-tight text-[var(--chalk)] sm:text-3xl">
              {copy.heading}
            </h1>
            <p className="mt-2 max-w-md text-sm text-[var(--chalk)]/70">
              {copy.sub}
            </p>
          </div>

          {/* Verified seal */}
          <div className="hidden shrink-0 flex-col items-center gap-1 sm:flex">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--gold)]/70 text-[var(--gold)]">
              <span className="font-serif text-lg font-bold">
                {user.role === "teacher" ? "T" : "S"}
              </span>
            </div>
            <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--gold)]/80">
              Verified
            </span>
          </div>
        </div>
      </div>

      {/* Quick access label */}
      <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
        Quick access
      </p>

      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {copy.links.map((link) => (
          <Link key={link.href} href={link.href} className="group block">
            <div className="relative flex h-full flex-col justify-between rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-[var(--accent)]/40 group-hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.35)]">
              <div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-ink)] transition-colors group-hover:bg-[var(--accent-hover)]">
                  <span className="font-serif text-sm font-bold">
                    {link.label.charAt(0)}
                  </span>
                </div>
                <div className="mt-3 font-serif text-base font-bold text-[var(--text)]">
                  {link.label}
                </div>
                <div className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">
                  {link.desc}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[var(--gold)] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                Open
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                  →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-center text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]/70 sm:text-left">
        Gradebook · Student &amp; Teacher Portal
      </p>
    </div>
  );
}
