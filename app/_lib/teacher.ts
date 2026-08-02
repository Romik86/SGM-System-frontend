import { fetchWithAuth } from "./auth";
import { BASE_URL } from "./config";
import type {
  TeacherSubject,
  SubjectStudent,
  StudentGrade,
  EnterGradePayload,
  EnterGradeResponse,
  TeacherDashboardStats,
  ExamType,
} from "@/app/_interfaces/teacher";

/** GET /system/teachers/my-subjects/ */
export async function getMySubjectsClient(): Promise<TeacherSubject[]> {
  const res = await fetchWithAuth(`${BASE_URL}/system/teachers/my-subjects/`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch subjects: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  if (data && Array.isArray(data.subjects)) return data.subjects;
  if (Array.isArray(data)) return data;
  return [];
}

/**
 * GET /system/teachers/subjects/{subject_id}/students/
 * Swagger documents `exam_type` and `status` as query filters.
 */
export async function getSubjectStudentsClient(
  subjectId: string,
  examType?: ExamType,
  status?: "pending" | "graded"
): Promise<SubjectStudent[]> {
  const params = new URLSearchParams();
  if (examType) params.set("exam_type", examType);
  if (status) params.set("status", status);
  const qs = params.toString();

  const res = await fetchWithAuth(
    `${BASE_URL}/system/teachers/subjects/${subjectId}/students/${qs ? `?${qs}` : ""}`,
    { method: "GET" }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch students: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  let list: unknown[] = [];
  if (Array.isArray(data)) list = data;
  else if (data && Array.isArray(data.students)) list = data.students;
  else if (data && Array.isArray(data.results)) list = data.results;

  return list.map((raw) => normalizeStudent(raw, examType));
}

/**
 * Fetches the full roster with BOTH Midterm and Final grades attached,
 * by calling the exam_type-scoped endpoint once per exam type and
 * merging by student id. Used when the UI's exam filter is "All".
 *
 * CHANGED: now forwards an optional `status` filter to both underlying
 * calls, so "pending"/"graded" filtering happens on the backend instead
 * of being guessed client-side from `grades.length`.
 */
export async function getSubjectRosterClient(
  subjectId: string,
  status?: "pending" | "graded"
): Promise<SubjectStudent[]> {
  const [midterm, final] = await Promise.all([
    getSubjectStudentsClient(subjectId, "Midterm", status),
    getSubjectStudentsClient(subjectId, "Final", status),
  ]);

  const byId = new Map<string, SubjectStudent>();

  for (const s of midterm) {
    byId.set(s.id, s);
  }
  for (const s of final) {
    const existing = byId.get(s.id);
    if (existing) {
      existing.grades = [
        ...existing.grades.filter((g) => g.exam_type !== "Final"),
        ...s.grades.filter((g) => g.exam_type === "Final"),
      ];
      if (!existing.roll_no && s.roll_no) existing.roll_no = s.roll_no;
    } else {
      byId.set(s.id, s);
    }
  }

  return Array.from(byId.values());
}

function normalizeStudent(raw: unknown, examType?: ExamType): SubjectStudent {
  const obj = (raw ?? {}) as Record<string, unknown>;
  const nestedStudent = (obj.student ?? {}) as Record<string, unknown>;

  const rollNo =
    firstString(obj.roll_no) ??
    firstString(obj.student_id) ??
    firstString(obj.roll_number) ??
    firstString(obj.studentId) ??
    firstString(nestedStudent.student_id) ??
    firstString(nestedStudent.roll_no) ??
    firstString(nestedStudent.id) ??
    "";

  const grades: StudentGrade[] = [];

  if (examType) {
    const rawGrade = obj.grade ?? obj.grades;

    if (rawGrade && typeof rawGrade === "object" && !Array.isArray(rawGrade)) {
      const g = rawGrade as Record<string, unknown>;
      if (g.obtained_marks !== undefined && g.obtained_marks !== null && g.obtained_marks !== "") {
        grades.push({
          exam_type: examType,
          obtained_marks: g.obtained_marks as string | number,
          remarks: typeof g.remarks === "string" ? g.remarks : undefined,
        });
      }
    } else if (Array.isArray(rawGrade) && rawGrade.length) {
      const g = rawGrade[0] as Record<string, unknown>;
      if (g.obtained_marks !== undefined && g.obtained_marks !== null && g.obtained_marks !== "") {
        grades.push({
          exam_type: examType,
          obtained_marks: g.obtained_marks as string | number,
          remarks: typeof g.remarks === "string" ? g.remarks : undefined,
        });
      }
    } else {
      const flatKeys =
        examType === "Midterm"
          ? ["midterm_marks", "midterm_obtained_marks", "obtained_marks"]
          : ["final_marks", "final_obtained_marks", "obtained_marks"];
      for (const key of flatKeys) {
        const value = obj[key];
        if (value !== undefined && value !== null && value !== "") {
          grades.push({
            exam_type: examType,
            obtained_marks: value as string | number,
            remarks: typeof obj.remarks === "string" ? obj.remarks : undefined,
          });
          break;
        }
      }
    }
  }

  return {
    id: firstString(obj.id) ?? "",
    full_name:
      firstString(obj.full_name) ?? firstString(nestedStudent.full_name) ?? "Unknown student",
    roll_no: rollNo,
    email: firstString(obj.email) ?? firstString(nestedStudent.email),
    grades,
    _raw: raw,
  };
}

function firstString(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() !== "" ? v : undefined;
}

export async function enterGradeClient(
  payload: EnterGradePayload,
  method: "POST" | "PATCH" = "POST"
): Promise<EnterGradeResponse> {
  const res = await fetchWithAuth(`${BASE_URL}/system/teachers/grades/enter/`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const message = await extractErrorMessage(res);
    throw new Error(message);
  }

  return (await res.json()) as EnterGradeResponse;
}

export async function getTeacherDashboardStatsClient(): Promise<TeacherDashboardStats> {
  const res = await fetchWithAuth(`${BASE_URL}/system/teachers/dashboard/`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch dashboard stats: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return normalizeDashboardStats(data);
}

/* ------------------------------------------------------------------ */

function normalizeDashboardStats(data: unknown): TeacherDashboardStats {
  const empty: TeacherDashboardStats = {
    summary: {
      total_assigned_subjects: 0,
      total_students_managed: 0,
      total_pending_grades: 0,
    },
    subjects_performance: [],
  };

  if (!data || typeof data !== "object") return empty;
  const source = data as Record<string, unknown>;
  const summarySource = (source.summary ?? {}) as Record<string, unknown>;

  const toNumber = (v: unknown): number =>
    typeof v === "number"
      ? v
      : typeof v === "string" && v.trim() !== "" && !isNaN(Number(v))
        ? Number(v)
        : 0;

  return {
    summary: {
      total_assigned_subjects: toNumber(summarySource.total_assigned_subjects),
      total_students_managed: toNumber(summarySource.total_students_managed),
      total_pending_grades: toNumber(summarySource.total_pending_grades),
    },
    subjects_performance: Array.isArray(source.subjects_performance)
      ? (source.subjects_performance as TeacherDashboardStats["subjects_performance"])
      : [],
  };
}

async function extractErrorMessage(res: Response): Promise<string> {
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body
  }

  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (typeof obj.message === "string") return obj.message;
    if (typeof obj.detail === "string") return obj.detail;
    if (Array.isArray(obj.non_field_errors) && obj.non_field_errors.length) {
      return String(obj.non_field_errors[0]);
    }
    for (const [field, value] of Object.entries(obj)) {
      if (Array.isArray(value) && value.length && typeof value[0] === "string") {
        return `${field}: ${value[0]}`;
      }
      if (typeof value === "string") return value;
    }
  }

  return `Failed to submit grade: ${res.status} ${res.statusText}`;
}