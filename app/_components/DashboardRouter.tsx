"use client";

import * as React from "react";
import { getStoredUser } from "@/app/_lib/auth";
import DashboardOverview from "./DashboardOverview";
import TeacherDashboardOverview from "./TeacherDashboardOverview";

/**
 * /dashboard is shared between both roles. This picks the right overview
 * client-side instead of duplicating the auth-gate that dashboard/layout.tsx
 * already handles (that layout redirects to /login before this ever renders
 * without a stored user).
 */
export default function DashboardRouter() {
  const [role, setRole] = React.useState<"student" | "teacher" | null>(null);

  React.useEffect(() => {
    setRole(getStoredUser()?.role ?? null);
  }, []);

  if (role === "teacher") return <TeacherDashboardOverview />;
  if (role === "student") return <DashboardOverview />;
  return null; // brief flash before role resolves — layout skeleton covers the initial load
}