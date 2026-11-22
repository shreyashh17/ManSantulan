/* ==========================================================================
   MANSANTULAN (मन संतुलन) — API CLIENT & TOKEN MANAGER
   ========================================================================== */

const API_BASE = window.location.origin;

class ApiClient {
  constructor() {
    this.tokenKey = "mansantulan_access_token";
    this.refreshKey = "mansantulan_refresh_token";
    this.userKey = "mansantulan_user";
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  getRefreshToken() {
    return localStorage.getItem(this.refreshKey);
  }

  getUser() {
    try {
      return JSON.parse(localStorage.getItem(this.userKey));
    } catch {
      return null;
    }
  }

  setSession(token, refreshToken, user) {
    if (token) localStorage.setItem(this.tokenKey, token);
    if (refreshToken) localStorage.setItem(this.refreshKey, refreshToken);
    if (user) localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  clearSession() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshKey);
    localStorage.removeItem(this.userKey);
  }

  async request(endpoint, options = {}) {
    const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint}`;
    const headers = options.headers || {};
    
    if (!headers["Content-Type"] && !(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    let response = await fetch(url, { ...options, headers });

    // Handle 401 Token Expiration with Auto-Refresh
    if (response.status === 401 && this.getRefreshToken()) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        headers["Authorization"] = `Bearer ${this.getToken()}`;
        response = await fetch(url, { ...options, headers });
      } else {
        this.clearSession();
        window.location.href = "/login";
        throw new Error("Session expired. Please log in again.");
      }
    }

    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMsg = data.detail || (typeof data === "string" ? data : "Request failed");
      throw new Error(errorMsg);
    }

    return data;
  }

  async refreshToken() {
    const rf = this.getRefreshToken();
    if (!rf) return false;
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: rf })
      });
      if (res.ok) {
        const data = await res.json();
        this.setSession(data.access_token, data.refresh_token, data.user);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // Auth Methods
  async login(email, password) {
    const data = await this.request("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    this.setSession(data.access_token, data.refresh_token, data.user);
    return data;
  }

  async register(name, email, password, age_group = "18-24", consent = true) {
    const data = await this.request("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, age_group, consent })
    });
    this.setSession(data.access_token, data.refresh_token, data.user);
    return data;
  }

  async me() {
    const user = await this.request("/api/v1/auth/me");
    localStorage.setItem(this.userKey, JSON.stringify(user));
    return user;
  }

  async updateOnboarding(primary_language, wellness_goals, reminder_frequency) {
    const user = await this.request("/api/v1/auth/onboarding", {
      method: "PUT",
      body: JSON.stringify({ primary_language, wellness_goals, reminder_frequency })
    });
    localStorage.setItem(this.userKey, JSON.stringify(user));
    return user;
  }

  async updateProfile(name, age_group) {
    const user = await this.request("/api/v1/auth/profile", {
      method: "PUT",
      body: JSON.stringify({ name, age_group })
    });
    localStorage.setItem(this.userKey, JSON.stringify(user));
    return user;
  }

  async changePassword(current_password, new_password) {
    return this.request("/api/v1/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ current_password, new_password })
    });
  }

  async forgotPassword(email) {
    return this.request("/api/v1/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email })
    });
  }

  async resetPassword(token, new_password) {
    return this.request("/api/v1/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, new_password })
    });
  }

  async exportData() {
    return this.request("/api/v1/auth/privacy-export");
  }

  async deleteAccount() {
    const res = await this.request("/api/v1/auth/privacy-delete", { method: "DELETE" });
    this.clearSession();
    return res;
  }

  // Assessment Predict Method
  async predict(payload) {
    return this.request("/predict", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }

  logout() {
    this.clearSession();
    window.location.href = "/login";
  }
}

window.api = new ApiClient();
