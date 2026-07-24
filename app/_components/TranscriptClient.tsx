"use client";

import * as React from "react";
import { getMyTranscriptClient } from "@/app/_lib/transcript";
import { getStoredUser } from "@/app/_lib/auth";
import type { Transcript, TranscriptSubject } from "@/app/_interfaces/transcript";
import type { StoredUser } from "@/app/_interfaces/auth";

/**
 * The "grade-stamp" seal — same rotated-circle-of-ink idiom already used on
 * the auth screen (see auth-shell.tsx: the gold "A+ / Verified" seal). Here
 * it does real work: it's the one visual the whole page is built around.
 */
function GradeSeal({
    size = "lg",
    tone,
    big,
    small,
    dashed = false,
}: {
    size?: "lg" | "sm";
    tone: "gold" | "red" | "muted";
    big: React.ReactNode;
    small: React.ReactNode;
    dashed?: boolean;
}) {
    const toneVar =
        tone === "gold" ? "var(--gold)" : tone === "red" ? "var(--red-pen)" : "var(--text-muted)";

    const dims = size === "lg" ? "h-28 w-28 md:h-32 md:w-32" : "h-11 w-11 shrink-0";
    const bigText = size === "lg" ? "text-3xl md:text-4xl" : "text-xs";
    const smallText = size === "lg" ? "text-[9px] mt-1" : "text-[7px] mt-0.5";

    return (
        <div
            className={`flex shrink-0 -rotate-6 items-center justify-center rounded-full ${dims}`}
            style={{
                borderWidth: size === "lg" ? 3 : 2,
                borderStyle: dashed ? "dashed" : "solid",
                borderColor: toneVar,
                color: toneVar,
            }}
        >
            <div className="text-center leading-none">
                <div className={`font-serif font-bold ${bigText}`}>{big}</div>
                <div className={`font-mono uppercase tracking-widest ${smallText}`}>{small}</div>
            </div>
        </div>
    );
}

function subjectTone(subject: TranscriptSubject): "gold" | "red" | "muted" {
    if (subject.is_passed === null) return "muted";
    return subject.is_passed ? "gold" : "red";
}

