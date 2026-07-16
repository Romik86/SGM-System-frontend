// app/_interfaces/auth.interface.ts

export type Role = "teacher" | "student";

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
  role: Role;
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
  role: Role;
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
    role: Role;
  };
}

/** Shape returned by the API on 4xx errors (DRF-style field errors) */
export interface ApiErrorResponse {
  detail?: string;
  message?: string;
  [field: string]: string | string[] | undefined;
}


export interface StoredUser {
  id?: string | number;
  email?: string;
  full_name: string;
  role: Role;
  // Populated once a student joins a batch — either from the login/register
  // response directly, or set locally right after a successful join.
  batch_id?: string | number | null;
  class_code?: string | null;
  token?: string;
  access_token?: string;
  [key: string]: unknown;
}