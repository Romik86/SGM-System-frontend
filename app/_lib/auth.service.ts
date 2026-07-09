// app/_lib/auth.service.ts
import { apiFetch } from "./api-client";
import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from "../_interfaces/auth.interface";

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const data = await apiFetch<LoginResponse>("/accounts/login/", {
    method: "POST",
    body: payload,
  });

  persistSession(data);
  return data;
}

export async function register(
  payload: RegisterPayload
): Promise<RegisterResponse> {
  return apiFetch<RegisterResponse>("/accounts/register/", {
    method: "POST",
    body: payload,
  });
}

function persistSession(data: LoginResponse) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("access_token", data.access);
  window.localStorage.setItem("refresh_token", data.refresh);
  window.localStorage.setItem(
    "user",
    JSON.stringify({
      user_id: data.user_id,
      email: data.email,
      full_name: data.full_name,
      role: data.role,
    })
  );
}

export function logout() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("access_token");
  window.localStorage.removeItem("refresh_token");
  window.localStorage.removeItem("user");
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}
