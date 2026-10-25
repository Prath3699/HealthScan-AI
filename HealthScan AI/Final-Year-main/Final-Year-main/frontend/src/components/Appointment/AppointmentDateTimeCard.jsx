import moment from "moment";

const AppointmentDateTimeCard = ({
  isDate,
  date,
  time,
  selectedDate,
  selectedTime,
  setSelectedDate,
  setSelectedTime,
  setOpenModal,
  disabled = false,
  displayText,
  subText,
}) => {
  const handleDateClick = () => {
    setSelectedDate(date);
  };

  const handleTimeClick = () => {
    if (!disabled) {
      setSelectedTime(time);
      if (setOpenModal) {
        setOpenModal(true);
      }
    }
  };

  if (isDate) {
    const isSelected = selectedDate?.from === date.from;

    return (
      <div
        className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
          isSelected
            ? "bg-blue-500 text-white border-blue-500 shadow-md"
            : "bg-white border-gray-300 hover:border-blue-300 hover:shadow-sm"
        }`}
        onClick={handleDateClick}
      >
        <span className="text-sm font-medium">
          {displayText || moment(date.from).format("ddd")}
        </span>
        <span className="text-xs mt-1 opacity-80">
          {subText || moment(date.from).format("MMM D")}
        </span>
      </div>
    );
  }

  const isSelected = selectedTime?.from === time.from;
  const isAvailable = !disabled;

  return (
    <div
      className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg transition-all ${
        !isAvailable
          ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
          : isSelected
          ? "bg-blue-500 text-white border-blue-500 shadow-md cursor-pointer"
          : "bg-white border-gray-300 hover:border-blue-300 hover:shadow-sm cursor-pointer"
      }`}
      onClick={handleTimeClick}
      title={
        !isAvailable
          ? "This slot is not available"
          : `Book at ${moment(time.from).format("hh:mm A")}`
      }
    >
      <span
        className={`text-sm font-medium ${
          isAvailable && isSelected ? "text-white" : ""
        }`}
      >
        {moment(time.from).format("hh:mm A")}
      </span>
      {!isAvailable && <span className="text-xs mt-1">Unavailable</span>}
    </div>
  );
};

export default AppointmentDateTimeCard;
