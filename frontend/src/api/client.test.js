import { describe, it, expect, vi, beforeEach } from "vitest";

// Capture the interceptor handlers registered by the api client module so we
// can invoke them directly (no live HTTP involved).
let requestFulfilled;
let responseRejected;

vi.mock("axios", () => {
  const instance = {
    interceptors: {
      request: {
        use: (fulfilled) => {
          requestFulfilled = fulfilled;
        },
      },
      response: {
        use: (_ok, rejected) => {
          responseRejected = rejected;
        },
      },
    },
    defaults: { headers: {} },
  };
  return { default: { create: () => instance } };
});

vi.mock("../redux/authSlice", () => ({
  refreshSession: vi.fn(),
}));

beforeEach(async () => {
  requestFulfilled = undefined;
  responseRejected = undefined;
  localStorage.clear();
  vi.resetModules();
  await import("./client"); // registers both interceptors into our captures
});

describe("api client request interceptor", () => {
  it("attaches the Bearer token from localStorage to outgoing requests", () => {
    localStorage.setItem("userData", JSON.stringify({ token: "jwt-123" }));
    const config = requestFulfilled({ headers: {} });
    expect(config.headers.Authorization).toBe("Bearer jwt-123");
  });

  it("leaves requests unauthenticated when storage is empty or corrupt", () => {
    const config = requestFulfilled({ headers: {} });
    expect(config.headers.Authorization).toBeUndefined();

    localStorage.setItem("userData", "{{broken");
    const config2 = requestFulfilled({ headers: {} });
    expect(config2.headers.Authorization).toBeUndefined();
  });
});

describe("api client response interceptor", () => {
  it("normalizes network errors into a readable message", async () => {
    const error = new Error("Network Error");
    error.config = { url: "/api/doctors" }; // no response -> network failure
    await expect(responseRejected(error)).rejects.toThrow(/Network error/i);
  });

  it("normalizes API errors preserving message and status", async () => {
    const error = new Error("Request failed");
    error.config = { url: "/api/doctors" };
    error.response = {
      status: 403,
      data: { message: "Forbidden: doctors only" },
      statusText: "Forbidden",
    };
    await expect(responseRejected(error)).rejects.toMatchObject({
      message: "Forbidden: doctors only",
      status: 403,
    });
  });

  it("clears the stored session when a non-auth endpoint cannot refresh", async () => {
    const { refreshSession } = await import("../redux/authSlice");
    refreshSession.mockRejectedValueOnce(new Error("expired"));
    localStorage.setItem(
      "userData",
      JSON.stringify({ token: "old", _id: "1", role: "patient" })
    );
    const error = new Error("Unauthorized");
    error.config = { url: "/api/patient/appointments" };
    error.response = { status: 401, data: {}, statusText: "Unauthorized" };
    await expect(responseRejected(error)).rejects.toThrow(/Unauthorized/);
    expect(localStorage.getItem("userData")).toBeNull();
  });
});
