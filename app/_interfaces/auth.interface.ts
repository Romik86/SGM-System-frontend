// app/_interfaces/auth.interface.ts

export type UserRole = "teacher" | "student";

/** POST /accounts/login/ — request body */
export interface LoginPayload {
  email: string;
  password: string;
}

/** POST /accounts/login/ — 200 response body */
export interface LoginResponse {
  message: string;
  email: string;
  full_name: string;
  role: UserRole;
  user_id: string;
  refresh: string;
  access: string;
}

/** POST /accounts/register/ — request body */
export interface RegisterPayload {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: UserRole;
  student_id?: string;
  enrollment_year?: number;
  profile_image?: string;
  password: string;
}

/** POST /accounts/register/ — 201 response body */
export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
  };
}

/** Shape returned by the API on 4xx errors (DRF-style field errors) */
export interface ApiErrorResponse {
  detail?: string;
  message?: string;
  [field: string]: string | string[] | undefined;
}
