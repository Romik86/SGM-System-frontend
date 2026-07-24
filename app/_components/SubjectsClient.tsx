"use client";

import * as React from "react";
import { getMySubjectsClient } from "@/app/_lib/subjects";
import { IconSubjects } from "./ui/icons";
import type { Subject } from "@/app/_interfaces/subject";

export default function SubjectsClient() {
  const [subjects, setSubjects] = React.useState<Subject[] | null>(null);
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
      {/* Header — same eyebrow/serif pattern as Classes */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
          SUBJECTS
        </p>
        <h1 className="mt-1.5 font-serif text-2xl font-bold text-[var(--text)] sm:text-[28px]">
          My Subjects
        </h1>
        <p className="mt-1.5 text-sm text-[var(--text-muted)]">
          Subjects for the class you&apos;ve joined.
        </p>
      </div>

      {/* Subjects list */}
      <div className="mt-7">
        <div className="flex items-baseline justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            {subjects
              ? `${subjects.length} subject${subjects.length === 1 ? "" : "s"}`
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
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-2xl border border-[var(--line)] bg-[var(--surface)]/60"
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
              No subjects found for your class yet.
            </p>
          </div>
        )}

        {!error && subjects && subjects.length > 0 && (
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="group relative flex h-full flex-col justify-between rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.35)]"
              >
                <div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-ink)]">
                    <IconSubjects className="h-4 w-4" />
                  </div>
                  <div className="mt-3 font-serif text-base font-bold text-[var(--text)]">
                    {subject.name}
                  </div>
                  <div className="mt-0.5 font-mono text-xs uppercase tracking-[0.06em] text-[var(--text-muted)]">
                    {subject.code}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <div className="flex-1 rounded-full border border-[var(--line)] bg-[var(--bg)] px-3 py-1.5 text-center">
                    <div className="text-[10px] uppercase tracking-[0.08em] text-[var(--text-muted)]">
                      Pass
                    </div>
                    <div className="text-sm font-semibold text-[var(--text)]">
                      {subject.pass_marks}
                    </div>
                  </div>
                  <div className="flex-1 rounded-full border border-[var(--line)] bg-[var(--bg)] px-3 py-1.5 text-center">
                    <div className="text-[10px] uppercase tracking-[0.08em] text-[var(--text-muted)]">
                      Full
                    </div>
                    <div className="text-sm font-semibold text-[var(--text)]">
                      {subject.full_marks}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}