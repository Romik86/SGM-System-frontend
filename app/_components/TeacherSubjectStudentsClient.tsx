"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  getMySubjectsClient,
  getSubjectRosterClient,
  getSubjectStudentsClient,
  enterGradeClient,
} from "@/app/_lib/teacher";
import { gradeEntrySchema, type GradeEntryFormValues } from "@/app/_validation/teacher.validation";
import type { TeacherSubject, SubjectStudent, ExamType, StudentGrade } from "@/app/_interfaces/teacher";

import { Field, Input } from "./ui/input";
import { Button } from "./ui/button";
import { AlertBanner } from "./ui/alert-banner";
import { IconSubjects } from "./ui/icons";

const EXAM_TYPES: ExamType[] = ["Midterm", "Final"];

export default function TeacherSubjectStudentsClient({ subjectId }: { subjectId: string }) {
  const [subject, setSubject] = React.useState<TeacherSubject | null>(null);
  const [students, setStudents] = React.useState<SubjectStudent[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [openKey, setOpenKey] = React.useState<string | null>(null);

  const [examFilter, setExamFilter] = React.useState<ExamType | "All">("All");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "pending" | "graded">("all");

  const loadData = React.useCallback(async () => {
    try {
      const status = statusFilter === "all" ? undefined : statusFilter;
      const [subjects, roster] =
        examFilter === "All"
          ? await Promise.all([getMySubjectsClient(), getSubjectRosterClient(subjectId, status)])
          : await Promise.all([
              getMySubjectsClient(),
              getSubjectStudentsClient(subjectId, examFilter, status),
            ]);
      const match = subjects.find((s) => s.id === subjectId) ?? null;
      setSubject(match);
      setStudents(roster);
      setError(null);
      if (!match) {
        setError(
          "Couldn't find this subject in your assigned subjects — the ID in the URL may be wrong."
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load this subject.");
    }
  }, [subjectId, examFilter, statusFilter]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleGraded = (studentId: string, examType: ExamType, grade: StudentGrade) => {
    setStudents((prev) =>
      prev
        ? prev.map((s) =>
            s.id === studentId
              ? { ...s, grades: [...s.grades.filter((g) => g.exam_type !== examType), grade] }
              : s
          )
        : prev
    );
    setOpenKey(null);
  };

  return (
    <div>
      <Link
        href="/dashboard/subjects"
        className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)] hover:text-[var(--accent)]"
      >
        &larr; My Subjects
      </Link>

      {error && (
        <div className="mt-4">
          <AlertBanner message={error} />
        </div>
      )}

      {!error && !subject && (
        <div className="mt-4 h-24 animate-pulse rounded-2xl bg-[var(--surface)]/60" />
      )}

      {subject && (
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[var(--text)]">{subject.name}</h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {subject.code} · {subject.class_name} · Section {subject.section} · {subject.batch_name}
            </p>
          </div>
          <div className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--text)]">
            Full {subject.full_marks} · Pass {subject.pass_marks}
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label
            htmlFor="exam-filter"
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]"
          >
            Exam
          </label>
          <select
            id="exam-filter"
            value={examFilter}
            onChange={(e) => setExamFilter(e.target.value as ExamType | "All")}
            className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
          >
            <option value="All">All</option>
            {EXAM_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="status-filter"
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]"
          >
            Status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "pending" | "graded")}
            className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold capitalize text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="graded">Graded</option>
          </select>
        </div>
      </div>

      <div className="mt-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
          {students
            ? `${students.length} student${students.length === 1 ? "" : "s"} shown`
            : "Loading students"}
        </p>

        {!error && students === null && (
          <div className="mt-3 space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl bg-[var(--surface)]/60" />
            ))}
          </div>
        )}

        {!error && students !== null && students.length === 0 && (
          <div className="mt-3 rounded-2xl border border-dashed border-[var(--line)] px-6 py-14 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
              <IconSubjects className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm text-[var(--text-muted)]">
              {examFilter !== "All" || statusFilter !== "all"
                ? "No students match this filter."
                : "No students enrolled yet."}
            </p>
          </div>
        )}

        {students && students.length > 0 && (
          <div className="mt-3 divide-y divide-[var(--line)] rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-5">
            {students.map((student) => (
              <StudentRow
                key={student.id}
                student={student}
                subjectCode={subject?.code}
                fullMarks={subject?.full_marks}
                openKey={openKey}
                onToggle={(key) => setOpenKey((cur) => (cur === key ? null : key))}
                onGraded={handleGraded}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StudentRow({
  student,
  subjectCode,
  fullMarks,
  openKey,
  onToggle,
  onGraded,
}: {
  student: SubjectStudent;
  subjectCode?: string;
  fullMarks?: number;
  openKey: string | null;
  onToggle: (key: string) => void;
  onGraded: (studentId: string, examType: ExamType, grade: StudentGrade) => void;
}) {
  const hasRollNo = student.roll_no.trim() !== "";
  const [showDebug, setShowDebug] = React.useState(false);

  const gradeFor = (type: ExamType) => student.grades.find((g) => g.exam_type === type);

  return (
    <div className="py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-[var(--text)]">{student.full_name}</div>
          <div className="mt-0.5 font-mono text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
            {hasRollNo ? (
              `Roll ${student.roll_no}`
            ) : (
              <button
                type="button"
                onClick={() => setShowDebug((v) => !v)}
                className="normal-case text-[var(--red-pen)] underline-offset-2 hover:underline"
              >
                Roll number missing from API response — {showDebug ? "hide" : "show"} raw data
              </button>
            )}
            {student.email ? ` · ${student.email}` : ""}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {EXAM_TYPES.map((type) => {
            const grade = gradeFor(type);
            const key = `${student.id}:${type}`;
            const isOpen = openKey === key;
            return (
              <button
                key={type}
                onClick={() => onToggle(key)}
                disabled={!subjectCode || !hasRollNo}
                title={!hasRollNo ? "Can't enter a grade — no roll number came back for this student" : undefined}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  grade
                    ? "border-[var(--line)] bg-[var(--bg)] text-[var(--text)] hover:border-[var(--accent)]/50 hover:text-[var(--accent)]"
                    : "border-dashed border-[var(--line)] text-[var(--text-muted)] hover:border-[var(--accent)]/50 hover:text-[var(--accent)]"
                }`}
              >
                {grade
                  ? `${type}: ${grade.obtained_marks}${fullMarks ? `/${fullMarks}` : ""}`
                  : isOpen
                    ? `Cancel ${type}`
                    : `+ ${type}`}
              </button>
            );
          })}
        </div>
      </div>

      {showDebug && !hasRollNo && (
        <pre className="mt-3 max-h-48 overflow-auto rounded-xl border border-[var(--red-pen)]/30 bg-[var(--bg)] p-3 text-[11px] text-[var(--text-muted)]">
          {JSON.stringify(student._raw, null, 2)}
        </pre>
      )}

      {subjectCode &&
        hasRollNo &&
        EXAM_TYPES.map((type) => {
          const key = `${student.id}:${type}`;
          if (openKey !== key) return null;
          return (
            <GradeForm
              key={key}
              rollNo={student.roll_no}
              subjectCode={subjectCode}
              examType={type}
              fullMarks={fullMarks}
              existing={gradeFor(type)}
              onDone={(grade) => onGraded(student.id, type, grade)}
            />
          );
        })}
    </div>
  );
}

function GradeForm({
  rollNo,
  subjectCode,
  examType,
  fullMarks,
  existing,
  onDone,
}: {
  rollNo: string;
  subjectCode: string;
  examType: ExamType;
  fullMarks?: number;
  existing?: StudentGrade;
  onDone: (grade: StudentGrade) => void;
}) {
  const [serverError, setServerError] = React.useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<GradeEntryFormValues>({
    resolver: zodResolver(gradeEntrySchema),
    defaultValues: {
      exam_type: examType,
      obtained_marks: existing ? String(existing.obtained_marks) : "",
      remarks: existing?.remarks ?? "",
    },
  });

  const onSubmit = async (values: GradeEntryFormValues) => {
    setServerError("");

    if (fullMarks !== undefined && Number(values.obtained_marks) > fullMarks) {
      setError("obtained_marks", {
        message: `Can't exceed full marks (${fullMarks})`,
      });
      return;
    }

    try {
      const method = existing ? "PATCH" : "POST";
      const result = await enterGradeClient(
        {
          student_roll_no: rollNo,
          subject_code: subjectCode,
          exam_type: examType,
          obtained_marks: values.obtained_marks,
          remarks: values.remarks || undefined,
        },
        method
      );
      onDone({
        exam_type: result.exam_type,
        obtained_marks: result.obtained_marks,
        remarks: result.remarks,
      });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Failed to submit grade.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="mt-3 grid grid-cols-1 gap-3 rounded-xl border border-[var(--line)] bg-[var(--bg)] p-4 sm:grid-cols-4"
    >
      {serverError && (
        <div className="sm:col-span-4">
          <AlertBanner message={serverError} />
        </div>
      )}

      <input type="hidden" value={examType} {...register("exam_type")} />

      <div className="flex flex-col justify-end pb-1.5 text-sm font-medium text-[var(--text)]">
        {examType}
      </div>

      <Field
        label={`Marks${fullMarks ? ` (/${fullMarks})` : ""}`}
        htmlFor={`marks-${rollNo}-${examType}`}
        error={errors.obtained_marks?.message}
      >
        <Input
          id={`marks-${rollNo}-${examType}`}
          inputMode="decimal"
          placeholder="e.g. 77.25"
          error={!!errors.obtained_marks}
          {...register("obtained_marks")}
        />
      </Field>

      <div className="sm:col-span-2">
        <Field
          label="Remarks (optional)"
          htmlFor={`remarks-${rollNo}-${examType}`}
          error={errors.remarks?.message}
        >
          <Input
            id={`remarks-${rollNo}-${examType}`}
            placeholder="Optional note"
            {...register("remarks")}
          />
        </Field>
      </div>

      <div className="sm:col-span-4">
        <Button type="submit" loading={isSubmitting}>
          {existing ? `Update ${examType} grade` : `Save ${examType} grade`}
        </Button>
      </div>
    </form>
  );
}