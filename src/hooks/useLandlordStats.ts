"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/services/api-client";
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

  useEffect(() => {
    let mounted = true;
    apiGet<DashboardSummary>("/api/dashboard/summary")
      .then((data) => {
        if (mounted) setStats(data);
      })
      .catch(() => {
        if (mounted) setError("Failed to load dashboard summary.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { stats, loading, error };
}
