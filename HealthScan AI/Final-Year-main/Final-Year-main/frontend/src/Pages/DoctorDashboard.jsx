import React from "react";
import AllAppointment from "../components/DoctorDashboard/AllAppointment";
import AppointmentCalendar from "../components/DoctorDashboard/Calender/AppointmentCalender";
import HeaderCard from "../components/DoctorDashboard/HeaderCard";
import { ReminderComponent } from "../components/DoctorDashboard/Reminder";
import {
  Hourglass,
  Calendar,
  TriangleAlert,
} from "lucide-react/dist/cjs/lucide-react";

const doctorCards = [
  {
    number: "94",
    description: "Total number of scheduled Appointments",
    icon: Calendar,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    number: "32",
    description: "Total number of the pending Appointments",
    icon: Hourglass,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    number: "56",
    description: "Total numbers of cancelled Appointments",
    icon: TriangleAlert,
    iconBg: "bg-red-200",
    iconColor: "text-red-600",
  },
];

const DoctorDashboard = () => {
  return (
    <div className="flex flex-col md:px-3 lg:px-5 rounded-2xl">
      <div className="my-2 mt-7 lg:my-5 mx-3 lg:mx-5">
        <h1 className="text-2xl lg:text-3xl font-semibold text-gray-600">
          Welcome,Admin
        </h1>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nostrum,
          odio?
        </p>
      </div>
      <HeaderCard cards={doctorCards} className={"lg:ml-6"} />
      <div className="flex flex-col md:flex-row w-full">
        <AppointmentCalendar />
        <div className="flex flex-col gap-2 lg:gap-1 items-center">
          <ReminderComponent />
          <ReminderComponent />
          <ReminderComponent />
          <ReminderComponent />
        </div>
      </div>
      <AllAppointment />
    </div>
  );
};

export default DoctorDashboard;
