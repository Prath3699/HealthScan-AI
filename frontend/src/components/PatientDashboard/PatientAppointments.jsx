import React from "react";
import AppointmentCards from "./AppointmentCards";

const appointments = [
  {
    name: "Dr. John Doe",
    speciality: "Cardiology",
    dateTime: "2023-05-15, 10:00 AM",
  },
  {
    name: "Dr. Jane Smith",
    speciality: "Orthopedics",
    dateTime: "2023-05-20, 2:30 PM",
  },
  {
    name: "Dr. Bob Johnson",
    speciality: "Dermatology",
    dateTime: "2023-05-25, 9:00 AM",
  },
  {
    name: "Dr. Emily Davis",
    speciality: "Pediatrics",
    dateTime: "2023-05-30, 11:00 AM",
  },
];

const PatientAppointments = () => {
  return (
    <section className="bg-white p-3 rounded-lg space-y-3 w-full">
      <h2 className="text-xl font-bold text-gray-600">Latest Appointments</h2>
      <div className="flex flex-col gap-2 mx-1 my-1">
        {appointments.map((appointment, index) => (
          <AppointmentCards
            key={index}
            name={appointment.name}
            speciality={appointment.speciality}
            dateTime={appointment.dateTime}
          />
        ))}
      </div>
    </section>
  );
};

export default PatientAppointments;
