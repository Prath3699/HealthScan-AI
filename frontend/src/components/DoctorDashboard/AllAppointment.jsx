import React, { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";
import api from "../../api/client";

const STATUS_STYLES = {
  Scheduled: "bg-green-200 text-green-800",
  Completed: "bg-blue-100 text-blue-800",
  Cancelled: "bg-red-400 text-white",
};

/**
 * Doctor-facing appointment table, fed by the real booking API.
 * Defaults to the doctor's upcoming Scheduled appointments
 * (GET /api/appointment/upcoming); can switch to a specific day
 * (GET /api/appointment/day?date=YYYY-MM-DD).
 */
const AllAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("upcoming"); // "upcoming" | "day"
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const res =
        view === "day"
          ? await api.get("/api/appointment/day", { params: { date } })
          : await api.get("/api/appointment/upcoming", {
              params: { limit: 50 },
            });
      setAppointments(res.data?.appointments ?? []);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Could not load appointments.");
    } finally {
      setLoading(false);
    }
  }, [view, date]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleCancel = async (appointment) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await api.delete(`/api/appointment/cancel/${appointment._id}`);
      toast.success("Appointment cancelled.");
      fetchAppointments();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to cancel appointment."
      );
    }
  };

  return (
    <div className="flex flex-col items-center px-5 bg-white border border-gray-300 rounded-2xl mt-3 lg:mx-4 w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full my-3">
        <h1 className="text-gray-700 text-2xl font-semibold">
          All Appointments
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setView("upcoming")}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              view === "upcoming"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setView("day")}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              view === "day"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            By day
          </button>
          {view === "day" && (
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-2 py-1 rounded-lg border border-gray-300 text-sm text-gray-600"
            />
          )}
        </div>
      </div>

      <div className="overflow-x-auto max-w-full w-full my-3 lg:my-5">
        {loading ? (
          <p className="flex items-center gap-2 text-gray-500 py-4">
            <Loader className="animate-spin" size={18} /> Loading
            appointments…
          </p>
        ) : appointments.length === 0 ? (
          <h1 className="text-gray-500 py-4">Sorry No Appointments available</h1>
        ) : (
          <table className="rounded-lg w-full">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="px-2 py-2 text-left">Patient name</th>
                <th className="px-2 py-2 text-left">Date &amp; Time</th>
                <th className="px-2 py-2 text-left">Status</th>
                <th className="px-2 py-2 text-left">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((item) => {
                const patient = item.patientId ?? {};
                const fullName = patient.name ?? "Unknown patient";
                const canAct = item.status === "Scheduled";
                return (
                  <tr
                    key={item._id}
                    className="bg-white border-b border-gray-300"
                  >
                    <td className="px-3 py-2 font-medium text-gray-900">
                      {fullName}
                    </td>
                    <td className="px-2 py-2">
                      {item.time
                        ? dayjs(item.time).format("ddd, MMM D YYYY, h:mm A")
                        : "—"}
                    </td>
                    <td className="px-2 py-2">
                      <span
                        className={`inline-block rounded-2xl px-3 py-1 text-center text-sm ${
                          STATUS_STYLES[item.status] ??
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-2 py-2">
                      {canAct && (
                        <button
                          onClick={() => handleCancel(item)}
                          className="font-medium text-red-600 hover:underline cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AllAppointment;
