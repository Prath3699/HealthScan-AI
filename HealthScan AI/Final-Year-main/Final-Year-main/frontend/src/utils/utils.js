import moment from "moment";

// Format date for display
export const formatDateDisplay = (dateString) => {
  return moment(dateString).format("MMM D, YYYY");
};

// Get day name from date
export const getDayName = (dateString) => {
  return moment(dateString).format("dddd");
};

export const formatTime = (dateString) => {
  return moment(dateString).format("hh:mm A");
};
