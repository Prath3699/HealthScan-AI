import axios from "axios";
import { refreshSession } from "../redux/authSlice";

// Single source of truth for the backend URL.
// Set VITE_BACKEND_URL in your .env file (see .env.example). On Vercel set it
// in Project Settings -> Environment Variables; in Docker it is baked in as a
// build arg (see frontend/Dockerfile / docker-compose.yml).
const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";

/**
 * Shared axios instance.
 * - `baseURL` is pre-fixed, so call sites use paths like "/api/doctors".
 * - The auth token stored by the auth slice is attached automatically.
 * - On a 401 it transparently refreshes the access token once (via the
 *   httpOnly refresh cookie) and replays the original request.
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // send the refresh cookie to /api/auth endpoints
});

// Attach the JWT (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("userData");
    if (raw) {
      const { token } = JSON.parse(raw);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch {
    // Corrupt storage – ignore, request proceeds unauthenticated.
  }
  return config;
});

const clearSession = () => {
  localStorage.removeItem("userData");
};

// Normalize errors so consumers always get a readable message.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      return Promise.reject(
        new Error("Network error: unable to reach the server.")
      );
    }

    const original = error.config;
    const status = error.response.status;
    const isAuthEndpoint =
      original?.url === "/api/login" || original?.url?.startsWith("/api/auth");

    // Expired access token -> silent refresh + replay (once per request).
    if (status === 401 && original && !original._retried && !isAuthEndpoint) {
      original._retried = true;
      try {
        await refreshSession();
        return api(original);
      } catch {
        clearSession();
      }
    }

    if (status === 401 && isAuthEndpoint) {
      // Refresh/login rejected outright: session is gone.
      if (original?.url !== "/api/login") clearSession();
    }

    const message =
      error.response.data?.message || error.response.statusText || "Request failed.";
    const normalized = new Error(message);
    normalized.status = error.response.status;
    normalized.data = error.response.data;
    return Promise.reject(normalized);
  }
);

export default api;
