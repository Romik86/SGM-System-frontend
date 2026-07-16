"use client";

import * as React from "react";
import { joinClass } from "@/app/_lib/classes";

interface JoinClassFormProps {
    onJoined: (classCode: string) => void;
}

export function JoinClassForm({ onJoined }: JoinClassFormProps) {
    const [classCode, setClassCode] = React.useState("");
    const [submitting, setSubmitting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = classCode.trim();
        if (!code) {
            setError("Please enter your class code.");
            return;
        }
        setSubmitting(true);
        setError(null);
        try {
            await joinClass(code);
            onJoined(code);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <input
                autoFocus
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
                placeholder="e.g. CS101-2026"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
                disabled={submitting}
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-[var(--accent)] px-3 py-2.5 text-sm font-medium text-white transition-opacity disabled:opacity-60"
            >
                {submitting ? "Joining..." : "Join class"}
            </button>
        </form>
    );
}