import axios from "axios";
import {
  Calendar,
  CalendarSearchIcon,
  Clock,
  Loader,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { formatDateDisplay, formatTime, getDayName } from "../../utils/utils";

const AppointmentForm = ({
  selectedTime,
  selectedDay,
  doctorId,
  patientId,
  doctorName,
  onSuccess,
}) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const handleAppointment = async (e) => {
    e.preventDefault();
    if (!selectedDay || !selectedTime || !doctorId || !patientId) {
      // toast
      toast("All fields are required to book an appointment !");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/api/appointment/book`,
        {
          day: selectedDay,
          time: selectedTime,
          patientId: patientId,
          doctorId: doctorId,
          reason: reason,
        }
      );
      if (response.data.appointment) {
        // toastTheme
        toast("Appointment booked successfully !");
        onSuccess();
        return;
      }
      toast(
        response.data.message ||
          "Something went wrong ! Please try again later.."
      );
    } catch (error) {
      console.log(error);
      toast(error?.response?.data?.message || error?.message);
    } finally {
      setLoading(false);
      onSuccess();
    }
  };

  return (
    <div className="border flex flex-col gap-2 border-gray-300 mx-auto px-4 py-2 rounded-lg w-full ">
      <div className="flex flex-col md:text-xl py-2 mx-auto gap-3">
        <h1> Your appointment details are as follows </h1>
        <h1 className="flex items-center gap-2">
          <User className="text-green-500 text-2xl" />{" "}
          {`Doctor Name : Dr. ${doctorName ? doctorName : "John Doe"}`}
        </h1>
        <h1 className="flex items-center gap-2">
          <Calendar className="text-red-500" />{" "}
          {"Day : " + getDayName(selectedTime.from)}
        </h1>
        <h1 className="flex items-center gap-2">
          <CalendarSearchIcon className="text-yellow-200" />{" "}
          {"Date : " + formatDateDisplay(selectedTime.from)}
        </h1>
        <h1 className="flex items-center gap-2">
          <Clock className="text-blue-500" />{" "}
          {"Time : " + formatTime(selectedTime.from)}{" "}
        </h1>
      </div>
      <form className="flex flex-col gap-4">
        <label
          htmlFor="reason"
          className="font-medium text-sm lg:text-xl text-gray-800"
        >
          Enter the reason for your appointment
        </label>
        <div>
          <textarea
            id="reason"
            placeholder="Enter your reason"
            required
            rows={3}
            onChange={(e) => {
              setReason(e.target.value);
            }}
            value={reason}
            className="w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-2 text-sm lg:text-xl text-black focus:outline-none focus:border-blue-600"
          />
        </div>
        <button
          type="submit"
          onClick={handleAppointment}
          className="w-full cursor-pointer self-end rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader className="animate-spin" />
              Booking..{" "}
            </span>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;
