import { fetchWithAuth } from "./auth";
import { BASE_URL } from "./config";
import type { MyClass, MyClassesResponse } from "@/app/_interfaces/class";

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

export async function getMyClassesClient(): Promise<MyClass[]> {
  const res = await fetchWithAuth(`${BASE_URL}/system/classes/my-classes/`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch classes: ${res.status} ${res.statusText}`);
  }

  const data: MyClassesResponse = await res.json();
  return Array.isArray(data?.my_classes) ? data.my_classes : [];
}