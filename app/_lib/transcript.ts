import { fetchWithAuth } from "./auth";
import { BASE_URL } from "./config";
import type { Transcript } from "@/app/_interfaces/transcript";

export async function getMyTranscriptClient(): Promise<Transcript> {
    const res = await fetchWithAuth(`${BASE_URL}/system/student/transcript/my-transcript/`, {
        method: "GET",
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch transcript: ${res.status} ${res.statusText}`);
    }

    return (await res.json()) as Transcript;
}