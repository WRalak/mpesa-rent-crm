"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/services/api-client";

type AdminStats = {
  landlords: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
};

const fallback: AdminStats = {
  landlords: 0,
  activeSubscriptions: 0,
  monthlyRevenue: 0,
};

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    apiGet<Partial<AdminStats>>("/api/admin/stats")
      .then((data) => {
        if (!mounted) return;
        setStats({ ...fallback, ...data });
      })
      .catch(() => {
        if (!mounted) return;
        setError("Failed to load admin stats.");
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
