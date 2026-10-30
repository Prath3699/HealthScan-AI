import React from "react";

const AppointmentCards = ({
  name,
  speciality,
  dateTime = "",
  isAppointment,
}) => {
  return (
    <div className="flex rounded-lg w-full h-16 text-gray-600 justify-between items-center  px-2 border-1 border-gray-200 hover:bg-gray-100 ">
      <div className="flex justify-center items-center gap-2">
        <img
          className="rounded-full w-10 h-10 ml-1.5"
          src="https://cdn.pixabay.com/photo/2023/02/12/13/16/dog-7785066_1280.jpg"
          alt="doctor profile"
        />
        <div className="flex flex-col">
          <h2 className="font-semibold text-sm">Dr. {name}</h2>
          <p className="text-xs text-gray-600"> {speciality}</p>
          {isAppointment && <p className="text-xs text-gray-600">{dateTime}</p>}
        </div>
      </div>
      {isAppointment && (
        <button className="px-4 py-2 rounded-md cursor-pointer font-medium text-center bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          Join
        </button>
      )}
    </div>
  );
};

export default AppointmentCards;
