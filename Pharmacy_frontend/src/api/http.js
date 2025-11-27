import { getAccessToken, refreshAccessToken, clearTokens } from "./auth";

export async function authFetch(input, init = {}) {
  const initialOptions = { ...init };
  const headers = new Headers(initialOptions.headers || {});

  const token = getAccessToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  const options = { ...initialOptions, headers };

  let response = await fetch(input, options);

  if (response.status !== 401) {
    return response;
  }

  const refreshed = await refreshAccessToken();
  if (!refreshed) {
    clearTokens();
    return response;
  }

  const retryHeaders = new Headers(initialOptions.headers || {});
  retryHeaders.set("Authorization", `Bearer ${refreshed}`);
  if (!retryHeaders.has("Accept")) {
    retryHeaders.set("Accept", "application/json");
  }

  const retryOptions = { ...initialOptions, headers: retryHeaders };
  return fetch(input, retryOptions);
}

