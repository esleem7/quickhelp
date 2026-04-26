const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const TOKEN_KEY = "quickhelp_token";
const USER_KEY = "quickhelp_user";

// ─── helpers ──────────────────────────────────────────────────────────────────

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): any | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAuth(user: any, token: string) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuth() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

export function isLoggedIn(): boolean {
  return !!getToken() && !!getStoredUser();
}

// ─── base request ─────────────────────────────────────────────────────────────

async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
) {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail || `Request failed (${response.status})`);
  }

  return response.json();
}

// ─── auth ─────────────────────────────────────────────────────────────────────

export const api = {
  // Auth
  register: (data: {
    full_name: string;
    email: string;
    password: string;
    city?: string;
    role?: string;
  }) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMe: (userId: string) => apiRequest(`/auth/me/${userId}`),

  // Requests
  getRequests: (params?: {
    category?: string;
    urgency?: string;
    city?: string;
    status?: string;
  }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v) query.append(k, v);
      });
    }
    const qs = query.toString();
    return apiRequest(`/requests${qs ? `?${qs}` : ""}`);
  },

  createRequest: (
    data: {
      title: string;
      description: string;
      category: string;
      urgency: string;
      city: string;
    },
    requesterId: string,
  ) =>
    apiRequest(`/requests?requester_id=${encodeURIComponent(requesterId)}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getRequestById: (requestId: string) =>
    apiRequest(`/requests/${requestId}`),

  updateRequest: (
    requestId: string,
    data: Record<string, string>,
  ) =>
    apiRequest(`/requests/${requestId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  startRequest: (requestId: string) =>
    apiRequest(`/requests/${requestId}/start`, {
      method: "POST",
    }),

  completeRequest: (requestId: string) =>
    apiRequest(`/requests/${requestId}/complete`, {
      method: "POST",
    }),

  cancelRequest: (requestId: string) =>
    apiRequest(`/requests/${requestId}/cancel`, {
      method: "POST",
    }),
};