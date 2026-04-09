"use client";

import { useEffect, useState } from "react";
import { apiGet, ApiError } from "@/services/api-client";
import type { DashboardSummary } from "@/types";

const fallback: DashboardSummary = {
  propertiesCount: 0,
  tenantsCount: 0,
  pendingPayments: 0,
  totalCollected: 0,
};

export function useLandlordStats() {
  const [stats, setStats] = useState<DashboardSummary>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const fetchStats = async (attempt = 0) => {
    try {
      setLoading(true);
      setError("");
      const data = await apiGet<DashboardSummary>("/api/dashboard/summary");
      setStats(data);
      setRetryCount(0);
    } catch (err) {
      const apiError = err as ApiError;
      let errorMessage = "Failed to load dashboard summary.";
      
      if (apiError.status === 401) {
        errorMessage = "Please log in to view your dashboard.";
      } else if (apiError.status === 403) {
        errorMessage = "You don't have permission to view this data.";
      } else if (apiError.status === 429) {
        errorMessage = "Too many requests. Please wait a moment.";
      } else if (apiError.status >= 500) {
        errorMessage = "Server error. Please try again later.";
        if (attempt < 2) {
          // Auto-retry for server errors
          setTimeout(() => fetchStats(attempt + 1), 2000 * (attempt + 1));
          return;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    fetchStats();

    return () => {
      mounted = false;
    };
  }, []);

  const retry = () => {
    setRetryCount(prev => prev + 1);
    fetchStats();
  };

  return { stats, loading, error, retry, retryCount };
}
