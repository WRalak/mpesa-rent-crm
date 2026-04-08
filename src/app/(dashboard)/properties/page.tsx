"use client";

import { useState } from "react";
import { apiGet, apiPost } from "@/services/api-client";
import type { PropertyDto } from "@/types";
import { PageShell, SectionCard } from "@/components/ui/page-shell";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<PropertyDto[]>([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [unitCount, setUnitCount] = useState(0);
  const [message, setMessage] = useState("");

  async function loadProperties() {
    setMessage("");
    try {
      setProperties(await apiGet<PropertyDto[]>("/api/properties"));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load properties.");
    }
  }

  async function createProperty() {
    setMessage("");
    try {
      await apiPost<PropertyDto>("/api/properties", { name, location, unitCount });
      setName("");
      setLocation("");
      setUnitCount(0);
      setMessage("Property created.");
      await loadProperties();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to create property.");
    }
  }

  return (
    <PageShell
      title="Properties"
      description="Manage buildings and units from one place."
      actions={
        <button onClick={() => void loadProperties()} className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">
          Refresh
        </button>
      }
    >
      <SectionCard title="Add Property">
        <div className="grid grid-cols-1 gap-3 mt-3 md:grid-cols-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Property name"
            className="rounded-md border px-3 py-2"
          />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="rounded-md border px-3 py-2"
          />
          <input
            type="number"
            value={unitCount}
            onChange={(e) => setUnitCount(Number(e.target.value))}
            placeholder="Unit count"
            className="rounded-md border px-3 py-2"
          />
        </div>
        <button onClick={createProperty} className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800">
          Save Property
        </button>
        {message ? <p className="mt-2 text-sm">{message}</p> : null}
      </SectionCard>

      <div className="space-y-3">
        {properties.map((p) => (
          <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="font-medium">{p.name}</p>
            <p className="text-sm text-gray-600">{p.location}</p>
            <p className="text-sm">Units: {p.unitCount}</p>
          </div>
        ))}
        {properties.length === 0 ? <p className="text-sm text-gray-600">No properties yet.</p> : null}
      </div>
    </PageShell>
  );
}
