"use client";

import * as React from "react";
import Link from "next/link";
import { getStoredUser } from "@/app/_lib/auth";
import { Card } from "./ui/cards";
import type { StoredUser } from "@/app/_interfaces/auth";

export default function DashboardOverview() {
  const [user, setUser] = React.useState<StoredUser | null>(null);

  React.useEffect(() => {
    setUser(getStoredUser());
  }, []);

  if (!user) return null;

  const links =
    user.role === "teacher"
      ? [
          { href: "/dashboard/classes", label: "Classes", desc: "Manage your batches" },
          { href: "/dashboard/grades", label: "Grades", desc: "Review and enter marks" },
          { href: "/dashboard/attendance", label: "Attendance", desc: "Take today's attendance" },
        ]
      : [
          { href: "/dashboard/subjects", label: "My Subjects", desc: "See your enrolled subjects" },
          { href: "/dashboard/grades", label: "Grades", desc: "Check your latest marks" },
          { href: "/dashboard/assignments", label: "Assignments", desc: "View pending work" },
        ];

  return (
    <div>
      <h1 className="text-xl font-semibold text-[var(--text)]">Overview</h1>
      <p className="mt-2 text-sm text-[var(--text-muted)]">
        {user.role === "teacher"
          ? "Manage your classes, take attendance, and review grades."
          : "Track your grades, assignments, and attendance."}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="transition-colors hover:bg-[var(--border)]/20">
              <div className="text-sm font-semibold text-[var(--text)]">{link.label}</div>
              <div className="mt-1 text-xs text-[var(--text-muted)]">{link.desc}</div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}