import { fetchWithAuth } from "./auth";
import { BASE_URL } from "./config";
import type { Subject } from "@/app/_interfaces/subject";

export async function getMySubjectsClient(): Promise<Subject[]> {
  const res = await fetchWithAuth(`${BASE_URL}/system/subjects/my-subjects/`, {
    method: "GET",
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
