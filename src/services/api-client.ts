import type { ApiError as ApiErrorType } from "@/types";

interface RequestOptions {
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}

const DEFAULT_TIMEOUT = 30000; // 30 seconds
const DEFAULT_RETRIES = 2;

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeout?: number }
): Promise<Response> {
  const { timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...fetchOptions.headers,
      },
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timeout', 408, 'TIMEOUT');
    }
    throw error;
  }
}

async function fetchWithRetry<T>(
  url: string,
  options: RequestInit & RequestOptions = {},
  retries = DEFAULT_RETRIES
): Promise<T> {
  try {
    const response = await fetchWithTimeout(url, options);
    
    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as Partial<ApiErrorType>;
      throw new ApiError(
        data.error ?? `Request failed: ${response.status}`,
        response.status,
        data.error ? 'API_ERROR' : 'HTTP_ERROR'
      );
    }
    
    return (await response.json()) as T;
  } catch (error) {
    if (retries > 0 && 
        error instanceof ApiError && 
        (error.status >= 500 || error.status === 408)) {
      // Retry on server errors or timeouts
      await new Promise(resolve => setTimeout(resolve, 1000 * (DEFAULT_RETRIES - retries + 1)));
      return fetchWithRetry<T>(url, options, retries - 1);
    }
    throw error;
  }
}

export async function apiGet<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  return fetchWithRetry<T>(url, {
    method: 'GET',
    cache: 'no-store',
    ...options,
  });
}

export async function apiPost<T>(
  url: string,
  payload: unknown,
  options: RequestOptions = {}
): Promise<T> {
  // Get CSRF token for POST requests
  const getCSRFToken = () => {
    if (typeof document !== 'undefined') {
      const meta = document.querySelector('meta[name="csrf-token"]');
      return meta?.getAttribute('content') || undefined;
    }
    return undefined;
  };

  const csrfToken = getCSRFToken();
  const headers: Record<string, string> = {
    ...options.headers,
  };
  
  if (csrfToken) {
    headers['X-CSRF-Token'] = csrfToken;
  }

  return fetchWithRetry<T>(url, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers,
    ...options,
  });
}

export async function apiPut<T>(
  url: string,
  payload: unknown,
  options: RequestOptions = {}
): Promise<T> {
  return fetchWithRetry<T>(url, {
    method: 'PUT',
    body: JSON.stringify(payload),
    ...options,
  });
}

export async function apiDelete<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  return fetchWithRetry<T>(url, {
    method: 'DELETE',
    ...options,
  });
}

export { ApiError };
