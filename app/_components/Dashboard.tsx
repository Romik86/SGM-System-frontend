// app/dashboard/Dashboard.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { getStoredUser, logout } from "../_lib/auth";

type Role = "teacher" | "student";
type Theme = "light" | "dark";

interface StoredUser {
    id?: string | number;
    full_name: string;
    role: Role;
    batch_id?: string | number | null;
    class_code?: string | null;
    token?: string;
    access_token?: string;
    [key: string]: unknown;
}

interface NavItem {
    label: string;
    href: string;
    roles?: Role[];
    icon: (props: { className?: string }) => React.ReactNode;
}

/* ------------------------------------------------------------------ */
/*  Icons (inline SVG, zero extra deps)                                */
/* ------------------------------------------------------------------ */

const IconOverview = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M3 10.5 12 3l9 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const IconClasses = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M4 19.5V6a2 2 0 0 1 2-2h13v15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 22a2 2 0 0 1-2-2v-.5A1.5 1.5 0 0 1 5.5 18H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 7h9M8 10.5h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

const IconGrades = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M9 3h6l1 4H8l1-4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M5 7h14l-1.2 12.2A2 2 0 0 1 15.8 21H8.2a2 2 0 0 1-2-1.8L5 7Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M9 11l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const IconAttendance = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="4" y="5" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4 10h16M9 3v4M15 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M8.5 14.5l2 2 4-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const IconAssignments = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M7 3.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V5A1.5 1.5 0 0 1 7 3.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M14 3.5V8h4.5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M9 12.5h6M9 15.5h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

const IconProfile = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="12" cy="8" r="3.3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M5 20c1-3.5 4-5.5 7-5.5s6 2 7 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

const IconSun = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

const IconMoon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
);

const IconMenu = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

const IconClose = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

const IconLogout = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/* ------------------------------------------------------------------ */
/*  Nav config                                                         */
/* ------------------------------------------------------------------ */

const NAV_ITEMS: NavItem[] = [
    { label: "Overview", href: "/dashboard", icon: IconOverview },
    { label: "Classes", href: "/dashboard/classes", icon: IconClasses },
    { label: "Grades", href: "/dashboard/grades", icon: IconGrades },
    { label: "Attendance", href: "/dashboard/attendance", roles: ["teacher"], icon: IconAttendance },
    { label: "Assignments", href: "/dashboard/assignments", icon: IconAssignments },
    { label: "Profile", href: "/dashboard/profile", icon: IconProfile },
];

/* ------------------------------------------------------------------ */
/*  Theme handling                                                     */
/* ------------------------------------------------------------------ */

function useTheme() {
    const [theme, setTheme] = React.useState<Theme>("light");
    const [ready, setReady] = React.useState(false);

    React.useEffect(() => {
        const stored = window.localStorage.getItem("theme") as Theme | null;
        const preferred: Theme =
            stored ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        setTheme(preferred);
        document.documentElement.classList.toggle("dark", preferred === "dark");
        setReady(true);
    }, []);

    const toggleTheme = React.useCallback(() => {
        setTheme((prev) => {
            const next: Theme = prev === "dark" ? "light" : "dark";
            document.documentElement.classList.toggle("dark", next === "dark");
            window.localStorage.setItem("theme", next);
            return next;
        });
    }, []);

    return { theme, toggleTheme, ready };
}

/* ------------------------------------------------------------------ */
/*  Auth token helper                                                  */
/*  TODO: replace with the real token accessor from auth.service       */
/* ------------------------------------------------------------------ */

function getAuthToken(user: StoredUser | null): string | null {
    if (user?.token) return user.token;
    if (user?.access_token) return user.access_token;
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem("token") ?? window.localStorage.getItem("access_token");
}

/* ------------------------------------------------------------------ */
/*  Onboarding: has this student already joined a batch?               */
/*  TODO: point this at the real field(s) your API returns.            */
/* ------------------------------------------------------------------ */

function hasJoinedClass(user: StoredUser): boolean {
    if (user.batch_id || user.class_code) return true;
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(`onboarded:${user.id ?? user.full_name}`) === "1";
}

