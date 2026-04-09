import { z } from "zod";

export const eritsSummarySchema = z.object({
  month: z.string(),
  successfulPayments: z.number().int().nonnegative(),
  grossRent: z.number().nonnegative(),
  taxRate: z.number().nonnegative(),
  taxDue: z.number().nonnegative(),
});
