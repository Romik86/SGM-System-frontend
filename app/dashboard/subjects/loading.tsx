export default function SubjectsLoading() {
    return (
        <div className="animate-pulse">
            <div className="mb-2 h-6 w-40 rounded bg-[var(--border)]" />
            <div className="mb-6 h-4 w-72 rounded bg-[var(--border)]" />
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <div className="mb-4 h-5 w-24 rounded bg-[var(--border)]" />
                <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-12 rounded-lg bg-[var(--border)]/40" />
                    ))}
                </div>
            </div>
        </div>
    );
}