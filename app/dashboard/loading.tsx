export default function DashboardLoading() {
    return (
        <div className="animate-pulse">
            <div className="mb-2 h-6 w-40 rounded bg-[var(--border)]" />
            <div className="mb-6 h-4 w-64 rounded bg-[var(--border)]" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-24 rounded-2xl bg-[var(--border)]" />
                ))}
            </div>
        </div>
    );
}