export default function TranscriptClient() {
    const [user, setUser] = React.useState<StoredUser | null>(null);
    const [transcript, setTranscript] = React.useState<Transcript | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const stored = getStoredUser();
        setUser(stored);

        if (stored && stored.role !== "student") return;

        let cancelled = false;
        (async () => {
            try {
                const data = await getMyTranscriptClient();
                if (!cancelled) setTranscript(data);
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Failed to load transcript.");
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    if (user && user.role !== "student") {
        return (
            <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--accent)]">
                    Grades
                </p>
                <h1 className="mt-2 font-serif text-2xl font-semibold text-[var(--text)]">
                    Transcript
                </h1>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                    This view is for students. Grade-entry tools for teachers are coming soon.
                </p>
            </div>
        );
    }

    const status = transcript?.summary.overall_status ?? "";
    const isPending = status.toLowerCase() === "pending";
    const isFail = status.toLowerCase().includes("fail");
    const overallTone: "gold" | "red" = isFail ? "red" : "gold";

    const percentage =
        transcript && transcript.summary.total_full_marks > 0
            ? (transcript.summary.total_obtained_marks / transcript.summary.total_full_marks) * 100
            : null;

    return (
        <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--accent)]">
                {transcript ? `Transcript \u00b7 ${transcript.class_info.name}` : "Transcript"}
            </p>
            <h1 className="mt-2 font-serif text-2xl font-semibold text-[var(--text)]">
                My Transcript
            </h1>
            <p className="mt-1.5 text-sm text-[var(--text-muted)]">
                {transcript
                    ? `Section ${transcript.class_info.section} \u00b7 ${transcript.class_info.batch} \u00b7 ${transcript.class_info.academic_year}`
                    : "Your grades for the current class."}
            </p>

            <div className="mt-8 space-y-8">
                {error && (
                    <div className="rounded-2xl border border-[var(--red-pen)]/25 bg-[var(--red-pen)]/[0.06] px-4 py-3 text-sm text-[var(--red-pen)]">
                        {error}
                    </div>
                )}

                {!error && transcript === null && (
                    <div className="space-y-3">
                        <div className="h-32 w-32 animate-pulse rounded-full bg-[var(--surface-2)]" />
                        <div className="space-y-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-12 animate-pulse rounded-lg bg-[var(--surface-2)]" />
                            ))}
                        </div>
                    </div>
                )}

                {!error && transcript !== null && isPending && (
                    <div className="flex flex-col items-center gap-5 rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface)] px-6 py-14 text-center sm:flex-row sm:justify-center sm:text-left">
                        <GradeSeal tone="muted" dashed size="lg" big="?" small="Pending" />
                        <div className="max-w-xs">
                            <div className="text-sm font-semibold text-[var(--text)]">
                                Your transcript isn&apos;t stamped yet
                            </div>
                            <p className="mt-1.5 text-sm text-[var(--text-muted)]">
                                Grades for {transcript.class_info.name} are still being finalized. Check back
                                once your teacher has published the results.
                            </p>
                        </div>
                    </div>
                )}

                {!error && transcript !== null && !isPending && (
                    <>
                        {/* Hero: the seal + summary line, the one bold moment on the page */}
                        <div className="flex flex-col items-center gap-6 border-b border-[var(--line)] pb-8 sm:flex-row sm:items-center">
                            <GradeSeal
                                tone={overallTone}
                                size="lg"
                                big={percentage !== null ? `${Math.round(percentage)}%` : "\u2014"}
                                small={transcript.summary.overall_status}
                            />

                            <div className="flex-1 text-center sm:text-left">
                                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                                    Total marks
                                </div>
                                <div className="mt-1 font-serif text-3xl font-semibold text-[var(--text)]">
                                    {transcript.summary.total_obtained_marks}
                                    <span className="text-lg font-normal text-[var(--text-muted)]">
                                        {" "}
                                        / {transcript.summary.total_full_marks}
                                    </span>
                                </div>
                                <div
                                    className="mt-3 mx-auto h-px w-full max-w-xs bg-[repeating-linear-gradient(90deg,var(--line)_0,var(--line)_6px,transparent_6px,transparent_10px)] sm:mx-0"
                                    aria-hidden
                                />
                                <div className="mt-3 mx-auto grid max-w-xs grid-cols-3 gap-4 sm:mx-0">
                                    <div>
                                        <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                                            Name
                                        </div>
                                        <div className="mt-0.5 truncate text-sm text-[var(--text)]">
                                            {transcript.student_info.name}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                                            Student ID
                                        </div>
                                        <div className="mt-0.5 truncate font-mono text-sm text-[var(--text)]">
                                            {transcript.student_info.student_id}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                                            Email
                                        </div>
                                        <div className="mt-0.5 truncate text-sm text-[var(--text)]">
                                            {transcript.student_info.email}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Ledger: subjects as marked lines in a gradebook, not a generic table */}
                        <div>
                            <div className="mb-3 flex items-baseline justify-between">
                                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                                    Subjects
                                </span>
                                <span className="text-xs text-[var(--text-muted)]">
                                    {transcript.subjects.length} subject{transcript.subjects.length === 1 ? "" : "s"}
                                </span>
                            </div>

                            <div className="divide-y divide-[var(--line)] rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-5">
                                {transcript.subjects.map((subject) => (
                                    <div
                                        key={subject.subject_code}
                                        className="flex items-center justify-between gap-4 py-4"
                                    >
                                        <div className="min-w-0">
                                            <div className="truncate text-sm font-medium text-[var(--text)]">
                                                {subject.subject_name}
                                            </div>
                                            <div className="mt-0.5 font-mono text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
                                                {subject.subject_code}
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 items-center gap-4">
                                            <div className="text-right font-mono text-sm tabular-nums text-[var(--text)]">
                                                {subject.obtained_marks === null ? (
                                                    <span className="text-[var(--text-muted)]">&mdash;</span>
                                                ) : (
                                                    subject.obtained_marks
                                                )}
                                                <span className="text-[var(--text-muted)]"> / {subject.full_marks}</span>
                                            </div>

                                            <GradeSeal
                                                size="sm"
                                                tone={subjectTone(subject)}
                                                dashed={subject.is_passed === null}
                                                big={subject.letter_grade}
                                                small={
                                                    subject.is_passed === null
                                                        ? ""
                                                        : subject.is_passed
                                                            ? "Pass"
                                                            : "Fail"
                                                }
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}