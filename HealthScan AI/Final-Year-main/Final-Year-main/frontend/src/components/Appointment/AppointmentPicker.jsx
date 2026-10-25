import React, { useEffect, useState } from "react";
import AppointmentDateTimeCard from "./AppointmentDateTimeCard";
import { ModalBody, ModalHeader } from "flowbite-react";
import { Modal } from "flowbite-react";
import AppointmentForm from "./AppointmentForm";
import { useSelector } from "react-redux";
import { selectAuth, selectLoading } from "../../redux/rootSlice";
import axios from "axios";
import moment from "moment";
import { Loader } from "lucide-react";

const AppointmentPicker = ({ doctorId }) => {
  const [openModal, setOpenModal] = useState(false);
  const { user } = useSelector(selectAuth);

  const [availableSlot, setAvailableSlot] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [dateSlotLoader, setDateSlotLoader] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch doctor's available days
  useEffect(() => {
    if (doctorId) {
      fetchDoctorAvailability();
    }
  }, [doctorId]);

  // Fetch available time slots when a day is selected
  useEffect(() => {
    if (selectedDay && doctorId) {
      fetchAvailableSlots(selectedDay);
    }
  }, [selectedDay, doctorId]);

  // Fetch doctor's working days
  const fetchDoctorAvailability = async () => {
    try {
      setLoadingSlots(true);
      setError(null);
      setAvailableSlot(true);

      console.log("🔍 Fetching doctor availability for:", doctorId);
      const response = await axios.get(
        `${API_BASE_URL}/api/doctors/${doctorId}`
      );

      if (response.data.availableSlots) {
        // Remove duplicate days - keep only one entry per day
        const uniqueSlots = removeDuplicateDays(response.data.availableSlots);
        setAvailableSlot(uniqueSlots);

        // Set first available day as default selection
        if (uniqueSlots.length > 0) {
          setSelectedDay(uniqueSlots[0]);
        }

        console.log("Available slots:", uniqueSlots);
      }
    } catch (error) {
      console.error("Error fetching doctor availability:", error);
      setError("Failed to load doctor availability");
    } finally {
      setLoadingSlots(false);
      setDateSlotLoader(false);
    }
  };

  // Remove duplicate days from available slots
  const removeDuplicateDays = (slots) => {
    const seenDays = new Set();
    const uniqueSlots = [];

    slots.forEach((slot) => {
      if (!seenDays.has(slot.day)) {
        seenDays.add(slot.day);
        uniqueSlots.push(slot);
      }
    });

    return uniqueSlots;
  };

  // Fetch available time slots for selected day
  const fetchAvailableSlots = async (day) => {
    try {
      setLoadingSlots(true);
      setError(null);
      setTimeSlots([]);

      // Extract date from the selected day
      const date = moment(day.from).format("YYYY-MM-DD");

      console.log("Fetching available slots for:", { doctorId, date });

      const response = await axios.get(
        `${API_BASE_URL}/api/appointment/available-slots`,
        {
          params: {
            doctorId: doctorId,
            date: date,
          },
        }
      );

      if (response.data.availableSlots) {
        console.log("Available time slots:", response.data.availableSlots);

        // Transform the backend response to match your frontend format
        const transformedSlots = response.data.availableSlots.map((slot) => ({
          from: slot.start,
          to: slot.end,
          available: slot.available,
        }));

        setTimeSlots(transformedSlots);
      }
    } catch (error) {
      console.error("Error fetching available slots:", error);
      setError("Failed to load available time slots");
      setTimeSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Handle time slot selection
  const handleTimeSelect = (time) => {
    if (time.available) {
      setSelectedTime(time);
      setOpenModal(true);
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setOpenModal(false);
  };

  // Format date for display
  const formatDateDisplay = (dateString) => {
    return moment(dateString).format("MMM D, YYYY");
  };

  // Get day name from date
  const getDayName = (dateString) => {
    return moment(dateString).format("dddd");
  };

  return (
    <div className="flex flex-col mt-9 w-full items-center border border-gray-300 bg-gray-50 rounded-lg gap-3">
      <div className="flex flex-col w-full p-3 lg:p-5 gap-4">
        <h1 className="text-xl text-gray-700 lg:text-2xl font-medium">
          Select Date to schedule the Appointment :
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-3 lg:grid-cols-7 bg-white border border-gray-200 rounded-lg justify-center gap-3 p-4 w-full">
          {dateSlotLoader ? (
            <div className="col-span-full flex gap-2 items-center justify-center text-center py-4">
              <Loader className="animate-spin" /> Loading available dates...
            </div>
          ) : availableSlot.length > 0 ? (
            availableSlot.map((item, index) => (
              <AppointmentDateTimeCard
                key={index}
                selectedDate={selectedDay}
                date={item}
                isDate={true}
                setSelectedDate={setSelectedDay}
                displayText={getDayName(item.from)}
                subText={formatDateDisplay(item.from)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-4 text-gray-500">
              No available dates found
            </div>
          )}
        </div>
      </div>

      <span className="w-full border-b mx-3 border-gray-300"></span>

      <div className="w-full px-3 lg:px-5 py-4">
        <h1 className="text-xl text-gray-700 ml-2 lg:text-2xl font-medium">
          Select Time to schedule the Appointment :
        </h1>

        {selectedDay && (
          <div className="ml-2 mt-2 text-sm text-gray-600">
            Showing slots for {getDayName(selectedDay.from)} -{" "}
            {formatDateDisplay(selectedDay.from)}
          </div>
        )}

        <div className="grid grid-cols-3 p-4 rounded-lg lg:grid-cols-6 w-full bg-white border lg:p-6 border-gray-200 mt-5 gap-3 md:gap-4 lg:gap-5">
          {loadingSlots ? (
            <div className="col-span-full flex gap-2 items-center justify-center text-center py-4">
              <Loader className="animate-spin" /> Loading time...
            </div>
          ) : timeSlots.length > 0 ? (
            timeSlots.map((time, index) => (
              <AppointmentDateTimeCard
                isDate={false}
                time={time}
                key={index}
                setSelectedTime={handleTimeSelect}
                selectedTime={selectedTime}
                setOpenModal={setOpenModal}
                disabled={!time.available}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-4 text-gray-500">
              {selectedDay
                ? "No time slots available for selected date"
                : "Select a date first"}
            </div>
          )}
        </div>

        <Modal
          show={openModal}
          size="md"
          position="top-center"
          onClose={handleModalClose}
          className="mt-28"
          dismissible
        >
          <ModalHeader>
            <div className="text-center px-3">
              Please provide some more details !
            </div>
          </ModalHeader>
          <ModalBody>
            <AppointmentForm
              selectedTime={selectedTime}
              selectedDay={selectedDay}
              doctorId={doctorId}
              patientId={"68888dfb86635ac8bdd3e4a3"}
              onSuccess={() => {
                setOpenModal(false);
                setSelectedTime(null);
                if (selectedDay) {
                  fetchAvailableSlots(selectedDay);
                }
              }}
            />
          </ModalBody>
        </Modal>
      </div>
    </div>
  );
};

export default AppointmentPicker;
