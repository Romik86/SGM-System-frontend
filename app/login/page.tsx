// app/login/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthShell } from "../_components/auth-shell";
import { Button } from "../_components/ui/button";
import { Field, Input } from "../_components/ui/input";
import { AlertBanner } from "../_components/ui/alert-banner";
import {
  loginSchema,
  type LoginFormValues,
} from "../_validation/auth.validation";
import { login } from "../_lib/auth";
import { ApiError } from "../_lib/config";
import { LoaderOverlay } from "../_components/ui/Miniloader";
import { getFriendlyAuthError } from "../_lib/error-messages";
export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = React.useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError("");
    try {
      await login(values);
      router.push("/dashboard");
    } catch (err) {
      setServerError(getFriendlyAuthError(err, "login"));
    }
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to Gradebook"
      subtitle="Enter your credentials to access your classes and grades."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-[var(--accent)] underline-offset-4 hover:underline"
          >
            Create one
          </Link>
        </>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4"
      >
        {serverError && <AlertBanner message={serverError} />}

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
          label="Password"
          htmlFor="password"
          error={errors.password?.message}
        >
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            error={!!errors.password}
            {...register("password")}
          />
        </Field>

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-xs text-[var(--text-muted)] underline-offset-4 hover:text-[var(--accent)] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" loading={isSubmitting}>
          Sign in
        </Button>
      </form>

      {isSubmitting && <LoaderOverlay message="Signing you in..." />}
    </AuthShell>
  );
}
