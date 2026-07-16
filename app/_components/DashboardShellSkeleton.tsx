export function DashboardShellSkeleton() {
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