import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the api client before importing the component under test.
vi.mock("../../../api/client", () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn(),
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
import PatientAppointments from "../PatientAppointments";

const scheduledAppointment = {
  _id: "appt1",
  status: "Scheduled",
  time: "2030-05-15T10:00:00.000Z",
  doctorId: { _id: "doc1", name: "John Doe", specialization: ["Cardiology"] },
};

describe("PatientAppointments", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders real upcoming appointments from the API with action buttons", async () => {
    api.get.mockResolvedValueOnce({
      data: { success: true, appointments: [scheduledAppointment] },
    });

    render(<PatientAppointments />);

    await waitFor(() => {
      expect(screen.getByText("Dr. John Doe")).toBeInTheDocument();
    });
    expect(screen.getByText("Cardiology")).toBeInTheDocument();
    expect(screen.getByText("Scheduled")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /reschedule/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("shows an empty state when there are no appointments", async () => {
    api.get.mockResolvedValueOnce({
      data: { success: true, appointments: [] },
    });

    render(<PatientAppointments />);

    await waitFor(() => {
      expect(screen.getByText(/no upcoming appointments/i)).toBeInTheDocument();
    });
  });

  it("hides action buttons for non-Scheduled appointments", async () => {
    api.get.mockResolvedValueOnce({
      data: {
        success: true,
        appointments: [
          { ...scheduledAppointment, _id: "appt2", status: "Completed" },
        ],
      },
    });

    render(<PatientAppointments />);

    await waitFor(() => {
      expect(screen.getByText("Completed")).toBeInTheDocument();
    });
    expect(
      screen.queryByRole("button", { name: /reschedule/i })
    ).not.toBeInTheDocument();
  });
});
