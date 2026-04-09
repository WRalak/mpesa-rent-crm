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
      
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const data = await apiGet<DashboardSummary>("/api/dashboard/summary");
      
      clearTimeout(timeoutId);
      setStats(data);
      setRetryCount(0);
    } catch (err) {
      let errorMessage = "Failed to load dashboard summary.";
      
      if (err instanceof Error && err.name === 'AbortError') {
        errorMessage = "Request timed out. Please try again.";
      } else if (err instanceof ApiError) {
        if (err.status === 401) {
          errorMessage = "Please log in to view your dashboard.";
        } else if (err.status === 403) {
          errorMessage = "You don't have permission to view this data.";
        } else if (err.status === 429) {
          errorMessage = "Too many requests. Please wait a moment.";
        } else if (err.status >= 500) {
          errorMessage = "Server error. Please try again later.";
          if (attempt < 2) {
            // Auto-retry for server errors
            setTimeout(() => fetchStats(attempt + 1), 2000 * (attempt + 1));
            return;
          }
        }
      } else if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        errorMessage = "Network error. Please check your connection.";
      }
      
      setError(errorMessage);
      // Set fallback stats to prevent UI from breaking
      setStats(fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const retry = () => {
    setRetryCount(prev => prev + 1);
    fetchStats();
  };

  return { stats, loading, error, retry, retryCount };
}
