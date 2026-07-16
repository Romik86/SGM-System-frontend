"use client";

import * as React from "react";

export type Theme = "light" | "dark";

export function useTheme() {
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