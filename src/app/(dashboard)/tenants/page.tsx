"use client";

import { useState } from "react";
import { apiGet, apiPost } from "@/services/api-client";
import type { PropertyDto, TenantDto } from "@/types";
import { formatCurrency } from "@/utils/formatters";
import { PageShell, SectionCard } from "@/components/ui/page-shell";

type PropertyOption = Pick<PropertyDto, "id" | "name" | "unitCount">;

export default function TenantsPage() {
  const [tenants, setTenants] = useState<TenantDto[]>([]);
  const [properties, setProperties] = useState<PropertyOption[]>([]);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [unitNumber, setUnitNumber] = useState("");
  const [rentAmount, setRentAmount] = useState(0);
  const [propertyId, setPropertyId] = useState("");
  const [message, setMessage] = useState("");

  async function loadData() {
    setMessage("");
    try {
      const [tenantsData, propertiesData] = await Promise.all([
        apiGet<TenantDto[]>("/api/tenants"),
        apiGet<PropertyOption[]>("/api/properties"),
      ]);
      setTenants(tenantsData);
      setProperties(propertiesData);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load tenants.");
    }
  }

  async function createTenant() {
    setMessage("");
    try {
      await apiPost<TenantDto>("/api/tenants", {
        fullName,
        phone,
        unitNumber,
        rentAmount,
        propertyId,
      });
      setFullName("");
      setPhone("");
      setUnitNumber("");
      setRentAmount(0);
      setPropertyId("");
      setMessage("Tenant created.");
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to create tenant.");
    }
  }

  return (
    <PageShell
      title="Tenants"
      description="Track tenant contacts and monthly rent amounts."
      actions={
        <button onClick={() => void loadData()} className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">
          Refresh
        </button>
      }
    >
      <SectionCard title="Add Tenant">
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
        <button onClick={createTenant} className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800">
          Save Tenant
        </button>
        {message ? <p className="mt-2 text-sm">{message}</p> : null}
      </SectionCard>

      <div className="space-y-3">
        {tenants.map((t) => (
          <div key={t.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="font-medium">{t.fullName}</p>
            <p className="text-sm text-gray-600">Unit {t.unitNumber}</p>
            <p className="text-sm">{t.phone}</p>
            <p className="text-sm">{formatCurrency(t.rentAmount)}</p>
          </div>
        ))}
        {tenants.length === 0 ? <p className="text-sm text-gray-600">No tenants yet.</p> : null}
      </div>
    </PageShell>
  );
}
