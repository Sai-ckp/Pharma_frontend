const rawBase = import.meta.env.VITE_API_URL || "";
const API_BASE = rawBase.replace(/\/+$/g, "");

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

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

/**
 * ✔ FAKE LOGIN
 *   - No backend call
 *   - Generates token locally
 */
export async function login(username, password) {
  const fakeAccess = "fake_access_token_" + Date.now();
  const fakeRefresh = "fake_refresh_token_" + Date.now();

  storeTokens({ access: fakeAccess, refresh: fakeRefresh });

  return {
    access: fakeAccess,
    refresh: fakeRefresh,
  };
}

/**
 * ✔ FAKE REFRESH (always returns same token)
 */
export async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) {
    clearTokens();
    return null;
  }

  const newAccess = "fake_access_token_" + Date.now();
  storeTokens({ access: newAccess, refresh });

  return newAccess;
}

export function logout() {
  clearTokens();
}
