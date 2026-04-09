"use client";

import { useState } from "react";
import { apiGet } from "@/services/api-client";
import { useMpesaPayment } from "@/hooks/useMpesaPayment";
import type { TenantDto } from "@/types";
import { formatCurrency } from "@/utils/formatters";
import { PageShell, SectionCard } from "@/components/ui/page-shell";

type Payment = {
  id: string;
  amount: number;
  phoneNumber: string;
  status: string;
  mpesaReceipt: string | null;
  paidAt: string | null;
  tenantName: string;
  unitNumber: string;
};

export default function PaymentsPage() {
  const [tenants, setTenants] = useState<TenantDto[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [tenantId, setTenantId] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [msg, setMsg] = useState("");
  const { initiatePayment, loading, error } = useMpesaPayment();

  async function load() {
    setMsg("");
    try {
      const [tenantsData, paymentsData] = await Promise.all([
        apiGet<TenantDto[]>("/api/tenants"),
        apiGet<Payment[]>("/api/payments"),
      ]);
      setTenants(tenantsData);
      setPayments(paymentsData);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed to load payments data.");
    }
  }

  async function initiate() {
    setMsg("");
    const response = await initiatePayment({ tenantId, phone, amount });
    if (response) {
      setMsg(response.customerMessage ?? "STK push sent.");
      await load();
    }
  }

  return (
    <PageShell
      title="Payments"
      description="Trigger M-Pesa STK pushes and track payment status."
      actions={
        <button onClick={() => void load()} className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">
          Refresh Data
        </button>
      }
    >
      <SectionCard title="Initiate M-Pesa Payment">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
          <select
            value={tenantId}
            aria-label="Select tenant"
            onChange={(e) => {
              const nextTenantId = e.target.value;
              setTenantId(nextTenantId);
              const selected = tenants.find((t) => t.id === nextTenantId);
              if (selected) {
                setPhone(selected.phone);
                setAmount(selected.rentAmount);
              }
            }}
            className="rounded-md border px-3 py-2"
          >
            <option value="">Select tenant</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                {t.fullName} - {t.unitNumber}
              </option>
            ))}
          </select>
          <input
            aria-label="Phone number"
            placeholder="2547XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-md border px-3 py-2"
          />
          <input
            type="number"
            aria-label="Amount"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="rounded-md border px-3 py-2"
          />
        </div>
        <button onClick={initiate} className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800">
          {loading ? "Sending..." : "Send STK Push"}
        </button>
        {msg ? <p className="mt-2 text-sm">{msg}</p> : null}
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      </SectionCard>

      <SectionCard title="Recent Payments" className="overflow-auto">
        <h2 className="font-medium mb-3">Recent Payments</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Tenant</th>
              <th className="py-2">Unit</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Status</th>
              <th className="py-2">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="py-2">{p.tenantName}</td>
                <td className="py-2">{p.unitNumber}</td>
                <td className="py-2">{formatCurrency(p.amount)}</td>
                <td className="py-2">{p.status}</td>
                <td className="py-2">{p.mpesaReceipt ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </PageShell>
  );
}
