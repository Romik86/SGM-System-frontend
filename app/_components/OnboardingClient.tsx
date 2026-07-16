"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { getStoredUser, hasJoinedClass, markClassJoined } from "@/app/_lib/auth";
import type { StoredUser } from "@/app/_interfaces/auth";
import { JoinClassForm } from "./JoinClassForm";

export default function OnboardingClient() {
    const router = useRouter();
    const [user, setUser] = React.useState<StoredUser | null>(null);
    const [checked, setChecked] = React.useState(false);

    React.useEffect(() => {
        const stored = getStoredUser();

        if (!stored) {
            router.replace("/login");
            return;
        }

        if (hasJoinedClass(stored)) {
            router.replace("/dashboard");
            return;
        }

        setUser(stored);
        setChecked(true);
    }, [router]);

    const handleJoined = (classCode: string) => {
        if (user) markClassJoined(user, classCode);
        router.replace("/dashboard");
    };

    if (!checked || !user) return null;

    return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
            <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl">
                <h1 className="text-lg font-semibold text-[var(--text)]">Welcome! Let&apos;s get you set up</h1>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                    Enter the class code your teacher shared with you to join your batch. You&apos;ll need this to
                    see your subjects, grades, and attendance.
                </p>
                <JoinClassForm onJoined={handleJoined} />
            </div>
        </div>
    );
}