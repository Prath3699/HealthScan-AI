import dayjs from "dayjs";

// Format date for display
export const formatDateDisplay = (dateString) => {
  return dayjs(dateString).format("MMM D, YYYY");
};

// Get day name from date
export const getDayName = (dateString) => {
  return dayjs(dateString).format("dddd");
};

export const formatTime = (dateString) => {
  return dayjs(dateString).format("hh:mm A");
};
