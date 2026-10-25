import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import authReducer from "./redux/authSlice";
import RoleProtectRoute from "./components/ProtectedRoute/RoleProtectRoute";

vi.mock("axios", () => ({
  default: { post: vi.fn().mockResolvedValue({ data: {} }) },
  post: vi.fn().mockResolvedValue({ data: {} }),
}));
vi.mock("./api/client", () => ({
  default: { post: vi.fn() },
  api: { post: vi.fn() },
}));

const storeWith = (user) =>
  configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: { user, loading: false, error: null } },
  });

const renderGuard = ({ initialState, allowedRole }) =>
  render(
    <Provider store={storeWith(initialState)}>
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <RoleProtectRoute allowedRole={allowedRole}>
                <div>secret dashboard</div>
              </RoleProtectRoute>
            }
          />
          <Route path="/login" element={<div>login page</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

describe("RoleProtectRoute", () => {
  beforeEach(() => localStorage.clear());

  it("renders children when the Redux user has the allowed role", () => {
    renderGuard({
      initialState: { token: "t", _id: "1", role: "doctor" },
      allowedRole: "doctor",
    });
    expect(screen.getByText("secret dashboard")).toBeInTheDocument();
  });

  it("redirects to /login when there is no session at all", () => {
    renderGuard({ initialState: null, allowedRole: "doctor" });
    expect(screen.getByText("login page")).toBeInTheDocument();
    expect(screen.queryByText("secret dashboard")).not.toBeInTheDocument();
  });

  it("redirects when the signed-in role does not match", () => {
    renderGuard({
      initialState: { token: "t", _id: "1", role: "patient" },
      allowedRole: "doctor",
    });
    expect(screen.getByText("login page")).toBeInTheDocument();
  });

  it("falls back to localStorage on a fresh page load with empty Redux state", () => {
    localStorage.setItem(
      "userData",
      JSON.stringify({ token: "t", _id: "9", role: "patient" })
    );
    renderGuard({ initialState: null, allowedRole: "patient" });
    expect(screen.getByText("secret dashboard")).toBeInTheDocument();
  });

  it("treats corrupt localStorage as logged-out", () => {
    localStorage.setItem("userData", "!!!not json!!!");
    renderGuard({ initialState: null, allowedRole: "doctor" });
    expect(screen.getByText("login page")).toBeInTheDocument();
  });
});
