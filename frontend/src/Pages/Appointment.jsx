import React from "react";
import { useSelector } from "react-redux";
import AppointmentPicker from "../components/Appointment/AppointmentPicker";
import DoctorIntro from "../components/Appointment/DoctorIntro";
import { ToastContainer } from "react-toastify";
import { useParams } from "react-router-dom";
import { selectAuthUser } from "../redux/selectors";

/**
 * Booking page. The doctor is taken from the URL (/appointment/:doctorId)
 * instead of a hardcoded id, and the signed-in patient id comes from the
 * auth session (never hard-coded).
 */
const Appointment = () => {
  const { doctorId } = useParams();
  const reduxUser = useSelector(selectAuthUser);
  // Redux is the source of truth; fall back to storage only on a fresh page load.
  const userData =
    reduxUser ??
    (() => {
      try {
        return JSON.parse(localStorage.getItem("userData"));
      } catch {
        return null;
      }
    })();
  const patientId = userData?._id || userData?.id;

  if (!doctorId) {
    return (
      <div className="text-center text-gray-600 mt-10 text-lg">
        No doctor selected. Browse doctors from the Search page to book an
        appointment.
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-screen h-full">
      <ToastContainer />
      <DoctorIntro />
      <AppointmentPicker doctorId={doctorId} patientId={patientId} />
    </div>
  );
};

export default Appointment;
