import { fetchWithAuth } from "./auth";
import { BASE_URL } from "./config"
;
export async function joinClass(classCode: string): Promise<void> {
  const res = await fetchWithAuth(`${BASE_URL}/system/classes/join/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ class_code: classCode }),
  });

  if (!res.ok) {
    let message = "Could not join class. Please check the code and try again.";
    try {
      const data = await res.json();
      message = data?.detail ?? data?.message ?? message;
    } catch {
      // ignore parse errors, use default message
    }
    throw new Error(message);
  }
}