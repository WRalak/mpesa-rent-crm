import type { EritsSummary } from "@/lib/kra/calculator";

export function eritsTextTemplate(month: string, summary: EritsSummary) {
  return [
    `eRITS Tax Report - ${month}`,
    `Gross Rent: KES ${summary.grossRent.toFixed(2)}`,
    `Tax Rate: ${(summary.taxRate * 100).toFixed(1)}%`,
    `Tax Due: KES ${summary.taxDue.toFixed(2)}`,
  ].join("\n");
}
