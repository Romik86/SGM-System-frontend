// app/_lib/error-messages.ts
import { ApiError } from "./config";

type AuthContext = "login" | "register";

export function getFriendlyAuthError(
  err: unknown,
  context: AuthContext,
): string {
  if (err instanceof ApiError) {
    const status = err.status;
    const raw = (err.message || "").toLowerCase();

    if (context === "login") {
      if (
        status === 400 ||
        status === 401 ||
        raw.includes("invalid") ||
        raw.includes("credential") ||
        raw.includes("no active account")
      ) {
        return "Incorrect email or password. Please check and try again.";
      }
      if (status === 404 || raw.includes("not found")) {
        return "We couldn't find an account with that email.";
      }
      if (status === 429) {
        return "Too many attempts. Please wait a moment and try again.";
      }
    }

    if (context === "register") {
      if (
        raw.includes("email") &&
        (raw.includes("exist") ||
          raw.includes("already") ||
          raw.includes("taken"))
      ) {
        return "An account with this email already exists. Try signing in instead.";
      }
      if (
        raw.includes("phone") &&
        (raw.includes("exist") ||
          raw.includes("already") ||
          raw.includes("taken"))
      ) {
        return "This phone number is already registered.";
      }
      if (raw.includes("student_id") || raw.includes("student id")) {
        return "There's a problem with the Student ID you entered.";
      }
    }

    if (status >= 500) {
      return "Our server is having trouble right now. Please try again shortly.";
    }

    // Only trust the backend's own message if it's short and doesn't look like
    // a raw code/symbol dump (e.g. "✕ Credentials Invalid").
    if (
      err.message &&
      err.message.length < 120 &&
      /^[a-zA-Z]/.test(err.message.trim())
    ) {
      return err.message;
    }
  }

  return "Something went wrong. Please try again.";
}
