"use client";

import { useState } from "react";

type Tenant = {
  id: string;
  fullName: string;
  phone: string;
  unitNumber: string;
  rentAmount: number;
};

type Property = {
  id: string;
  name: string;
  unitCount: number;
};

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [unitNumber, setUnitNumber] = useState("");
  const [rentAmount, setRentAmount] = useState(0);
  const [propertyId, setPropertyId] = useState("");
  const [message, setMessage] = useState("");

  async function loadData() {
    const [tRes, pRes] = await Promise.all([fetch("/api/tenants"), fetch("/api/properties")]);
    if (tRes.ok) {
      setTenants((await tRes.json()) as Tenant[]);
    }
    if (pRes.ok) {
      setProperties((await pRes.json()) as Property[]);
    }
  }

  async function createTenant() {
    setMessage("");
    const res = await fetch("/api/tenants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        phone,
        unitNumber,
        rentAmount,
        propertyId,
      }),
    });

    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setMessage(data.error ?? "Failed to create tenant.");
      return;
    }

    setFullName("");
    setPhone("");
    setUnitNumber("");
    setRentAmount(0);
    setPropertyId("");
    setMessage("Tenant created.");
    await loadData();
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-semibold">Tenants</h1>
      <button onClick={() => void loadData()} className="mt-3 rounded-md border px-4 py-2">
        Load Tenants & Properties
      </button>

      <section className="mt-4 rounded-lg border p-4">
        <h2 className="font-medium">Add Tenant</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full name"
            className="rounded-md border px-3 py-2"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
            className="rounded-md border px-3 py-2"
          />
          <input
            value={unitNumber}
            onChange={(e) => setUnitNumber(e.target.value)}
            placeholder="Unit number"
            className="rounded-md border px-3 py-2"
          />
          <input
            type="number"
            value={rentAmount}
            onChange={(e) => setRentAmount(Number(e.target.value))}
            placeholder="Rent amount"
            className="rounded-md border px-3 py-2"
          />
          <select
            value={propertyId}
            aria-label="Select property"
            onChange={(e) => setPropertyId(e.target.value)}
            className="rounded-md border px-3 py-2"
          >
            <option value="">Select property</option>
            {properties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.name} ({property.unitCount} units)
              </option>
            ))}
          </select>
        </div>
        <button onClick={createTenant} className="mt-3 rounded-md bg-black px-4 py-2 text-white">
          Save Tenant
        </button>
        {message ? <p className="mt-2 text-sm">{message}</p> : null}
      </section>

      <div className="mt-4 space-y-3">
        {tenants.map((t) => (
          <div key={t.id} className="rounded-lg border p-4">
            <p className="font-medium">{t.fullName}</p>
            <p className="text-sm text-gray-600">Unit {t.unitNumber}</p>
            <p className="text-sm">{t.phone}</p>
            <p className="text-sm">KES {t.rentAmount.toFixed(2)}</p>
          </div>
        ))}
        {tenants.length === 0 ? <p className="text-sm text-gray-600">No tenants yet.</p> : null}
      </div>
    </main>
  );
}
