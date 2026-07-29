"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { getMyProfileClient, updateMyProfileClient } from "@/app/_lib/profile";
import { profileEditSchema, type ProfileEditFormValues } from "@/app/_validation/profile.validation";
import type { ProfileResponse } from "@/app/_interfaces/profile";

import { Field, Input } from "./ui/input";
import { Button } from "./ui/button";
import { AlertBanner } from "./ui/alert-banner";
import { IconProfile } from "./ui/icons";

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function ProfileClient() {
  const [profile, setProfile] = React.useState<ProfileResponse | null>(null);
  const [loadError, setLoadError] = React.useState("");
  const [serverError, setServerError] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileEditFormValues>({
    resolver: zodResolver(profileEditSchema),
  });

  const isTeacher = profile?.role === "teacher";

  const loadProfile = React.useCallback(async () => {
    try {
      const data = await getMyProfileClient();
      setProfile(data);
      reset({
        first_name: data.first_name ?? "",
        last_name: data.last_name ?? "",
        phone_number: data.phone_number ?? "",
      });
      setLoadError("");
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load profile.");
    }
  }, [reset]);

  React.useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const onSubmit = async (values: ProfileEditFormValues) => {
    setServerError("");
    setSuccess(false);
    try {
      const updated = await updateMyProfileClient({
        first_name: values.first_name,
        last_name: values.last_name,
        phone_number: values.phone_number,
      });
      setProfile(updated);
      reset({
        first_name: updated.first_name ?? "",
        last_name: updated.last_name ?? "",
        phone_number: updated.phone_number ?? "",
      });
      setSuccess(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Failed to update profile.");
    }
  };

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
        {isTeacher ? "TEACHER · PROFILE" : "STUDENT · PROFILE"}
      </p>
      <h1 className="mt-1.5 font-serif text-2xl font-bold text-[var(--text)] sm:text-[28px]">
        My Profile
      </h1>
      <p className="mt-1.5 text-sm text-[var(--text-muted)]">
        Update your name and phone number. Email and role are managed by the school.
      </p>

      {loadError && (
        <div className="mt-5">
          <AlertBanner message={loadError} />
        </div>
      )}

      {!loadError && !profile && (
        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.3fr]">
          <div className="h-72 animate-pulse rounded-2xl bg-[var(--surface)]/60" />
          <div className="h-72 animate-pulse rounded-2xl bg-[var(--surface)]/60" />
        </div>
      )}

      {profile && (
        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.3fr]">
          {/* Profile summary card */}
          <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
            <div className="px-5 pt-5 pb-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-[var(--surface)] bg-[var(--accent)] font-serif text-2xl font-bold text-[var(--accent-ink)] shadow-sm">
                {profile.profile_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.profile_image}
                    alt={profile.full_name}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(profile.full_name)
                )}
              </div>

              <div className="mt-3">
                <div className="font-serif text-lg font-bold text-[var(--text)]">
                  {profile.full_name}
                </div>
                <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)]/10 px-2.5 py-1 text-[11px] font-semibold capitalize text-[var(--accent)]">
                  <IconProfile className="h-3.5 w-3.5" />
                  {profile.role}
                </div>
              </div>

              <dl className="mt-5 space-y-4 border-t border-[var(--line)] pt-4 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                    Email
                  </dt>
                  <dd className="text-right text-[var(--text)]">{profile.email}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                    First name
                  </dt>
                  <dd className="text-right text-[var(--text)]">{profile.first_name || "—"}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                    Last name
                  </dt>
                  <dd className="text-right text-[var(--text)]">{profile.last_name || "—"}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                    Phone
                  </dt>
                  <dd className="text-right text-[var(--text)]">{profile.phone_number || "—"}</dd>
                </div>

                {profile.role === "student" && (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <dt className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                        Student ID
                      </dt>
                      <dd className="text-right text-[var(--text)]">{profile.student_id || "—"}</dd>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <dt className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                        Enrollment year
                      </dt>
                      <dd className="text-right text-[var(--text)]">{profile.enrollment_year ?? "—"}</dd>
                    </div>
                  </>
                )}
              </dl>
            </div>
          </div>

          {/* Editable form */}
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--gold)]/10 text-[var(--gold)]">
                <IconProfile className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text)]">Editable details</p>
                <p className="text-xs text-[var(--text-muted)]">
                  Name and phone number can be updated here.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="mt-6 flex flex-col gap-5"
            >
              {serverError && <AlertBanner message={serverError} />}
              {success && (
                <div className="rounded-xl border border-[var(--gold)]/30 bg-[var(--gold)]/10 px-4 py-3 text-sm text-[var(--gold)]">
                  Profile updated successfully.
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="First name" htmlFor="first_name" error={errors.first_name?.message}>
                  <Input
                    id="first_name"
                    autoComplete="given-name"
                    error={!!errors.first_name}
                    {...register("first_name")}
                  />
                </Field>
                <Field label="Last name" htmlFor="last_name" error={errors.last_name?.message}>
                  <Input
                    id="last_name"
                    autoComplete="family-name"
                    error={!!errors.last_name}
                    {...register("last_name")}
                  />
                </Field>
              </div>

              <Field label="Phone number" htmlFor="phone_number" error={errors.phone_number?.message}>
                <Input
                  id="phone_number"
                  type="tel"
                  autoComplete="tel"
                  error={!!errors.phone_number}
                  {...register("phone_number")}
                />
              </Field>

              <div className="flex items-center gap-3 border-t border-[var(--line)] pt-5">
                <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
                  Save changes
                </Button>
                {isDirty && (
                  <button
                    type="button"
                    onClick={() =>
                      reset({
                        first_name: profile.first_name ?? "",
                        last_name: profile.last_name ?? "",
                        phone_number: profile.phone_number ?? "",
                      })
                    }
                    className="text-xs font-medium text-[var(--text-muted)] underline-offset-4 hover:text-[var(--accent)] hover:underline"
                  >
                    Discard changes
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}