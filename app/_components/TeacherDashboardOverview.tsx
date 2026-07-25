"use client";

import * as React from "react";
import Link from "next/link";
import { getTeacherDashboardStatsClient, getMySubjectsClient } from "@/app/_lib/teacher";
import type { TeacherDashboardStats, TeacherSubject } from "@/app/_interfaces/teacher";
import { IconSubjects, IconGrades, IconAssignments } from "./ui/icons";

// AdminLTE-style "small-box" stat widgets, rebuilt with this project's own
// Tailwind + CSS-variable design tokens (--gold / --red-pen / --accent /
// --surface) rather than pulling in the AdminLTE Bootstrap package, so it
// doesn't fight the rest of the app's styling system.
type Tone = "accent" | "gold" | "red" | "muted";

const TONE_CLASSES: Record<Tone, string> = {
  accent: "bg-[var(--accent)]/10 text-[var(--accent)]",
  gold: "bg-[var(--gold)]/10 text-[var(--gold)]",
  red: "bg-[var(--red-pen)]/10 text-[var(--red-pen)]",
  muted: "bg-[var(--surface-2)] text-[var(--text-muted)]",
};

function StatBox({
  label,
  value,
  icon,
  tone,
  loading,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  tone: Tone;
  loading: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
            {label}
          </div>
          <div className="mt-2 font-serif text-3xl font-semibold text-[var(--text)]">
            {loading ? (
              <span className="inline-block h-8 w-12 animate-pulse rounded bg-[var(--surface-2)]" />
            ) : (
              value
            )}
          </div>
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${TONE_CLASSES[tone]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function TeacherDashboardOverview() {
  const [stats, setStats] = React.useState<TeacherDashboardStats | null>(null);
  const [subjects, setSubjects] = React.useState<TeacherSubject[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [statsData, subjectsData] = await Promise.all([
          getTeacherDashboardStatsClient(),
          getMySubjectsClient(),
        ]);
        if (!cancelled) {
          setStats(statsData);
          setSubjects(subjectsData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load dashboard.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const subjectStats = stats?.subjects_performance ?? [];

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
        TEACHER · OVERVIEW
      </p>
      <h1 className="mt-1.5 font-serif text-2xl font-bold text-[var(--text)] sm:text-[28px]">
        Dashboard
      </h1>
      <p className="mt-1.5 text-sm text-[var(--text-muted)]">
        Your assigned subjects, students, and pending grading at a glance.
      </p>

      {error && (
        <div className="mt-5 rounded-2xl border border-[var(--red-pen)]/25 bg-[var(--red-pen)]/10 px-4 py-3 text-sm text-[var(--red-pen)]">
          {error}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link href="/dashboard/subjects">
          <StatBox
            label="Subjects assigned"
            value={stats?.summary.total_assigned_subjects ?? subjects?.length ?? "—"}
            icon={<IconSubjects className="h-5 w-5" />}
            tone="accent"
            loading={loading}
          />
        </Link>
        <StatBox
          label="Students managed"
          value={stats?.summary.total_students_managed ?? "—"}
          icon={<IconGrades className="h-5 w-5" />}
          tone="gold"
          loading={loading}
        />
        <StatBox
          label="Pending grades"
          value={stats?.summary.total_pending_grades ?? "—"}
          icon={<IconAssignments className="h-5 w-5" />}
          tone="muted"
          loading={loading}
        />
      </div>

      <div className="mt-7">
        <div className="flex items-baseline justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            By subject
          </p>
          <Link
            href="/dashboard/subjects"
            className="text-xs font-medium text-[var(--accent)] underline-offset-4 hover:underline"
          >
            View all subjects →
          </Link>
        </div>

        <div className="mt-3 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
          {loading ? (
            <div className="space-y-2 p-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-10 animate-pulse rounded-md bg-[var(--surface-2)]" />
              ))}
            </div>
          ) : subjectStats.length === 0 ? (
            <p className="p-5 text-sm text-[var(--text-muted)]">
              {/* Real endpoint returned an empty array for a 0-subject test account —
                  once a subject is assigned, confirm the item fields below still match. */}
              No per-subject breakdown yet — this fills in once you have assigned subjects.
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--line)] text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                  <th className="px-5 py-2.5">Subject</th>
                  <th className="px-5 py-2.5">Class</th>
                  <th className="px-5 py-2.5">Students</th>
                  <th className="px-5 py-2.5">Passed</th>
                  <th className="px-5 py-2.5">Failed</th>
                  <th className="px-5 py-2.5">Pending</th>
                </tr>
              </thead>
              <tbody>
                {subjectStats.map((s, i) => (
                  <tr key={s.subject_id ?? i} className="border-b border-[var(--line)] last:border-0">
                    <td className="px-5 py-2.5 font-medium text-[var(--text)]">
                      {s.subject_name ?? s.subject_code ?? "—"}
                    </td>
                    <td className="px-5 py-2.5 text-[var(--text-muted)]">
                      {[s.class_name, s.section].filter(Boolean).join(" · ") || "—"}
                    </td>
                    <td className="px-5 py-2.5">{s.total_students ?? "—"}</td>
                    <td className="px-5 py-2.5 text-[var(--gold)]">{s.passed ?? "—"}</td>
                    <td className="px-5 py-2.5 text-[var(--red-pen)]">{s.failed ?? "—"}</td>
                    <td className="px-5 py-2.5">{s.pending_grades ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}