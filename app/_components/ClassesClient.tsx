"use client";

import * as React from "react";
import { getMyClassesClient } from "@/app/_lib/classes";
import { getStoredUser } from "@/app/_lib/auth";
import { JoinClassForm } from "./JoinClassForm";
import { IconClasses } from "./ui/icons";
import type { MyClass } from "@/app/_interfaces/class";
import type { StoredUser } from "@/app/_interfaces/auth";

export default function ClassesClient() {
  const [user, setUser] = React.useState<StoredUser | null>(null);
  const [classes, setClasses] = React.useState<MyClass[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [showJoinForm, setShowJoinForm] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const loadClasses = React.useCallback(async () => {
    try {
      const data = await getMyClassesClient();
      setClasses(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load classes.");
    }
  }, []);

  React.useEffect(() => {
    setUser(getStoredUser());
    loadClasses();
  }, [loadClasses]);

  const handleJoined = async () => {
    setShowJoinForm(false);
    setClasses(null);
    await loadClasses();
  };

  const handleCopyCode = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(
        () => setCopiedId((current) => (current === id ? null : current)),
        1500,
      );
    } catch {
      // clipboard API unavailable — fail silently
    }
  };

  const formatJoinedDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return iso;
    }
  };

  return (
    <div>
      {/* Header — same eyebrow/serif pattern as the dashboard hero */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
            {user?.role === "teacher"
              ? "TEACHER · CLASSES"
              : "STUDENT · CLASSES"}
          </p>
          <h1 className="mt-1.5 font-serif text-2xl font-bold text-[var(--text)] sm:text-[28px]">
            My Classes
          </h1>
          <p className="mt-1.5 text-sm text-[var(--text-muted)]">
            Classes you&apos;ve successfully joined.
          </p>
        </div>

        {user?.role === "student" && (
          <button
            onClick={() => setShowJoinForm((prev) => !prev)}
            className="shrink-0 rounded-lg bg-[var(--accent)] px-3 py-2.5 text-sm font-medium text-white transition-opacity disabled:opacity-60"
          >
            {showJoinForm ? "Cancel" : "Join a class"}
          </button>
        )}
      </div>

      {/* Join panel — chalkboard-toned so it reads as an action moment, not another list */}
      {showJoinForm && user?.role === "student" && (
        <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
            Join a class
          </p>
          <h2 className="mt-1 font-serif text-lg font-bold text-[var(--text)]">
            Enter your class code
          </h2>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Ask your teacher for the code they shared with you.
          </p>
          <JoinClassForm onJoined={handleJoined} />
        </div>
      )}

      {/* Classes list */}
      <div className="mt-7">
        <div className="flex items-baseline justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            {classes
              ? `${classes.length} class${classes.length === 1 ? "" : "es"} joined`
              : "Loading"}
          </p>
        </div>

        {error && (
          <div className="mt-3 rounded-2xl border border-[var(--red-pen)]/25 bg-[var(--red-pen)]/10 px-4 py-3 text-sm text-[var(--red-pen)]">
            {error}
          </div>
        )}

        {!error && classes === null && (
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-2xl border border-[var(--line)] bg-[var(--surface)]/60"
              />
            ))}
          </div>
        )}

        {!error && classes !== null && classes.length === 0 && (
          <div className="mt-3 rounded-2xl border border-dashed border-[var(--line)] px-6 py-14 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
              <IconClasses className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm text-[var(--text-muted)]">
              {user?.role === "student"
                ? "You haven't joined a class yet. Use the button above to join one with your class code."
                : "No classes found."}
            </p>
          </div>
        )}

        {!error && classes && classes.length > 0 && (
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {classes.map((item) => {
              const details = item.class_details;
              return (
                <div
                  key={item.id}
                  className="group relative flex h-full flex-col justify-between rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.35)]"
                >
                  <div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-ink)]">
                      <IconClasses className="h-4 w-4" />
                    </div>
                    <div className="mt-3 font-serif text-base font-bold text-[var(--text)]">
                      {details.name}
                    </div>
                    <div className="mt-0.5 text-xs text-[var(--text-muted)]">
                      Section {details.section}
                    </div>
                    <div className="mt-2.5 text-xs text-[var(--text-muted)]">
                      {details.batch_name} &middot; {details.academic_year}
                    </div>
                    <div className="mt-0.5 text-xs text-[var(--text-muted)]">
                      Joined {formatJoinedDate(item.joined_at)}
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopyCode(details.class_code, item.id)}
                    title="Copy class code"
                    className="mt-4 self-start rounded-full border border-[var(--line)] bg-[var(--bg)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] transition-colors hover:border-[var(--gold)]/50 hover:text-[var(--gold)]"
                  >
                    {copiedId === item.id ? "Copied!" : details.class_code}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
