import React from "react";
import dayjs from "dayjs";

const STATUS_STYLES = {
  Scheduled: "bg-yellow-100 text-yellow-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const AppointmentCards = ({
  name,
  speciality,
  dateTime = "",
  isAppointment,
  status,
  onCancel,
  onReschedule,
}) => {
  const canAct = isAppointment && status === "Scheduled";
  return (
    <div className="flex rounded-lg w-full min-h-16 text-gray-600 justify-between items-center px-2 py-2 border border-gray-200 hover:bg-gray-100">
      <div className="flex items-center gap-2">
        <img
          className="rounded-full w-10 h-10 ml-1.5"
          src="https://cdn.pixabay.com/photo/2023-02-12/13/16/dog-7785066_1280.jpg"
          alt="doctor profile"
        />
        <div className="flex flex-col">
          <h2 className="font-semibold text-sm">Dr. {name}</h2>
          <p className="text-xs text-gray-600">{speciality}</p>
          {isAppointment && (
            <p className="text-xs text-gray-600">
              {dateTime
                ? dayjs(dateTime).format("ddd DD MMM YYYY, h:mm A")
                : "—"}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {status && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600"
            }`}
          >
            {status}
          </span>
        )}
        {canAct && (
          <>
            <button
              onClick={onReschedule}
              className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Reschedule
            </button>
            <button
              onClick={onCancel}
              className="rounded-md bg-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-red-100 hover:text-red-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AppointmentCards;
