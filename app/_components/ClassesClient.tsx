"use client";

import * as React from "react";
import { getMyClassesClient } from "@/app/_lib/classes";
import { getStoredUser } from "@/app/_lib/auth";
import { Card, SectionTitle } from "./ui/cards";
import { JoinClassForm } from "./JoinClassForm";
import { IconClasses } from "./ui/icons";
import type { MyClass } from "@/app/_interfaces/class";
import type { StoredUser } from "@/app/_interfaces/auth";

export default function ClassesClient() {
    const [user, setUser] = React.useState<StoredUser | null>(null);
    const [classes, setClasses] = React.useState<MyClass[] | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const [showJoinForm, setShowJoinForm] = React.useState(false);
    const [copiedId, setCopiedId] = React.useState<string | null>(null);

    const loadClasses = React.useCallback(async () => {
        try {
            const data = await getMyClassesClient();
            setClasses(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load classes.");
        }
    }, []);

    React.useEffect(() => {
        setUser(getStoredUser());
        loadClasses();
    }, [loadClasses]);

    const handleJoined = async () => {
        setShowJoinForm(false);
        setClasses(null);
        await loadClasses();
    };

    const handleCopyCode = async (code: string, id: string) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedId(id);
            setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1500);
        } catch {
            // clipboard API unavailable — fail silently
        }
    };

    const formatJoinedDate = (iso: string) => {
        try {
            return new Date(iso).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch {
            return iso;
        }
    };

    return (
        <div>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-[var(--text)]">My Classes</h1>
                    <p className="mt-2 text-sm text-[var(--text-muted)]">
                        Classes you&apos;ve successfully joined.
                    </p>
                </div>

                {user?.role === "student" && (
                    <button
                        onClick={() => setShowJoinForm((prev) => !prev)}
                        className="shrink-0 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--text)] transition-colors hover:bg-[var(--border)]/40"
                    >
                        {showJoinForm ? "Cancel" : "Join a class"}
                    </button>
                )}
            </div>

            {showJoinForm && user?.role === "student" && (
                <Card className="mt-4">
                    <SectionTitle title="Join a class" sub="Enter the class code your teacher shared with you." />
                    <JoinClassForm onJoined={handleJoined} />
                </Card>
            )}

            <div className="mt-6">
                <Card>
                    <SectionTitle
                        title="Classes"
                        sub={classes ? `${classes.length} class${classes.length === 1 ? "" : "es"} joined` : undefined}
                    />

                    {error && (
                        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                            {error}
                        </div>
                    )}

                    {!error && classes === null && (
                        <div className="space-y-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-20 animate-pulse rounded-lg bg-[var(--border)]/40" />
                            ))}
                        </div>
                    )}

                    {!error && classes !== null && classes.length === 0 && (
                        <div className="py-10 text-center text-sm text-[var(--text-muted)]">
                            {user?.role === "student"
                                ? "You haven't joined a class yet. Use the button above to join one with your class code."
                                : "No classes found."}
                        </div>
                    )}

                    {!error && classes && classes.length > 0 && (
                        <div className="divide-y divide-[var(--border)]">
                            {classes.map((item) => {
                                const details = item.class_details;
                                return (
                                    <div
                                        key={item.id}
                                        className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
                                                <IconClasses className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-[var(--text)]">
                                                    {details.name}
                                                    <span className="ml-2 text-xs font-normal text-[var(--text-muted)]">
                                                        Section {details.section}
                                                    </span>
                                                </div>
                                                <div className="mt-1 text-xs text-[var(--text-muted)]">
                                                    {details.batch_name} &middot; {details.academic_year}
                                                </div>
                                                <div className="mt-0.5 text-xs text-[var(--text-muted)]">
                                                    Joined {formatJoinedDate(item.joined_at)}
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleCopyCode(details.class_code, item.id)}
                                            className="self-start rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-medium text-[var(--text)] transition-colors hover:bg-[var(--border)]/40 sm:self-center"
                                            title="Copy class code"
                                        >
                                            {copiedId === item.id ? "Copied!" : details.class_code}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}