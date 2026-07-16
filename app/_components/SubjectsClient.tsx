"use client";

import * as React from "react";
import { getMySubjectsClient } from "@/app/_lib/subjects";
import { Card, SectionTitle } from "./ui/cards";
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
      <h1 className="text-xl font-semibold text-[var(--text)]">My Subjects</h1>
      <p className="mt-2 text-sm text-[var(--text-muted)]">
        Subjects for the class you&apos;ve joined.
      </p>

      <div className="mt-6">
        <Card>
          <SectionTitle
            title="Subjects"
            sub={subjects ? `${subjects.length} subject${subjects.length === 1 ? "" : "s"}` : undefined}
          />

          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
              {error}
            </div>
          )}

          {!error && subjects === null && (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded-lg bg-[var(--border)]/40" />
              ))}
            </div>
          )}

          {!error && subjects !== null && subjects.length === 0 && (
            <div className="py-10 text-center text-sm text-[var(--text-muted)]">
              No subjects found for your class yet.
            </div>
          )}

          {!error && subjects && subjects.length > 0 && (
            <div className="divide-y divide-[var(--border)]">
              {subjects.map((subject) => (
                <div key={subject.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-sm font-medium text-[var(--text)]">{subject.name}</div>
                    <div className="text-xs text-[var(--text-muted)]">{subject.code}</div>
                  </div>
                  <div className="text-right text-xs text-[var(--text-muted)]">
                    <div>
                      Pass <span className="font-medium text-[var(--text)]">{subject.pass_marks}</span>
                    </div>
                    <div>
                      Full <span className="font-medium text-[var(--text)]">{subject.full_marks}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}