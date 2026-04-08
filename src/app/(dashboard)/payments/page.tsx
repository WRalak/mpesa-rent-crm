"use client";

import { useState } from "react";

type Tenant = {
  id: string;
  fullName: string;
  phone: string;
  unitNumber: string;
  rentAmount: number;
};

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
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [tenantId, setTenantId] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [msg, setMsg] = useState("");

  async function load() {
    const [tRes, pRes] = await Promise.all([fetch("/api/tenants"), fetch("/api/payments")]);
    if (tRes.ok) setTenants((await tRes.json()) as Tenant[]);
    if (pRes.ok) setPayments((await pRes.json()) as Payment[]);
  }

  async function initiate() {
    setMsg("");
    const res = await fetch("/api/mpesa/stkpush", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenantId, phone, amount }),
    });
    const data = (await res.json()) as { customerMessage?: string; error?: string };
    if (res.ok) {
      setMsg(data.customerMessage ?? "STK push sent.");
      await load();
    } else {
      setMsg(data.error ?? "Failed to initiate payment.");
    }
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-semibold">Payments</h1>
      <p className="text-sm text-gray-600 mt-1">Trigger STK push and track statuses.</p>

      <section className="mt-6 rounded-lg border p-4">
        <h2 className="font-medium">Initiate M-Pesa Payment</h2>
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
        <button onClick={initiate} className="mt-3 rounded-md bg-black text-white px-4 py-2">
          Send STK Push
        </button>
        <button onClick={() => void load()} className="mt-3 ml-2 rounded-md border px-4 py-2">
          Refresh Data
        </button>
        {msg ? <p className="mt-2 text-sm">{msg}</p> : null}
      </section>

      <section className="mt-6 rounded-lg border p-4 overflow-auto">
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
                <td className="py-2">KES {p.amount.toFixed(2)}</td>
                <td className="py-2">{p.status}</td>
                <td className="py-2">{p.mpesaReceipt ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
