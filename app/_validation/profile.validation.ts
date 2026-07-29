// app/_validation/profile.validation.ts
import { z } from "zod";

// first_name/last_name are optional at the schema level since students
// don't get these fields in their form at all — the component only sends
// what's actually editable for the current role. phone_number is required
// for everyone.
export const profileEditSchema = z.object({
  first_name: z.string().max(150, "Too long").optional(),
  last_name: z.string().max(150, "Too long").optional(),
  phone_number: z
    .string()
    .min(1, "Phone number is required")
    .max(20, "Phone number looks too long")
    .regex(/^[0-9+\-\s()]+$/, "Enter a valid phone number"),
});

export type ProfileEditFormValues = z.infer<typeof profileEditSchema>;