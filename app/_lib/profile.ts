import { fetchWithAuth } from "./auth";
import { BASE_URL } from "./config";
import type { ProfileResponse, UpdateProfilePayload } from "@/app/_interfaces/profile";

/** GET /accounts/profile/ */
export async function getMyProfileClient(): Promise<ProfileResponse> {
  const res = await fetchWithAuth(`${BASE_URL}/accounts/profile/`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch profile: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as ProfileResponse;
}

/** PATCH /accounts/profile/ */
export async function updateMyProfileClient(
  payload: UpdateProfilePayload
): Promise<ProfileResponse> {
  const res = await fetchWithAuth(`${BASE_URL}/accounts/profile/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const message = await extractErrorMessage(res);
    throw new Error(message);
  }

  return (await res.json()) as ProfileResponse;
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
    for (const [field, value] of Object.entries(obj)) {
      if (Array.isArray(value) && value.length && typeof value[0] === "string") {
        return `${field}: ${value[0]}`;
      }
      if (typeof value === "string") return value;
    }
  }

  return `Failed to update profile: ${res.status} ${res.statusText}`;
}