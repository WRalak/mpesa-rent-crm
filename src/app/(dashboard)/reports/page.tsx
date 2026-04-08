"use client";

import { useState } from "react";
import { apiGet } from "@/services/api-client";
import { formatCurrency } from "@/utils/formatters";
import { PageShell, SectionCard } from "@/components/ui/page-shell";

type EritsResponse = {
  month: string;
  successfulPayments: number;
  grossRent: number;
  taxRate: number;
  taxDue: number;
};

export default function ReportsPage() {
  const [report, setReport] = useState<EritsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    setLoading(true);
    setError("");
    try {
      const data = await apiGet<EritsResponse>("/api/reports/erits/generate");
      setReport(data);
    } catch {
      setError("Failed to generate report.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell
      title="eRITS Reports"
      description="Generate monthly rental income tax report at 7.5%."
    >

      <button
        onClick={generate}
        disabled={loading}
        className="rounded-lg bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate eRITS Report"}
      </button>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      {report ? (
        <SectionCard title={`Report for ${report.month}`}>
          <h2 className="font-medium">Report for {report.month}</h2>
          <p className="mt-2 text-sm">Successful payments: {report.successfulPayments}</p>
          <p className="text-sm">Gross rent: {formatCurrency(report.grossRent)}</p>
          <p className="text-sm">Tax rate: {(report.taxRate * 100).toFixed(1)}%</p>
          <p className="text-sm font-semibold">Tax due: {formatCurrency(report.taxDue)}</p>
        </SectionCard>
      ) : null}
    </PageShell>
  );
}
