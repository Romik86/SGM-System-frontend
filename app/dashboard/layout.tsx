"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { getStoredUser, logout } from "@/app/_lib/auth";
import { useTheme } from "@/app/_lib/useTheme";
import { Sidebar } from "@/app/_components/subnav";
import { Topbar } from "@/app/_components/Topbar";
import { DashboardShellSkeleton } from "@/app/_components/DashboardShellSkeleton";
import type { StoredUser } from "@/app/_interfaces/auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { theme, toggleTheme, ready: themeReady } = useTheme();

    const [user, setUser] = React.useState<StoredUser | null>(null);
    const [checked, setChecked] = React.useState(false);
    const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

    React.useEffect(() => {
        const stored = getStoredUser();

        if (!stored) {
            router.replace("/login");
            return;
        }

        // Onboarding is no longer forced on login — students without a
        // class code yet still land on the dashboard and can join a class
        // later from Settings. (hasJoinedClass import kept for that page.)
        setUser(stored);
        setChecked(true);
    }, [router]);

    const handleLogout = () => {
        logout();
        router.replace("/login");
    };

    if (!checked || !user || !themeReady) {
        return <DashboardShellSkeleton />;
    }

    return (
        <div className="flex min-h-screen">
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
                <Topbar theme={theme} onToggleTheme={toggleTheme} onOpenMobileNav={() => setMobileNavOpen(true)} />
                <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
            </div>
        </div>
    );
}