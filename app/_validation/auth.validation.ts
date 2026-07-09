// app/_validation/auth.validation.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().min(1, "Email is required").email("Enter a valid email address"),
    phone_number: z
      .string()
      .min(7, "Enter a valid phone number")
      .max(15, "Enter a valid phone number")
      .regex(/^\+?[0-9]+$/, "Digits only"),
    role: z.enum(["teacher", "student"], {
      error: "Select a role",
    }),
    student_id: z.string().optional(),
    enrollment_year: z
      .number({ error: "Enter a valid year" })
      .int()
      .gte(2000, "Enter a valid year")
      .lte(2100, "Enter a valid year")
      .optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  })
  .refine(
    (data) => data.role !== "student" || !!data.student_id,
    {
      message: "Student ID is required for students",
      path: ["student_id"],
    }
  );

export type RegisterFormValues = z.infer<typeof registerSchema>;
