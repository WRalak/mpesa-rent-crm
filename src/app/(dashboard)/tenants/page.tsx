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
    
    // Basic validation
    if (!fullName.trim()) {
      setMessage("Full name is required.");
      return;
    }
    if (!phone.trim()) {
      setMessage("Phone number is required.");
      return;
    }
    if (!unitNumber.trim()) {
      setMessage("Unit number is required.");
      return;
    }
    if (rentAmount <= 0) {
      setMessage("Rent amount must be greater than 0.");
      return;
    }
    if (!propertyId) {
      setMessage("Please select a property.");
      return;
    }
    
    try {
      const tenantData = {
        fullName: fullName.trim(),
        phone: phone.replace(/\D/g, ""), // Remove non-digits
        unitNumber: unitNumber.trim(),
        rentAmount: Math.max(0, rentAmount),
        propertyId,
      };
      
      await apiPost<TenantDto>("/api/tenants", tenantData);
      setFullName("");
      setPhone("");
      setUnitNumber("");
      setRentAmount(0);
      setPropertyId("");
      setMessage("Tenant created successfully!");
      await loadData();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create tenant.";
      setMessage(`Error: ${errorMessage}`);
      console.error("Tenant creation error:", error);
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
        {message ? (
          <p className={`mt-2 text-sm ${
            message.includes('Error') ? 'text-red-600' : 
            message.includes('successfully') ? 'text-green-600' : 'text-blue-600'
          }`}>
            {message}
          </p>
        ) : null}
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
