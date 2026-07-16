"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@/app/_interfaces/auth";
import type { Theme } from "@/app/_lib/useTheme";
import {
    IconOverview,
    IconClasses,
    IconSubjects,
    IconGrades,
    IconAttendance,
    IconAssignments,
    IconProfile,
    IconSun,
    IconMoon,
    IconClose,
    IconLogout,
    IconProfile as IconSettings,
} from "./ui/icons";

interface NavItem {
    label: string;
    href: string;
    roles?: Role[];
    icon: (props: { className?: string }) => React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
    { label: "Overview", href: "/dashboard", icon: IconOverview },
    { label: "Classes", href: "/dashboard/classes", icon: IconClasses },
    { label: "My Subjects", href: "/dashboard/subjects", roles: ["student"], icon: IconSubjects },
    { label: "Grades", href: "/dashboard/grades", icon: IconGrades },
    { label: "Attendance", href: "/dashboard/attendance", roles: ["teacher"], icon: IconAttendance },
    { label: "Assignments", href: "/dashboard/assignments", icon: IconAssignments },
    { label: "Profile", href: "/dashboard/profile", icon: IconProfile },
    { label: "Settings", href: "/dashboard/settings", icon: IconSettings },
];

interface SidebarProps {
    role: Role;
    theme: Theme;
    onToggleTheme: () => void;
    onLogout: () => void;
    userName: string;
    mobileOpen: boolean;
    onCloseMobile: () => void;
}

export function Sidebar({
    role,
    theme,
    onToggleTheme,
    onLogout,
    userName,
    mobileOpen,
    onCloseMobile,
}: SidebarProps) {
    const pathname = usePathname();
    const drawerRef = React.useRef<HTMLElement>(null);
    const closeBtnRef = React.useRef<HTMLButtonElement>(null);

    const items = React.useMemo(
        () => NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(role)),
        [role]
    );

    // Close on Escape + lock body scroll while the mobile drawer is open
    React.useEffect(() => {
        if (!mobileOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCloseMobile();
        };

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";
        closeBtnRef.current?.focus();

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [mobileOpen, onCloseMobile]);

    // Basic focus trap inside the mobile drawer
    React.useEffect(() => {
        if (!mobileOpen) return;

        const handleTab = (e: KeyboardEvent) => {
            if (e.key !== "Tab" || !drawerRef.current) return;
            const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled])'
            );
            if (focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleTab);
        return () => document.removeEventListener("keydown", handleTab);
    }, [mobileOpen]);

    const isItemActive = React.useCallback(
        (href: string) => pathname === href || pathname?.startsWith(`${href}/`),
        [pathname]
    );

    const renderHeader = (showClose: boolean) => (
        <div className="flex items-center justify-between px-4 py-5">
            <span className="text-lg font-semibold text-[var(--text)]">EduPortal</span>

            <div className="flex items-center gap-1">
                <button
                    onClick={onToggleTheme}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-muted)] outline-none transition-colors hover:bg-[var(--border)]/40 hover:text-[var(--text)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                    aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                    title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                >
                    {theme === "dark" ? <IconSun className="h-5 w-5" /> : <IconMoon className="h-5 w-5" />}
                </button>

                {showClose && (
                    <button
                        ref={closeBtnRef}
                        onClick={onCloseMobile}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-muted)] outline-none transition-colors hover:text-[var(--text)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] md:hidden"
                        aria-label="Close menu"
                    >
                        <IconClose className="h-5 w-5" />
                    </button>
                )}
            </div>
        </div>
    );

    const renderNav = (onNavigate?: () => void) => (
        <nav aria-label="Primary" className="flex-1 space-y-1 px-3">
            {items.map((item) => {
                const active = isItemActive(item.href);
                const Icon = item.icon;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onNavigate}
                        aria-current={active ? "page" : undefined}
                        className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                            active
                                ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                                : "text-[var(--text-muted)] hover:bg-[var(--border)]/40 hover:text-[var(--text)]"
                        }`}
                    >
                        <Icon
                            className={`h-5 w-5 shrink-0 transition-colors ${
                                active ? "text-[var(--accent)]" : "text-[var(--text-muted)] group-hover:text-[var(--text)]"
                            }`}
                        />
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );

    const renderFooter = () => (
        <div className="space-y-1 border-t border-[var(--border)] px-3 py-4">
            <div className="truncate px-3 pb-2 text-xs text-[var(--text-muted)]">{userName}</div>

            <button
                onClick={onLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--text-muted)] outline-none transition-colors hover:bg-[var(--border)]/40 hover:text-[var(--text)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
                <IconLogout className="h-5 w-5" />
                Sign out
            </button>
        </div>
    );

    return (
        <>
            {/* Desktop sidebar */}
            <aside
                aria-label="Sidebar"
                className="hidden w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] md:flex"
            >
                {renderHeader(false)}
                {renderNav()}
                {renderFooter()}
            </aside>

            {/* Mobile drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-[1px] transition-opacity"
                        onClick={onCloseMobile}
                        aria-hidden="true"
                    />
                    <aside
                        ref={drawerRef}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Sidebar"
                        className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-[var(--border)] bg-[var(--surface)] shadow-xl"
                    >
                        {renderHeader(true)}
                        {renderNav(onCloseMobile)}
                        {renderFooter()}
                    </aside>
                </div>
            )}
        </>
    );
}