"use client";

import { useState } from "react";

type Property = {
  id: string;
  name: string;
  location: string;
  unitCount: number;
};

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [unitCount, setUnitCount] = useState(0);
  const [message, setMessage] = useState("");

  async function loadProperties() {
    const res = await fetch("/api/properties");
    if (res.ok) {
      setProperties((await res.json()) as Property[]);
    }
  }

  async function createProperty() {
    setMessage("");
    const res = await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, location, unitCount }),
    });

    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setMessage(data.error ?? "Failed to create property.");
      return;
    }

    setName("");
    setLocation("");
    setUnitCount(0);
    setMessage("Property created.");
    await loadProperties();
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-semibold">Properties</h1>
      <button onClick={() => void loadProperties()} className="mt-3 rounded-md border px-4 py-2">
        Load Properties
      </button>

      <section className="mt-4 rounded-lg border p-4">
        <h2 className="font-medium">Add Property</h2>
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
        <button onClick={createProperty} className="mt-3 rounded-md bg-black px-4 py-2 text-white">
          Save Property
        </button>
        {message ? <p className="mt-2 text-sm">{message}</p> : null}
      </section>

      <div className="mt-4 space-y-3">
        {properties.map((p) => (
          <div key={p.id} className="rounded-lg border p-4">
            <p className="font-medium">{p.name}</p>
            <p className="text-sm text-gray-600">{p.location}</p>
            <p className="text-sm">Units: {p.unitCount}</p>
          </div>
        ))}
        {properties.length === 0 ? <p className="text-sm text-gray-600">No properties yet.</p> : null}
      </div>
    </main>
  );
}
