import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import authReducer, {
  loginUser,
  logoutUser,
  refreshSession,
} from "./authSlice";

// Stub the shared axios client so thunks hit fakes instead of a live server.
const apiPost = vi.fn();
vi.mock("../api/client", () => ({
  default: { post: (...args) => apiPost(...args) },
  api: { post: (...args) => apiPost(...args) },
}));

// Stub bare axios (used by refresh/logout against the httpOnly cookie flow).
const rawPost = vi.fn();
vi.mock("axios", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    default: { ...(actual.default ?? {}), post: (...args) => rawPost(...args) },
    post: (...args) => rawPost(...args),
  };
});

const makeStore = () => configureStore({ reducer: { auth: authReducer } });

describe("authSlice", () => {
  beforeEach(() => {
    apiPost.mockReset();
    rawPost.mockReset();
    localStorage.clear();
  });

  it("bootstraps user state from localStorage with a safe parse", async () => {
    localStorage.setItem(
      "userData",
      JSON.stringify({ token: "t", id: "1", _id: "1", role: "doctor" })
    );
    // Fresh module registry so the slice re-runs its initial storage read.
    vi.resetModules();
    const mod = await import("./authSlice");
    const store = configureStore({ reducer: { auth: mod.default } });
    expect(store.getState().auth.user).toMatchObject({
      token: "t",
      role: "doctor",
    });
  });

  it("survives corrupt localStorage without crashing", async () => {
    localStorage.setItem("userData", "{not-json");
    vi.resetModules();
    const mod = await import("./authSlice");
    const store = configureStore({ reducer: { auth: mod.default } });
    expect(store.getState().auth.user).toBeNull();
    // The IIFE returns null but cannot remove the key itself; the app's
    // guard/interceptor layers clean up. Assert we simply don't crash and
    // no user is derived from garbage data.
  });

  it("loginUser.fulfilled stores the session and persists it", async () => {
    apiPost.mockResolvedValueOnce({
      data: { token: "abc", id: "42", role: "patient" },
    });
    const store = makeStore();
    await store.dispatch(loginUser({ email: "a@b.c", password: "pw", role: "patient" }));

    const { auth } = store.getState();
    expect(auth.loading).toBe(false);
    expect(auth.user).toMatchObject({ token: "abc", _id: "42", role: "patient" });
    expect(JSON.parse(localStorage.getItem("userData")).token).toBe("abc");
  });

  it("loginUser.rejected surfaces the server message via rejectWithValue", async () => {
    const err = new Error("boom");
    err.response = { data: { message: "Invalid credentials" } };
    apiPost.mockRejectedValueOnce(err);
    const store = makeStore();
    const action = await store.dispatch(
      loginUser({ email: "a@b.c", password: "bad", role: "patient" })
    );
    expect(action.type).toBe("auth/loginUser/rejected");
    expect(store.getState().auth.error).toBe("Invalid credentials");
    expect(store.getState().auth.user).toBeNull();
  });

  it("logoutUser revokes the server session and clears local state", async () => {
    localStorage.setItem(
      "userData",
      JSON.stringify({ token: "t", id: "1", _id: "1", role: "doctor" })
    );
    rawPost.mockResolvedValueOnce({ data: { message: "ok" } });
    const store = makeStore();
    await store.dispatch(logoutUser());
    expect(store.getState().auth.user).toBeNull();
    expect(localStorage.getItem("userData")).toBeNull();
    expect(rawPost).toHaveBeenCalled();
  });

  it("refreshSession persists the new token and dedupes concurrent calls", async () => {
    rawPost.mockResolvedValue({
      data: { token: "fresh", id: "7", _id: "7", role: "patient" },
    });
    const [a, b] = await Promise.all([refreshSession(), refreshSession()]);
    expect(a).toEqual(b);
    // One in-flight request shared by both callers.
    expect(rawPost).toHaveBeenCalledTimes(1);
    expect(JSON.parse(localStorage.getItem("userData")).token).toBe("fresh");
  });

  it("refreshSession resets its promise on failure so later retries work", async () => {
    rawPost.mockRejectedValueOnce(new Error("network"));
    await expect(refreshSession()).rejects.toThrow("network");
    rawPost.mockResolvedValueOnce({
      data: { token: "second", id: "7", _id: "7", role: "patient" },
    });
    const res = await refreshSession();
    expect(res.token).toBe("second");
  });
});
