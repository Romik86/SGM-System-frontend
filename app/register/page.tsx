"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthShell } from "../_components/auth-shell";
import { Button } from "../_components/ui/button";
import { Field, Input } from "../_components/ui/input";
import { Select } from "../_components/ui/select";
import { AlertBanner } from "../_components/ui/alert-banner";
import {
  registerSchema,
  type RegisterFormValues,
} from "../_validation/auth.validation";
import { register as registerUser } from "../_lib/auth";
import { ApiError } from "../_lib/config";
import { LoaderOverlay } from "../_components/ui/Miniloader";
import { getFriendlyAuthError } from "../_lib/error-messages";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "student" },
    shouldUnregister: true,
  });

  const role = watch("role");

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError("");
    try {
      const { confirm_password, role, ...rest } = values;
      const payload = {
        ...rest,
        role: role === "teacher" ? 1 : 0,
      };
      await registerUser(
        payload as unknown as Parameters<typeof registerUser>[0],
      );
      router.push("/login?registered=1");
    } catch (err) {
      setServerError(getFriendlyAuthError(err, "register"));
    }
  };

  return (
    <AuthShell
      eyebrow="Get started"
      title="Create your account"
      subtitle="Register as a student or teacher to join Gradebook."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[var(--accent)] underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-3"
      >
        {serverError && <AlertBanner message={serverError} />}

        <div className="grid grid-cols-2 gap-3">
          <Field
            label="First name"
            htmlFor="first_name"
            error={errors.first_name?.message}
          >
            <Input
              id="first_name"
              autoComplete="given-name"
              placeholder="Romik"
              error={!!errors.first_name}
              {...register("first_name")}
            />
          </Field>

          <Field
            label="Last name"
            htmlFor="last_name"
            error={errors.last_name?.message}
          >
            <Input
              id="last_name"
              autoComplete="family-name"
              placeholder="Shrestha"
              error={!!errors.last_name}
              {...register("last_name")}
            />
          </Field>
        </div>

        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@school.edu"
            error={!!errors.email}
            {...register("email")}
          />
        </Field>

        <Field
          label="Phone number"
          htmlFor="phone_number"
          error={errors.phone_number?.message}
        >
          <Input
            id="phone_number"
            type="tel"
            autoComplete="tel"
            placeholder="9841497088"
            error={!!errors.phone_number}
            {...register("phone_number")}
          />
        </Field>

        <Field label="Role" htmlFor="role" error={errors.role?.message}>
          <Select id="role" error={!!errors.role} {...register("role")}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </Select>
        </Field>

        {role === "student" && (
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Student ID"
              htmlFor="student_id"
              error={errors.student_id?.message}
            >
              <Input
                id="student_id"
                placeholder="STU-2026-001"
                error={!!errors.student_id}
                {...register("student_id")}
              />
            </Field>

            <Field
              label="Enrollment year"
              htmlFor="enrollment_year"
              error={errors.enrollment_year?.message}
            >
              <Input
                id="enrollment_year"
                type="number"
                placeholder="2026"
                error={!!errors.enrollment_year}
                {...register("enrollment_year", { valueAsNumber: true })}
              />
            </Field>
          </div>
        )}

        <Field
          label="Password"
          htmlFor="password"
          error={errors.password?.message}
        >
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              error={!!errors.password}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--accent)]"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </Field>

        <Field
          label="Confirm password"
          htmlFor="confirm_password"
          error={errors.confirm_password?.message}
        >
          <div className="relative">
            <Input
              id="confirm_password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              error={!!errors.confirm_password}
              {...register("confirm_password")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--accent)]"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </Field>

        <Button type="submit" loading={isSubmitting}>
          Create account
        </Button>
      </form>

      {isSubmitting && <LoaderOverlay message="Creating your account..." />}
    </AuthShell>
  );
}