async function joinClassRequest(classCode: string, token: string | null) {
    // TODO: swap in your real API base URL, e.g. via NEXT_PUBLIC_API_BASE_URL
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

    const res = await fetch(`${API_BASE_URL}/system/classes/join/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
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

    return res.json().catch(() => ({}));
}

/* ------------------------------------------------------------------ */
/*  Skeleton loader                                                    */
/* ------------------------------------------------------------------ */

function DashboardSkeleton() {
    return (
        <div className="flex min-h-screen bg-[var(--background)]">
            <div className="hidden w-64 flex-col gap-2 border-r border-[var(--border)] bg-[var(--surface)] p-4 md:flex">
                <div className="mb-6 h-8 w-32 animate-pulse rounded bg-[var(--border)]" />
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-9 w-full animate-pulse rounded-lg bg-[var(--border)]" />
                ))}
            </div>
            <div className="flex-1 p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="h-6 w-40 animate-pulse rounded bg-[var(--border)]" />
                    <div className="h-9 w-9 animate-pulse rounded-full bg-[var(--border)]" />
                </div>
                <div className="mb-4 h-5 w-56 animate-pulse rounded bg-[var(--border)]" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-28 animate-pulse rounded-xl bg-[var(--border)]" />
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Sidebar                                                             */
/* ------------------------------------------------------------------ */

function Sidebar({
    role,
    theme,
    onToggleTheme,
    onLogout,
    userName,
    mobileOpen,
    onCloseMobile,
}: {
    role: Role;
    theme: Theme;
    onToggleTheme: () => void;
    onLogout: () => void;
    userName: string;
    mobileOpen: boolean;
    onCloseMobile: () => void;
}) {
    const pathname = usePathname();
    const items = NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(role));

    const content = (
        <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-4 py-5">
                <span className="text-lg font-semibold text-[var(--text)]">EduPortal</span>
                <button
                    onClick={onCloseMobile}
                    className="rounded-md p-1 text-[var(--text-muted)] hover:text-[var(--text)] md:hidden"
                    aria-label="Close menu"
                >
                    <IconClose className="h-5 w-5" />
                </button>
            </div>

            <nav className="flex-1 space-y-1 px-3">
                {items.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onCloseMobile}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                isActive
                                    ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                                    : "text-[var(--text-muted)] hover:bg-[var(--border)]/40 hover:text-[var(--text)]"
                            }`}
                        >
                            <Icon className="h-5 w-5 shrink-0" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="space-y-1 border-t border-[var(--border)] px-3 py-4">
                <div className="truncate px-3 pb-2 text-xs text-[var(--text-muted)]">{userName}</div>

                <button
                    onClick={onToggleTheme}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--border)]/40 hover:text-[var(--text)]"
                >
                    {theme === "dark" ? <IconSun className="h-5 w-5" /> : <IconMoon className="h-5 w-5" />}
                    {theme === "dark" ? "Light mode" : "Dark mode"}
                </button>

                <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--border)]/40 hover:text-[var(--text)]"
                >
                    <IconLogout className="h-5 w-5" />
                    Sign out
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden w-64 shrink-0 border-r border-[var(--border)] bg-[var(--surface)] md:flex">
                {content}
            </aside>

            {/* Mobile slide-over */}
            {mobileOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div className="absolute inset-0 bg-black/40" onClick={onCloseMobile} />
                    <aside className="absolute inset-y-0 left-0 w-64 border-r border-[var(--border)] bg-[var(--surface)] shadow-xl">
                        {content}
                    </aside>
                </div>
            )}
        </>
    );
}

/* ------------------------------------------------------------------ */
/*  Onboarding modal                                                   */
/* ------------------------------------------------------------------ */

function OnboardingModal({
    onJoined,
    token,
}: {
    onJoined: (classCode: string) => void;
    token: string | null;
}) {
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
            await joinClassRequest(code, token);
            onJoined(code);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl">
                <h2 className="text-lg font-semibold text-[var(--text)]">Welcome! Let&apos;s get you set up</h2>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                    Enter the class code your teacher shared with you to join your batch. You&apos;ll need this to see
                    your subjects, grades, and attendance.
                </p>

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
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Main Dashboard component                                           */
/* ------------------------------------------------------------------ */

export function Dashboard() {
    const router = useRouter();
    const { theme, toggleTheme, ready: themeReady } = useTheme();

    const [user, setUser] = React.useState<StoredUser | null>(null);
    const [authChecked, setAuthChecked] = React.useState(false);
    const [needsOnboarding, setNeedsOnboarding] = React.useState(false);
    const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

    React.useEffect(() => {
        const stored = getStoredUser() as StoredUser | null;
        if (!stored) {
            router.push("/login");
            return;
        }
        setUser(stored);
        setNeedsOnboarding(stored.role === "student" && !hasJoinedClass(stored));
        setAuthChecked(true);
    }, [router]);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const handleJoined = (classCode: string) => {
        if (user) {
            window.localStorage.setItem(`onboarded:${user.id ?? user.full_name}`, "1");
            setUser({ ...user, class_code: classCode });
        }
        setNeedsOnboarding(false);
    };

    const isLoading = !authChecked || !user || !themeReady;

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="flex min-h-screen bg-[var(--background)]">
            <Sidebar
                role={user.role}
                theme={theme}
                onToggleTheme={toggleTheme}
                onLogout={handleLogout}
                userName={user.full_name}
                mobileOpen={mobileNavOpen}
                onCloseMobile={() => setMobileNavOpen(false)}
            />

            <div className="flex flex-1 flex-col">
                {/* Mobile top bar */}
                <header className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3 md:hidden">
                    <button
                        onClick={() => setMobileNavOpen(true)}
                        className="rounded-md p-1 text-[var(--text)]"
                        aria-label="Open menu"
                    >
                        <IconMenu className="h-6 w-6" />
                    </button>
                    <span className="text-sm font-semibold text-[var(--text)]">EduPortal</span>
                    <button onClick={toggleTheme} className="rounded-md p-1 text-[var(--text)]" aria-label="Toggle theme">
                        {theme === "dark" ? <IconSun className="h-5 w-5" /> : <IconMoon className="h-5 w-5" />}
                    </button>
                </header>

                <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
                    <h1 className="text-xl font-semibold text-[var(--text)]">Overview</h1>
                    <p className="mt-2 text-sm text-[var(--text-muted)]">
                        {user.role === "teacher"
                            ? "Manage your classes, take attendance, and review grades."
                            : "Track your grades, assignments, and attendance."}
                    </p>
                </main>
            </div>

            {needsOnboarding && (
                <OnboardingModal token={getAuthToken(user)} onJoined={handleJoined} />
            )}
        </div>
    );
}