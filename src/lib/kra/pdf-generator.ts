import type { EritsSummary } from "@/lib/kra/calculator";
import { eritsTextTemplate } from "@/lib/kra/templates";

export function generateEritsPdf(month: string, summary: EritsSummary) {
  // Placeholder return type; integrate a real PDF library when needed.
  return Buffer.from(eritsTextTemplate(month, summary), "utf-8");
}
