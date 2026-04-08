"use client";

import { useState } from "react";
import { apiPost } from "@/services/api-client";

type MpesaRequest = {
  tenantId: string;
  phone: string;
  amount: number;
};

type MpesaResponse = {
  paymentId: string;
  checkoutRequestId: string;
  customerMessage: string;
};

export function useMpesaPayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function initiatePayment(payload: MpesaRequest) {
    setLoading(true);
    setError("");
    try {
      return await apiPost<MpesaResponse>("/api/mpesa/stkpush", payload);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to initiate payment.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { initiatePayment, loading, error };
}
