// Base API URL cleanup
const rawBase = import.meta.env.VITE_API_URL || "";
const API_BASE = rawBase.replace(/\/+$/g, "");

// Token Keys
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

// ------------------------------
// Token Helpers
// ------------------------------
export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function storeTokens({ access, refresh }) {
  if (access) localStorage.setItem(ACCESS_TOKEN_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// ------------------------------
// Login
// ------------------------------
export async function login(username, password) {
  const response = await fetch(`${API_BASE}/auth/token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message =
      errorBody.detail ||
      errorBody.non_field_errors?.[0] ||
      "Login failed. Please check credentials.";
    const error = new Error(message);
    error.status = response.status;
    error.body = errorBody;
    throw error;
  }

  const data = await response.json();
  storeTokens({ access: data.access, refresh: data.refresh });
  return data;
}

// ------------------------------
// Refresh Access Token
// ------------------------------
export async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) {
    clearTokens();
    return null;
  }

  const response = await fetch(`${API_BASE}/auth/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    clearTokens();
    return null;
  }

  const data = await response.json();
  if (data.access) {
    storeTokens({ access: data.access, refresh });
    return data.access;
  }

  return null;
}

// ------------------------------
// Reset Password (email + new password + confirm)
// ------------------------------
export async function resetPassword(email, newPassword, confirmPassword) {
  const response = await fetch(`${API_BASE}/auth/password/reset/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      new_password: newPassword,
      confirm_password: confirmPassword,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message =
      errorBody.detail ||
      errorBody.error ||
      "Password reset failed. Please try again.";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return await response.json();
}

// ------------------------------
// Logout
// ------------------------------
export function logout() {
  clearTokens();
}
