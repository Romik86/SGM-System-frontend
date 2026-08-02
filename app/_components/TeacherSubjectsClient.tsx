"use client";

import * as React from "react";
import Link from "next/link";
import { getMySubjectsClient } from "@/app/_lib/teacher";
import { IconSubjects } from "./ui/icons";
import type { TeacherSubject } from "@/app/_interfaces/teacher";

export default function TeacherSubjectsClient() {
  const [subjects, setSubjects] = React.useState<TeacherSubject[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getMySubjectsClient();
        if (!cancelled) setSubjects(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load subjects.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
          TEACHER · SUBJECTS
        </p>
        <h1 className="mt-1.5 font-serif text-2xl font-bold text-[var(--text)] sm:text-[28px]">
          My Subjects
        </h1>
        <p className="mt-1.5 text-sm text-[var(--text-muted)]">
          Subjects you&apos;re assigned to teach. Open one to view students and enter grades.
        </p>
      </div>

      <div className="mt-7">
        <div className="flex items-baseline justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            {subjects
              ? `${subjects.length} subject${subjects.length === 1 ? "" : "s"} assigned`
              : "Loading"}
          </p>
        </div>

        {error && (
          <div className="mt-3 rounded-2xl border border-[var(--red-pen)]/25 bg-[var(--red-pen)]/10 px-4 py-3 text-sm text-[var(--red-pen)]">
            {error}
          </div>
        )}

        {!error && subjects === null && (
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-36 animate-pulse rounded-2xl border border-[var(--line)] bg-[var(--surface)]/60"
              />
            ))}
          </div>
        )}

        {!error && subjects !== null && subjects.length === 0 && (
          <div className="mt-3 rounded-2xl border border-dashed border-[var(--line)] px-6 py-14 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
              <IconSubjects className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm text-[var(--text-muted)]">
              You don&apos;t have any assigned subjects yet.
            </p>
          </div>
        )}

        {!error && subjects && subjects.length > 0 && (
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <Link
                key={subject.id}
                href={`/dashboard/subjects/${subject.id}`}
                className="group relative flex h-full flex-col justify-between rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.35)]"
              >
                <div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-ink)]">
                    <IconSubjects className="h-4 w-4" />
                  </div>
                  <div className="mt-3 font-serif text-base font-bold text-[var(--text)]">
                    {subject.name}
                  </div>
                  <div className="mt-0.5 font-mono text-xs uppercase tracking-wide text-[var(--text-muted)]">
                    {subject.code}
                  </div>
                  <div className="mt-2.5 text-xs text-[var(--text-muted)]">
                    {subject.class_name} · Section {subject.section}
                  </div>
                  <div className="mt-0.5 text-xs text-[var(--text-muted)]">
                    {subject.batch_name} · {subject.academic_year}
                  </div>
                </div>

                <div className="mt-4 self-start rounded-full border border-[var(--line)] bg-[var(--bg)] px-3 py-1.5 text-xs font-semibold text-[var(--text)]">
                  Full {subject.full_marks} · Pass {subject.pass_marks}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}