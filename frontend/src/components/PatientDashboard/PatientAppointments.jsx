import React, { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import api from "../../api/client";
import AppointmentCards from "./AppointmentCards";
import RescheduleModal from "./RescheduleModal";

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/appointment/upcoming", {
        params: { limit: 10 },
      });
      if (res.data?.success) {
        setAppointments(res.data.appointments ?? []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not load your appointments.");
    } finally {
      setLoading(false);
    }
  }, []);

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

  const handleRescheduleSuccess = () => {
    setRescheduleTarget(null);
    toast.success("Appointment rescheduled successfully.");
    fetchAppointments();
  };

  return (
    <section className="bg-white p-3 rounded-lg space-y-3 w-full">
      <h2 className="text-xl font-bold text-gray-600">Latest Appointments</h2>
      <div className="flex flex-col gap-2 mx-1 my-1">
        {loading && (
          <p className="text-sm text-gray-500">Loading appointments…</p>
        )}
        {!loading && appointments.length === 0 && (
          <p className="text-sm text-gray-500">
            No upcoming appointments. Book one from a doctor's profile page.
          </p>
        )}
        {!loading &&
          appointments.map((appointment) => {
            const doctor = appointment.doctorId ?? {};
            return (
              <AppointmentCards
                key={appointment._id}
                name={doctor.name ?? "Unknown"}
                speciality={(doctor.specialization ?? []).join(", ")}
                dateTime={
                  appointment.time
                    ? dayjs(appointment.time).toISOString()
                    : ""
                }
                isAppointment
                status={appointment.status}
                onCancel={() => handleCancel(appointment)}
                onReschedule={() => setRescheduleTarget(appointment)}
              />
            );
          })}
      </div>

      {rescheduleTarget && (
        <RescheduleModal
          appointment={rescheduleTarget}
          onClose={() => setRescheduleTarget(null)}
          onSuccess={handleRescheduleSuccess}
        />
      )}
    </section>
  );
};

export default PatientAppointments;
