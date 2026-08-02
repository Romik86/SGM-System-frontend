import { fetchWithAuth } from "./auth";
import { BASE_URL } from "./config";
import type { Transcript, ClassTranscript } from "@/app/_interfaces/transcript";

export async function getMyTranscriptClient(): Promise<Transcript> {
    const res = await fetchWithAuth(`${BASE_URL}/system/student/transcript/download/`, {
        method: "GET",
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch transcript: ${res.status} ${res.statusText}`);
    }

    return (await res.json()) as Transcript;
}

export async function getClassTranscriptClient(classId: string): Promise<ClassTranscript> {
    const res = await fetchWithAuth(
        `${BASE_URL}/system/student/transcript/download/?class_id=${classId}`,
        { method: "GET" },
    );

    if (!res.ok) {
        throw new Error(`Failed to fetch transcript: ${res.status} ${res.statusText}`);
    }

    return (await res.json()) as ClassTranscript;
}