import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the api client before importing the component under test.
vi.mock("../../../api/client", () => ({
  default: {
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("react-toastify", () => ({
  toast: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  }),
}));

import api from "../../../api/client";
import AllAppointment from "../AllAppointment";

const scheduledAppointment = {
  _id: "appt1",
  status: "Scheduled",
  time: "2030-05-15T10:00:00.000Z",
  patientId: { _id: "pat1", name: "Alice Cooper" },
};

describe("Doctor AllAppointment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders real appointments fetched from the upcoming endpoint", async () => {
    api.get.mockResolvedValueOnce({
      data: { success: true, appointments: [scheduledAppointment] },
    });

    render(<AllAppointment />);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        "/api/appointment/upcoming",
        expect.any(Object)
      );
    });
    expect(await screen.findByText("Alice Cooper")).toBeInTheDocument();
    expect(screen.getByText("Scheduled")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("shows the empty state when there are no appointments", async () => {
    api.get.mockResolvedValueOnce({
      data: { success: true, appointments: [] },
    });

    render(<AllAppointment />);

    await waitFor(() => {
      expect(
        screen.getByText(/Sorry No Appointments available/i)
      ).toBeInTheDocument();
    });
  });

  it("hides the cancel action for non-Scheduled appointments", async () => {
    api.get.mockResolvedValueOnce({
      data: {
        success: true,
        appointments: [
          { ...scheduledAppointment, _id: "appt2", status: "Completed" },
        ],
      },
    });

    render(<AllAppointment />);

    await screen.findByText("Alice Cooper");
    expect(screen.queryByRole("button", { name: /cancel/i })).toBeNull();
  });
});
