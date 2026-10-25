import axios from "axios";

// Single source of truth for the backend URL.
// Set VITE_BACKEND_URL in your .env file (see .env.example).
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";

/**
 * Shared axios instance.
 * - `baseURL` is pre-fixed, so call sites use paths like "/api/doctors".
 * - The auth token stored by the auth slice is attached automatically.
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
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

// Normalize errors so consumers always get a readable message.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(
        new Error("Network error: unable to reach the server.")
      );
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
