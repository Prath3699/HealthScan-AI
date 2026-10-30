import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import api from "../../api/client";

const formatSlotLabel = (iso) => dayjs(iso).format("ddd DD MMM YYYY, h:mm A");

const RescheduleModal = ({ appointment, onClose, onSuccess }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState("");
  const [error, setError] = useState("");

  const doctorId = appointment?.doctorId?._id || appointment?.doctorId;

  // Candidate dates: today + next 6 days (skips days the doctor doesn't work,
  // which simply come back with zero available slots).
  const candidateDates = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) =>
        dayjs().add(i, "day").startOf("day")
      ),
    []
  );

  useEffect(() => {
    let cancelled = false;
    const loadSlots = async () => {
      setLoading(true);
      setError("");
      try {
        // Public endpoint: one call per day, returns slots flagged `available`.
        const responses = await Promise.all(
          candidateDates.map((d) =>
            api
              .get("/api/appointment/available-slots", {
                params: { doctorId, date: d.toISOString() },
              })
              .catch(() => null)
          )
        );
        const free = [];
        responses.forEach((res, idx) => {
          const slots = res?.data?.availableSlots ?? [];
          slots
            .filter((slot) => slot.available)
            .forEach((slot) =>
              free.push({ ...slot, dateKey: candidateDates[idx].format("YYYY-MM-DD") })
            );
        });
        if (!cancelled) setSlots(free);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Could not load available slots.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadSlots();
    return () => {
      cancelled = true;
    };
  }, [doctorId, candidateDates]);

  const sortedSlots = useMemo(
    () =>
      [...slots].sort((a, b) =>
        dayjs(a.start).isAfter(dayjs(b.start)) ? 1 : -1
      ),
    [slots]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) {
      setError("Please pick a new time slot.");
      return;
    }
    const slot = sortedSlots[Number(selected)];
    const start = slot.start;
    const end = slot.end;
    setSaving(true);
    setError("");
    try {
      await api.patch(`/api/appointment/reschedule/${appointment._id}`, {
        day: { from: dayjs(start).startOf("day").toISOString() },
        time: { from: start, to: end },
      });
      onSuccess?.();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Reschedule failed. Please try another slot."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Reschedule appointment"
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-gray-700">
          Reschedule Appointment
        </h3>
        <p className="mb-3 text-sm text-gray-500">
          Currently:{" "}
          {appointment?.time ? formatSlotLabel(appointment.time) : "—"}
        </p>

        {loading && (
          <p className="text-sm text-gray-500">Loading available slots…</p>
        )}
        {!loading && sortedSlots.length === 0 && (
          <p className="text-sm text-gray-500">
            No free slots in the next few days. Please try again later.
          </p>
        )}

        {!loading && sortedSlots.length > 0 && (
          <form onSubmit={handleSubmit}>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="mb-3 w-full rounded-md border border-gray-300 p-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>
                Select a new slot…
              </option>
              {sortedSlots.map((slot, i) => (
                <option key={`${slot.dateKey}-${i}`} value={String(i)}>
                  {formatSlotLabel(slot.start)} – {dayjs(slot.end).format("h:mm A")}
                </option>
              ))}
            </select>

            {error && <p className="mb-2 text-sm text-red-600">{error}</p>}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Confirm Reschedule"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RescheduleModal;
