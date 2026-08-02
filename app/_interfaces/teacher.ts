// app/_interfaces/teacher.ts

/**
 * GET /system/teachers/my-subjects/
 * Swagger's schema panel shows a bare array, but the confirmed live
 * response is wrapped:
 *   { "total_assigned_subjects": 0, "subjects": [] }
 * _lib/teacher.ts unwraps `subjects` for callers, so this type still
 * describes a single subject item — TeacherSubject[] is what the rest
 * of the app works with.
 */
export interface TeacherSubject {
  id: string; // uuid
  code: string;
  name: string;
  full_marks: number;
  pass_marks: number;
  class_name: string;
  section: string;
  academic_year: string;
  batch_name: string;
}

/**
 * POST /system/teachers/grades/enter/
 * Exact match to Swagger's request/response schema.
 *
 * NOTE (confirm with backend): the request example shows obtained_marks
 * as "77.25" but the response example shows ".17" — looks like a Swagger
 * example glitch rather than an intentional format difference. Treating
 * obtained_marks as a decimal string on both sides for now.
 *
 * Trimmed to Midterm/Final only per current requirement — add back
 * Assignment/Quiz here (and in EXAM_TYPES in
 * _validation/teacher.validation.ts) if/when needed.
 */
export type ExamType = "Midterm" | "Final";

export interface EnterGradePayload {
  student_roll_no: string;
  subject_code: string;
  exam_type: ExamType;
  obtained_marks: string;
  remarks?: string;
}

export interface EnterGradeResponse {
  exam_type: ExamType;
  obtained_marks: string;
  remarks?: string;
}

/**
 * GET /system/teachers/subjects/{subject_id}/students/
 * Swagger publishes this response as a bare `{}` — no schema yet.
 *
 * A student can now have grades for BOTH Midterm and Final, so `grades`
 * is an array, not a single object. The exact key holding the roll
 * number is still unconfirmed (roll_no/student_id/etc. were all tried
 * and came back empty in practice) — _lib/teacher.ts keeps the original
 * API object on `_raw` for each student so the on-page debug view in
 * TeacherSubjectStudentsClient.tsx can show it directly when a roll
 * number can't be found, instead of guessing again blind.
 */
export interface StudentGrade {
  exam_type: string;
  obtained_marks: string | number;
  remarks?: string;
}

export interface SubjectStudent {
  id: string;
  full_name: string;
  roll_no: string; // sent back as student_roll_no when entering a grade
  email?: string;
  grades: StudentGrade[];
  _raw?: unknown; // original API record, for the debug view when roll_no is empty
}

/**
 * GET /system/teachers/dashboard/
 * Confirmed via a live call (Swagger's schema panel still shows `{}`,
 * but "Try it out" returned this real shape):
 *
 *   {
 *     "summary": {
 *       "total_assigned_subjects": 0,
 *       "total_students_managed": 0,
 *       "total_pending_grades": 0
 *     },
 *     "subjects_performance": []
 *   }
 *
 * `summary` is now locked in. `subjects_performance` came back empty
 * (that test account had 0 assigned subjects), so its per-item shape is
 * still unconfirmed — TeacherDashboardSubjectStat below is a best guess
 * based on the summary's naming style (passed/failed counts per subject,
 * per the endpoint's "pass/fail statistics" description). Re-check this
 * once a teacher account with real subjects hits this endpoint.
 */
export interface TeacherDashboardSummary {
  total_assigned_subjects: number;
  total_students_managed: number;
  total_pending_grades: number;
}

export interface TeacherDashboardSubjectStat {
  subject_id?: string;
  subject_code?: string;
  subject_name?: string;
  class_name?: string;
  section?: string;
  total_students?: number;
  passed?: number;
  failed?: number;
  pending_grades?: number;
  [key: string]: unknown; // unconfirmed shape — keep the door open
}

export interface TeacherDashboardStats {
  summary: TeacherDashboardSummary;
  subjects_performance: TeacherDashboardSubjectStat[];
}