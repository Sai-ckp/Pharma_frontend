import axios from "axios";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "1";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
});

// --- Simple mock db (change as you like) ---
const MOCK_USERS = [
  { id: 1, username: "Sai", password: "password123", name: "Sai Shashank", role: "Admin" },
  { id: 2, username: "demo", password: "demo", name: "Demo User", role: "Staff" },
];

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function login(username, password) {
  if (USE_MOCK) {
    await delay(500); // simulate network
    const user = MOCK_USERS.find(
      (u) => u.username === username && u.password === password
    );
    if (!user) {
      const err = new Error("Invalid username or password");
      err.status = 401;
      throw err;
    }
    return {
      token: "mock-token-" + btoa(username),
      user: { id: user.id, name: user.name, username: user.username, role: user.role },
    };
  }

  // Real API (enable once backend is ready)
  const { data } = await api.post("/auth/login/", { username, password });
  return data; // expected shape: { token: "...", user: {...} }
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function storeSession({ token, user }) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem("token");
}
