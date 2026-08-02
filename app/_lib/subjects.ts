import { fetchWithAuth } from "./auth";
import { BASE_URL } from "./config";
import type { Subject } from "@/app/_interfaces/subject";

export async function getMySubjectsClient(classId: string): Promise<Subject[]> {
  const res = await fetchWithAuth(`${BASE_URL}/system/student/subjects/my-subjects/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ class_id: classId }),
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch subjects: ${res.status} ${res.statusText}`,
    );
  }

  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.subjects)) return data.subjects;
  return [];
}