import * as React from "react";

export function Card({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 ${className}`}
        >
            {children}
        </div>
    );
}

export function SectionTitle({
    title,
    sub,
    right,
}: {
    title: string;
    sub?: string;
    right?: React.ReactNode;
}) {
    return (
        <div className="mb-4 flex items-start justify-between">
            <div>
                <div className="text-sm font-semibold text-[var(--text)]">{title}</div>
                {sub && <div className="mt-0.5 text-xs text-[var(--text-muted)]">{sub}</div>}
            </div>
            {right}
        </div>
    );
}