// app/_lib/auth.service.ts
import { apiFetch } from "./config";
import type { StoredUser } from "@/app/_interfaces/auth";

import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from "../_interfaces/auth";

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
  // Keep raw tokens around too (used by getAuthToken as a fallback).
  window.localStorage.setItem("access_token", data.access);
  window.localStorage.setItem("refresh_token", data.refresh);

  // This is the object getStoredUser()/dashboard layout actually reads
  // (under USER_KEY = "eduportal_user"). Previously this was written to a
  // plain "user" key that nothing read, so the dashboard's auth check
  // always saw no user and bounced back to /login right after signing in.
  storeUser({
    id: data.user_id,
    email: data.email,
    full_name: data.full_name,
    role: data.role,
    access_token: data.access,
    token: data.access,
  });
}

export function logout() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("access_token");
  window.localStorage.removeItem("refresh_token");
  window.localStorage.removeItem("user");
}

const USER_KEY = "eduportal_user";

export function storeUser(user: StoredUser): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function getAuthToken(): string | null {
  const user = getStoredUser();
  if (user?.token) return user.token;
  if (user?.access_token) return user.access_token;
  if (typeof window === "undefined") return null;
  return (
    window.localStorage.getItem("token") ??
    window.localStorage.getItem("access_token")
  );
}

/**
 * Whether a student has already joined a batch/class — checked first
 * against the stored user object, then against a local onboarding flag
 * (set right after a successful join). This is what gates the onboarding
 * redirect, and why it never reappears on a second visit.
 */
export function hasJoinedClass(user: StoredUser | null): boolean {
  if (!user) return false;
  if (user.role !== "student") return true; // only students onboard
  if (user.batch_id || user.class_code) return true;
  if (typeof window === "undefined") return false;
  const key = onboardingFlagKey(user);
  return window.localStorage.getItem(key) === "1";
}

/** Call after a successful class-join to persist it for future sessions. */
export function markClassJoined(user: StoredUser, classCode: string): StoredUser {
  const updated: StoredUser = { ...user, class_code: classCode };
  storeUser(updated);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(onboardingFlagKey(updated), "1");
  }
  return updated;
}

function onboardingFlagKey(user: StoredUser): string {
  return `onboarded:${user.id ?? user.email ?? user.full_name}`;
}

/** Fetch wrapper that attaches the bearer token. Mirrors the old project's
 * `fetchWithAuth` — returns the raw Response, caller handles res.ok / json(). */
export async function fetchWithAuth(
  input: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = getAuthToken();
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(input, { ...init, headers });
}