"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiGet, apiPost, apiPut, apiDelete } from "@/services/api-client";
import type { PropertyDto, TenantDto } from "@/types";
import { PageShell, SectionCard } from "@/components/ui/page-shell";
import { formatCurrency } from "@/utils/formatters";

interface PropertyDetail extends PropertyDto {
  _count?: {
    tenants: number;
  };
  tenants?: TenantDto[];
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    location: "",
    unitCount: 0,
  });

  useEffect(() => {
    if (params.id) {
      loadProperty(params.id as string);
    }
  }, [params.id]);

  async function loadProperty(id: string) {
    try {
      setLoading(true);
      const data = await apiGet<PropertyDetail>(`/api/properties/${id}`);
      console.log('Property data loaded:', data);
      setProperty(data);
      setEditForm({
        name: data.name,
        location: data.location,
        unitCount: data.unitCount,
      });
    } catch (error) {
      console.error('Failed to load property:', error);
      setError(error instanceof Error ? error.message : "Failed to load property");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
    try {
      await apiPut(`/api/properties/${params.id}`, editForm);
      setProperty(prev => prev ? { ...prev, ...editForm } : null);
      setEditing(false);
      await loadProperty(params.id as string);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update property");
    }
  }

  async function handleDelete() {
    if (confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      try {
        await apiDelete(`/api/properties/${params.id}`);
        router.push("/properties");
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to delete property");
      }
    }
  }

  if (loading) {
    return (
      <PageShell title="Property Details" description="Loading property information...">
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"></div>
        </div>
      </PageShell>
    );
  }

  if (error || !property) {
    return (
      <PageShell title="Property Details" description="Property information">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-red-800">Error</h3>
          <p className="mt-2 text-sm text-red-700">{error || "Property not found"}</p>
          <button
            onClick={() => router.push("/properties")}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Back to Properties
          </button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={property.name}
      description={`Manage ${property.name} - ${property.location}`}
      actions={
        <div className="flex gap-2">
          <button
            onClick={() => setEditing(!editing)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
          >
            {editing ? "Cancel" : "Edit"}
          </button>
          <button
            onClick={handleDelete}
            className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
          <button
            onClick={() => router.push("/properties")}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
          >
            Back
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Property Information */}
        <SectionCard title="Property Information">
          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit Count</label>
                <input
                  type="number"
                  value={editForm.unitCount}
                  onChange={(e) => setEditForm({ ...editForm, unitCount: parseInt(e.target.value) || 0 })}
                  min="1"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Property Name</h4>
                  <p className="text-lg font-semibold text-gray-900">{property.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Location</h4>
                  <p className="text-lg font-semibold text-gray-900">{property.location}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Total Units</h4>
                  <p className="text-lg font-semibold text-gray-900">{property.unitCount}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Occupied Units</h4>
                  <p className="text-lg font-semibold text-gray-900">
                    {property._count?.tenants || 0} / {property.unitCount}
                  </p>
                </div>
              </div>
            </div>
          )}
        </SectionCard>

        {/* Quick Stats */}
        <SectionCard title="Quick Stats">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-600">Total Units</h4>
              <p className="text-2xl font-bold text-blue-900">{property.unitCount}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-green-600">Occupied</h4>
              <p className="text-2xl font-bold text-green-900">{property._count?.tenants || 0}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-orange-600">Vacant</h4>
              <p className="text-2xl font-bold text-orange-900">
                {property.unitCount - (property._count?.tenants || 0)}
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Tenants */}
        <SectionCard title="Tenants">
          <div className="space-y-3">
            {property.tenants && property.tenants.length > 0 ? (
              property.tenants.map((tenant) => (
                <div key={tenant.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{tenant.fullName}</h4>
                      <p className="text-sm text-gray-600">{tenant.phone}</p>
                      <p className="text-sm text-gray-600">Unit {tenant.unitNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(tenant.rentAmount)}</p>
                      <p className="text-sm text-gray-500">Monthly rent</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No tenants registered for this property</p>
                <button
                  onClick={() => router.push(`/tenants?action=add&propertyId=${property.id}`)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add First Tenant
                </button>
              </div>
            )}
          </div>
        </SectionCard>
      </div>
    </PageShell>
  );
}
