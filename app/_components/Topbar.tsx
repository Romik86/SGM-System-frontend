"use client";

import type { Theme } from "@/app/_lib/useTheme";
import { IconMenu, IconSun, IconMoon } from "./ui/icons";

interface TopbarProps {
    theme: Theme;
    onToggleTheme: () => void;
    onOpenMobileNav: () => void;
}

export function Topbar({ theme, onToggleTheme, onOpenMobileNav }: TopbarProps) {
    return (
        <header className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3 md:hidden">
            <button onClick={onOpenMobileNav} className="rounded-md p-1 text-[var(--text)]" aria-label="Open menu">
                <IconMenu className="h-6 w-6" />
            </button>
            <span className="text-sm font-semibold text-[var(--text)]">EduPortal</span>
            <button onClick={onToggleTheme} className="rounded-md p-1 text-[var(--text)]" aria-label="Toggle theme">
                {theme === "dark" ? <IconSun className="h-5 w-5" /> : <IconMoon className="h-5 w-5" />}
            </button>
        </header>
    );
}