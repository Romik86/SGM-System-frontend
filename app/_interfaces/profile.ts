// app/_interfaces/profile.ts

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

export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
}