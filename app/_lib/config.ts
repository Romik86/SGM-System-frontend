// app/_lib/api-client.ts4

export const BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://sgm-system.onrender.com"
).replace(/\/+$/, ""); // strip trailing slash(es) so paths never double up

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean; // attach the stored access token
}

/**
 * Thin fetch wrapper around the Django/DRF backend seen in the Swagger docs
 * (accounts/login, accounts/register, ...). Keeps every call typed via
 * the generic <T> the caller supplies.
 */
export async function apiFetch<T>(
  path: string,
  { body, auth = false, headers, ...rest }: RequestOptions = {}
): Promise<T> {
  const finalHeaders: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...headers,
  };

  if (auth && typeof window !== "undefined") {
    const token = window.localStorage.getItem("access_token");
    if (token) {
      (finalHeaders as Record<string, string>).Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = extractErrorMessage(data);
    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

/**
 * DRF error payloads come in several shapes:
 *  - { detail: "..." }
 *  - { message: "..." }
 *  - { non_field_errors: ["..."] }
 *  - { email: ["user with this email already exists."] }  <-- field errors
 */
function extractErrorMessage(data: unknown): string {
  if (!data || typeof data !== "object") {
    return "Something went wrong. Please try again.";
  }
  const obj = data as Record<string, unknown>;

  if (typeof obj.message === "string") return obj.message;
  if (typeof obj.detail === "string") return obj.detail;

  if (Array.isArray(obj.non_field_errors) && obj.non_field_errors.length) {
    return String(obj.non_field_errors[0]);
  }

  for (const value of Object.values(obj)) {
    if (Array.isArray(value) && value.length && typeof value[0] === "string") {
      return value[0];
    }
    if (typeof value === "string") {
      return value;
    }
  }

  return "Something went wrong. Please try again.";
}