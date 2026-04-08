import type { EritsSummary } from "@/lib/kra/calculator";

export function generateEritsCsv(month: string, summary: EritsSummary) {
  const header = "month,grossRent,taxRate,taxDue";
  const row = `${month},${summary.grossRent},${summary.taxRate},${summary.taxDue}`;
  return `${header}\n${row}\n`;
}
