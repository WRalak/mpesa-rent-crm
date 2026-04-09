"use client";

import { useState, useEffect } from "react";
import { apiGet, apiPost } from "@/services/api-client";
import type { PropertyDto } from "@/types";
import { PageShell, SectionCard } from "@/components/ui/page-shell";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<PropertyDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [unitCount, setUnitCount] = useState(0);
  const [message, setMessage] = useState("");

  // Load properties on component mount
  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    setMessage("");
    setLoading(true);
    try {
      const data = await apiGet<PropertyDto[]>("/api/properties");
      // Ensure we always have an array
      setProperties(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load properties:", error);
      setMessage(error instanceof Error ? error.message : "Failed to load properties.");
      setProperties([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  }

  async function createProperty() {
    setMessage("");
    setSaving(true);
    
    console.log("Creating property with data:", { name, location, unitCount });
    
    // Basic validation
    if (!name.trim()) {
      setMessage("Property name is required.");
      setSaving(false);
      return;
    }
    if (!location.trim()) {
      setMessage("Location is required.");
      setSaving(false);
      return;
    }
    if (unitCount < 1) {
      setMessage("Unit count must be at least 1.");
      setSaving(false);
      return;
    }
    
    try {
      const propertyData = {
        name: name.trim(),
        location: location.trim(),
        unitCount: Math.max(1, Math.floor(unitCount))
      };
      
      console.log("Sending property data:", propertyData);
      
      const result = await apiPost<PropertyDto>("/api/properties", propertyData);
      console.log("Property created successfully:", result);
      
      setName("");
      setLocation("");
      setUnitCount(0);
      setMessage("Property created successfully!");
      await loadProperties();
    } catch (error) {
      console.error("Property creation error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create property.";
      setMessage(`Error: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageShell
      title="Properties"
      description="Manage buildings and units from one place."
      actions={
        <button 
          onClick={() => void loadProperties()} 
          disabled={loading}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      }
    >
      <SectionCard title="Add Property">
        <div className="space-y-4 mt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Sunset Apartments"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Nairobi, Kenya"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit Count</label>
              <input
                type="number"
                value={unitCount}
                onChange={(e) => setUnitCount(Number(e.target.value))}
                placeholder="e.g., 12"
                min="1"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <button 
              onClick={createProperty}
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 to-blue-800 transition-all duration-200 transform hover:-translate-y-1 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="flex items-center">
                {saving ? (
                  <svg className="h-5 w-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4v16m8-8H4" />
                  </svg>
                )}
                {saving ? "Saving..." : "Save Property"}
              </div>
            </button>
            
            <div className="flex gap-2 flex-wrap">
              <button 
                onClick={() => {
                  setName("Test Property");
                  setLocation("Test Location");
                  setUnitCount(5);
                  setMessage("");
                }}
                className="text-gray-600 hover:text-gray-800 px-4 py-2 text-sm border border-gray-300 rounded"
              >
                Fill Test Data
              </button>
              
              <button 
                onClick={async () => {
                  try {
                    const response = await fetch('/api/test-db');
                    const data = await response.json();
                    console.log('Database test result:', data);
                    setMessage(`Database test: ${data.success ? 'Success' : 'Failed'} - Users: ${data.userCount}, Properties: ${data.propertyCount}`);
                  } catch (error) {
                    console.error('Database test failed:', error);
                    setMessage('Database test failed - check console');
                  }
                }}
                className="text-gray-600 hover:text-gray-800 px-4 py-2 text-sm border border-gray-300 rounded"
              >
                Test Database
              </button>
              
              <button 
                onClick={() => {
                  // Create a test property and then navigate to it
                  createProperty().then(() => {
                    setTimeout(() => {
                      if (properties.length > 0) {
                        const lastProperty = properties[properties.length - 1];
                        window.location.href = `/properties/${lastProperty.id}`;
                      }
                    }, 1000);
                  });
                }}
                className="text-blue-600 hover:text-blue-800 px-4 py-2 text-sm border border-blue-300 rounded"
              >
                Test Property Detail
              </button>
              
              <button 
                onClick={() => {
                  setName("");
                  setLocation("");
                  setUnitCount(0);
                  setMessage("");
                }}
                className="text-gray-600 hover:text-gray-800 px-4 py-2 text-sm"
              >
                Clear Form
              </button>
            </div>
          </div>
        </div>
        
        {message && (
          <div className={`mt-4 p-4 rounded-lg ${
            message.includes('Error') ? 'bg-red-50 border border-red-200 text-red-800' : 
            message.includes('successfully') ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-blue-50 border border-blue-200 text-blue-800'
          }`}>
            <div className="flex items-center">
              {message.includes('successfully') ? (
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              ) : message.includes('Error') ? (
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="font-medium">{message}</span>
            </div>
          </div>
        )}
      </SectionCard>

      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"></div>
          </div>
        ) : Array.isArray(properties) && properties.length > 0 ? (
          properties.map((p) => (
            <div 
              key={p.id} 
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300 group"
              onClick={() => window.location.href = `/properties/${p.id}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{p.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{p.location}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-gray-500">
                      <span className="font-medium">{p.unitCount}</span> units
                    </span>
                    {p._count && p._count.tenants > 0 && (
                      <span className="text-sm text-green-600">
                        <span className="font-medium">{p._count.tenants}</span> tenants
                      </span>
                    )}
                  </div>
                </div>
                <div className="ml-4">
                  <svg className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-600">No properties yet.</p>
        )}
      </div>
    </PageShell>
  );
}
