import { z } from "zod";

export const phoneSchema = z
  .string()
  .transform((value) => value.replace(/\D/g, ""))
  .refine((value) => value.length >= 10, "Phone number must have at least 10 digits");

export const amountSchema = z.number().positive();
