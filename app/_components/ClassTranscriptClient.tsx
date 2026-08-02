"use client";

import * as React from "react";
import Link from "next/link";
import { getClassTranscriptClient } from "@/app/_lib/transcript";
import { getLetterGrade, getOverallPercentage } from "@/app/_lib/grading";
import type { ClassTranscript, ClassTranscriptSubject } from "@/app/_interfaces/transcript";

function GradeSeal({
    tone,
    big,
    small,
    dashed = false,
}: {
    tone: "gold" | "red" | "muted";
    big: React.ReactNode;
    small: React.ReactNode;
    dashed?: boolean;
}) {
    const toneVar =
        tone === "gold" ? "var(--gold)" : tone === "red" ? "var(--red-pen)" : "var(--text-muted)";

    return (
        <div
            className="flex h-11 w-11 shrink-0 -rotate-6 items-center justify-center rounded-full"
            style={{
                borderWidth: 2,
                borderStyle: dashed ? "dashed" : "solid",
                borderColor: toneVar,
                color: toneVar,
            }}
        >
            <div className="text-center leading-none">
                <div className="font-serif text-xs font-bold">{big}</div>
                <div className="mt-0.5 font-mono text-[7px] uppercase tracking-widest">{small}</div>
            </div>
        </div>
    );
}

function subjectTone(subject: ClassTranscriptSubject): "gold" | "red" | "muted" {
    if (subject.is_passed === null) return "muted";
    return subject.is_passed ? "gold" : "red";
}

export default function ClassTranscriptClient({ classId }: { classId: string }) {
    const [transcript, setTranscript] = React.useState<ClassTranscript | null | undefined>(undefined);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const data = await getClassTranscriptClient(classId);
                if (!cancelled) setTranscript(data);
            } catch (err) {
                if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load transcript.");
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [classId]);

    const overallPercentage = transcript
        ? getOverallPercentage(transcript.summary.total_obtained_marks, transcript.summary.total_full_marks)
        : null;
    const overallGrade = overallPercentage !== null ? getLetterGrade(overallPercentage) : null;

    return (
        <div>
            <div className="flex items-center justify-between">
                <Link
                    href={"/dashboard/classes"}
                    className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)] hover:text-[var(--accent)]"
                >
                    &larr; Class Details
                </Link>

                <Link
                    href={`/dashboard/classes/${classId}/transcript`}
                    className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                    View Transcript
                </Link>
            </div>

            {error && (
                <div className="mt-4 rounded-2xl border border-[var(--red-pen)]/25 bg-[var(--red-pen)]/10 px-4 py-3 text-sm text-[var(--red-pen)]">
                    {error}
                </div>
            )}

            {!error && transcript === undefined && (
                <div className="mt-4 space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-16 animate-pulse rounded-lg bg-[var(--surface)]/60" />
                    ))}
                </div>
            )}

            {!error && transcript && (
                <>
                    <h1 className="mt-3 font-serif text-2xl font-bold text-[var(--text)]">
                        {transcript.class_info.program}
                    </h1>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                        Section {transcript.class_info.section} &middot; {transcript.class_info.batch} &middot;{" "}
                        {transcript.class_info.academic_year}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
                        <div>
                            <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                                Total marks
                            </div>
                            <div className="mt-1 font-serif text-2xl font-semibold text-[var(--text)]">
                                {transcript.summary.total_obtained_marks}
                                <span className="text-base font-normal text-[var(--text-muted)]">
                                    {" "}/ {transcript.summary.total_full_marks}
                                </span>
                            </div>
                        </div>
                        <div>
                            <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                                Overall %
                            </div>
                            <div className="mt-1 font-serif text-2xl font-semibold text-[var(--text)]">
                                {overallPercentage !== null ? `${overallPercentage}%` : "—"}
                            </div>
                        </div>
                        <div>
                            <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                                Overall Grade
                            </div>
                            <div className="mt-1 font-serif text-2xl font-semibold text-[var(--text)]">
                                {overallGrade ?? "—"}
                            </div>
                        </div>
                        <div className="ml-auto text-right">
                            <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                                Status
                            </div>
                            <div className="mt-1 text-sm font-semibold text-[var(--text)]">
                                {transcript.summary.overall_status}
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 divide-y divide-[var(--line)] rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-5">
                        {transcript.subjects.map((subject) => (
                            <div key={subject.subject_code} className="py-4">
                                <div className="flex items-center justify-between gap-4">
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
                                            {subject.final_percentage === null ? (
                                                <span className="text-[var(--text-muted)]">&mdash;</span>
                                            ) : (
                                                `${subject.final_percentage}%`
                                            )}
                                        </div>
                                        <GradeSeal
                                            tone={subjectTone(subject)}
                                            dashed={subject.is_passed === null}
                                            big={subject.final_letter_grade}
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

                                {subject.exam_breakdown.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {subject.exam_breakdown.map((exam) => (
                                            <div
                                                key={exam.exam_type}
                                                className="rounded-full border border-[var(--line)] bg-[var(--bg)] px-3 py-1 text-xs text-[var(--text-muted)]"
                                            >
                                                {exam.exam_type}: {exam.obtained_marks}/{exam.full_marks}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}