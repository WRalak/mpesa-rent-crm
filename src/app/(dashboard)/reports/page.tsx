"use client";

import { useState } from "react";

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
      const res = await fetch("/api/reports/erits/generate", {
        method: "GET",
      });
      const data = (await res.json()) as EritsResponse | { error: string };
      if (!res.ok) {
        setError((data as { error: string }).error ?? "Failed to generate.");
        return;
      }
      setReport(data as EritsResponse);
    } catch {
      setError("Failed to generate report.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-4xl p-6">
      <h1 className="text-2xl font-semibold">eRITS Reports</h1>
      <p className="text-sm text-gray-600 mt-1">
        Generate monthly rental income tax report at 7.5%.
      </p>

      <button
        onClick={generate}
        disabled={loading}
        className="mt-4 rounded-md bg-black text-white px-4 py-2 disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate eRITS Report"}
      </button>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      {report ? (
        <section className="mt-6 rounded-lg border p-4">
          <h2 className="font-medium">Report for {report.month}</h2>
          <p className="mt-2 text-sm">Successful payments: {report.successfulPayments}</p>
          <p className="text-sm">Gross rent: KES {report.grossRent.toFixed(2)}</p>
          <p className="text-sm">Tax rate: {(report.taxRate * 100).toFixed(1)}%</p>
          <p className="text-sm font-semibold">Tax due: KES {report.taxDue.toFixed(2)}</p>
        </section>
      ) : null}
    </main>
  );
}
