// app/_validation/teacher.validation.ts
import { z } from "zod";

// Trimmed to the two currently needed — add back "Assignment"/"Quiz" here
// (and to ExamType in _interfaces/teacher.ts) if that changes later.
export const EXAM_TYPES = ["Midterm", "Final"] as const;

export const gradeEntrySchema = z.object({
  exam_type: z.enum(EXAM_TYPES, { error: "Select an exam type" }),
  obtained_marks: z
    .string()
    .min(1, "Marks are required")
    .regex(/^\d+(\.\d+)?$/, "Enter a valid number"),
  remarks: z.string().max(500, "Remarks are too long").optional(),
});

export type GradeEntryFormValues = z.infer<typeof gradeEntrySchema>;