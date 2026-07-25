// app/_interfaces/profile.ts

/**
 * GET /accounts/profile/
 * Exact match to Swagger's schema. student_id/enrollment_year will be
 * present for students and presumably null/absent for teachers — treat
 * both as optional and only render them when role === "student".
 */
export interface ProfileResponse {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone_number: string;
  student_id?: string | null;
  role: "student" | "teacher";
  enrollment_year?: number | null;
  profile_image?: string | null;
}

/**
 * PATCH /accounts/profile/
 * profile_image removed — no longer editable from this form. first_name
 * and last_name are now sendable too (teachers only, per current
 * requirement); both optional here since students' PATCH calls only
 * ever include phone_number.
 */
export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
}