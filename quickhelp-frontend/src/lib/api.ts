const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

async function request(path: string, options: RequestInit = {}) {
    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
    });

    let data: any = null;

    try {
        data = await res.json();
    } catch {
        data = null;
    }

    if (!res.ok) {
        throw new Error(data?.detail || data?.message || `API error ${res.status}`);
    }

    return data;
}

export function setAuth(user: any, token: string) {
    localStorage.setItem("quickhelp_user", JSON.stringify(user));
    localStorage.setItem("quickhelp_token", token);
}

export function getStoredUser() {
    const raw = localStorage.getItem("quickhelp_user");
    if (!raw) return null;

    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function logout() {
    localStorage.removeItem("quickhelp_user");
    localStorage.removeItem("quickhelp_token");
}

export const api = {
    register(payload: {
        full_name: string;
        email: string;
        password: string;
        city?: string;
        role?: string;
    }) {
        return request("/auth/register", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    login(payload: { email: string; password: string }) {
        return request("/auth/login", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    me(userId: string) {
        return request(`/auth/me/${userId}`);
    },

    getRequests(params?: Record<string, string>) {
        const query = params ? new URLSearchParams(params).toString() : "";
        return request(`/requests${query ? `?${query}` : ""}`);
    },

    getRequestById(id: string) {
        return request(`/requests/${id}`);
    },

    createRequest(
        payload: {
            title: string;
            description: string;
            category: string;
            urgency: string;
            city: string;
        },
        userId: string,
    ) {
        return request(`/requests?user_id=${userId}`, {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    startRequest(id: string) {
        return request(`/requests/${id}/start`, {
            method: "PATCH",
        });
    },

    completeRequest(id: string) {
        return request(`/requests/${id}/complete`, {
            method: "PATCH",
        });
    },

    cancelRequest(id: string) {
        return request(`/requests/${id}/cancel`, {
            method: "PATCH",
        });
    },
};