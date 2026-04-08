import type { ApiError } from "@/types";

export async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as Partial<ApiError>;
    throw new Error(data.error ?? `Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

export async function apiPost<T>(
  url: string,
  payload: unknown
): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as Partial<ApiError>;
    throw new Error(data.error ?? `Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}
