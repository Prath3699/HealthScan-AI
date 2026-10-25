import React from "react";
import AppointmentPicker from "../components/Appointment/AppointmentPicker";
import DoctorIntro from "../components/Appointment/DoctorIntro";
import { ToastContainer } from "react-toastify";

const Appointment = () => {
  return (
    <div className="flex flex-col max-w-screen h-full">
      <ToastContainer />
      <DoctorIntro />
      <AppointmentPicker doctorId={"68888e0e7729dff42801add2"} />
    </div>
  );
};

export default Appointment;
