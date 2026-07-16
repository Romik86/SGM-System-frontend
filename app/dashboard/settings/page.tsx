"use client";

import * as React from "react";
import { getStoredUser, markClassJoined } from "@/app/_lib/auth";
import type { StoredUser } from "@/app/_interfaces/auth";
import { JoinClassForm } from "@/app/_components/JoinClassForm";

export default function SettingsPage() {
    const [user, setUser] = React.useState<StoredUser | null>(null);
    const [joinedCode, setJoinedCode] = React.useState<string | null>(null);

    React.useEffect(() => {
        setUser(getStoredUser());
    }, []);

    const handleJoined = (classCode: string) => {
        if (!user) return;
        const updated = markClassJoined(user, classCode);
        setUser(updated);
        setJoinedCode(classCode);
    };

    if (!user) return null;

    const currentCode = joinedCode ?? user.class_code ?? null;

    return (
        <div className="mx-auto max-w-lg space-y-6">
            <div>
                <h1 className="text-xl font-semibold text-[var(--text)]">Settings</h1>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                    Manage your account preferences.
                </p>
            </div>

            {user.role === "student" && (
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
                    <h2 className="text-sm font-semibold text-[var(--text)]">Class</h2>

                    {currentCode ? (
                        <div className="mt-3 space-y-3">
                            <p className="text-sm text-[var(--text-muted)]">
                                You&apos;re currently joined to{" "}
                                <span className="font-medium text-[var(--text)]">{currentCode}</span>.
                            </p>
                            <details>
                                <summary className="cursor-pointer text-sm text-[var(--accent)]">
                                    Join a different class
                                </summary>
                                <div className="mt-3">
                                    <JoinClassForm onJoined={handleJoined} />
                                </div>
                            </details>
                        </div>
                    ) : (
                        <div className="mt-3 space-y-3">
                            <p className="text-sm text-[var(--text-muted)]">
                                You haven&apos;t joined a class yet. Enter your class code below whenever
                                you have it — you can always do this later.
                            </p>
                            <JoinClassForm onJoined={handleJoined} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
