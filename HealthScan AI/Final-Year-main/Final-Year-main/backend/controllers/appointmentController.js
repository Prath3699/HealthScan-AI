const Appointment = require("../model/appointmentSchema");
const Doctor = require("../model/doctorSchema");
const Patient = require("../model/patientSchema");
const Unavailability = require("../model/unavailablitySchema");
const moment = require("moment");

const bookAppointment = async (req, res) => {
  try {
    const { doctorId, patientId, day, time, reason } = req.body;

    console.log("Booking appointment with data:", {
      doctorId,
      patientId,
      day,
      time,
      reason,
    });

    // Extract time from the time object
    const startTime = time?.from; // "2025-08-04T10:30:00.000Z"
    const endTime = time?.to; // "2025-08-04T11:00:00.000Z"

    // Extract date from the day object
    const appointmentDate = day?.from; // "2025-08-04T10:00:00Z"

    if (!startTime || !endTime || !appointmentDate) {
      return res.status(400).json({ message: "Invalid time or day data" });
    }

    const appointmentDateTime = moment(startTime);
    const appointmentEndTime = moment(endTime);
    const appointmentDateOnly = moment(appointmentDate).startOf("day");

    // Validate doctor & patient existence
    const doctor = await Doctor.findById(doctorId);
    const patient = await Patient.findById(patientId);
    if (!doctor || !patient) {
      return res.status(404).json({ message: "Doctor or Patient not found" });
    }

    // Check if doctor is available that day
    const dayOfWeek = appointmentDateTime.format("dddd"); // "Monday"
    const availableSlot = doctor.availableSlots.find(
      (slot) => slot.day === dayOfWeek
    );

    if (!availableSlot) {
      return res
        .status(400)
        .json({ message: "Doctor not available on this day" });
    }

    // Convert doctor's slot times to moments for comparison
    // (stored as "HH:mm" strings, so they must be parsed with an explicit format)
    const dayBase = moment(appointmentDate).startOf("day");
    const slotFrom = dayBase.clone()
      .hour(moment(availableSlot.from, "HH:mm").hour())
      .minute(moment(availableSlot.from, "HH:mm").minute());
    const slotTo = dayBase.clone()
      .hour(moment(availableSlot.to, "HH:mm").hour())
      .minute(moment(availableSlot.to, "HH:mm").minute());

    // Check if requested time is within doctor's working hours
    if (
      appointmentDateTime.isBefore(slotFrom) ||
      appointmentEndTime.isAfter(slotTo)
    ) {
      return res.status(400).json({
        message: "Requested time is outside doctor's available hours",
      });
    }

    // Check for existing appointment conflict
    const existingAppointment = await Appointment.findOne({
      doctorId,
      status: { $in: ["Scheduled"] },
      $or: [
        {
          time: { $lt: appointmentEndTime.toDate() },
          endTime: { $gt: appointmentDateTime.toDate() },
        },
      ],
    });

    if (existingAppointment) {
      return res.status(409).json({ message: "Time slot already booked" });
    }

    // Create new appointment
    const newAppointment = new Appointment({
      doctorId,
      patientId,
      date: appointmentDateOnly.toDate(), // Store just the date part
      time: appointmentDateTime.toDate(), // Store as Date object
      endTime: appointmentEndTime.toDate(), // Store as Date object
      status: "Scheduled",
      reason,
    });

    await newAppointment.save();

    // Update doctor & patient
    doctor.appointments.push(newAppointment._id);
    doctor.patients.addToSet(patientId);

    patient.appointments.push(newAppointment._id);

    await doctor.save();
    await patient.save();

    return res.status(201).json({
      message: "Appointment booked successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const id = req.params.id;
    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    const docId = appointment.doctorId;
    const patientId = appointment.patientId;
    const doctor = await Doctor.findById(docId);
    const patient = await Patient.findById(patientId);
    doctor.appointments.pull(id);
    patient.appointments.pull(id);
    await doctor.save();
    await patient.save();
    return res
      .status(200)
      .json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res
        .status(400)
        .json({ message: "Doctor ID and date are required" });
    }

    // 1. Validate doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const requestedDate = moment(date);
    const dayOfWeek = requestedDate.format("dddd");

    // 2. Get doctor's working hours for that day
    const availableSlot = doctor.availableSlots.find(
      (slot) => slot.day === dayOfWeek
    );

    if (!availableSlot) {
      return res.status(200).json({
        date: requestedDate.format("YYYY-MM-DD"),
        availableSlots: [],
      });
    }

    // 3. Parse working hours (stored as "HH:mm" strings)
    const slotStart = moment(availableSlot.from, "HH:mm");
    const slotEnd = moment(availableSlot.to, "HH:mm");

    const workDayStart = requestedDate
      .clone()
      .hour(slotStart.hour())
      .minute(slotStart.minute())
      .second(0);

    const workDayEnd = requestedDate
      .clone()
      .hour(slotEnd.hour())
      .minute(slotEnd.minute())
      .second(0);

    // 4. Get all unavailability for this doctor on this date
    const startOfDay = requestedDate.clone().startOf("day").toDate();
    const endOfDay = requestedDate.clone().endOf("day").toDate();

    const unavailabilities = await Unavailability.find({
      doctorId,
      isActive: true,
      $or: [
        // Single day unavailability
        {
          startTime: { $gte: startOfDay, $lt: endOfDay },
        },
        // Multi-day unavailability that overlaps with requested day
        {
          startTime: { $lte: startOfDay },
          endTime: { $gt: startOfDay },
        },
        // Recurring unavailability
        {
          recurring: true,
          recurringDays: dayOfWeek,
          $or: [
            { recurringEndDate: { $gte: startOfDay } },
            { recurringEndDate: null },
          ],
        },
      ],
    });

    // 5. Get existing appointments
    const existingAppointments = await Appointment.find({
      doctorId,
      status: "Scheduled",
      time: { $gte: startOfDay, $lt: endOfDay },
    }).select("time endTime");

    // 6. Generate all possible slots
    const allSlots = [];
    const currentTime = workDayStart.clone();
    const appointmentDuration = 30; // minutes

    while (currentTime < workDayEnd) {
      const slotEndTime = currentTime
        .clone()
        .add(appointmentDuration, "minutes");

      if (slotEndTime <= workDayEnd) {
        allSlots.push({
          start: currentTime.toISOString(),
          end: slotEndTime.toISOString(),
          available: true,
        });
      }

      currentTime.add(appointmentDuration, "minutes");
    }

    // 7. Apply unavailability filters
    const filteredSlots = allSlots.map((slot) => {
      const slotStart = moment(slot.start);
      const slotEnd = moment(slot.end);

      // Check if slot conflicts with any unavailability
      const isUnavailable = unavailabilities.some((unavail) => {
        let unavailStart, unavailEnd;

        if (unavail.recurring) {
          // For recurring, use time from the requested date
          const timeStart = moment(unavail.startTime)
            .format("HH:mm")
            .split(":");
          const timeEnd = moment(unavail.endTime).format("HH:mm").split(":");

          unavailStart = requestedDate
            .clone()
            .hour(parseInt(timeStart[0]))
            .minute(parseInt(timeStart[1]))
            .second(0);

          unavailEnd = requestedDate
            .clone()
            .hour(parseInt(timeEnd[0]))
            .minute(parseInt(timeEnd[1]))
            .second(0);
        } else {
          unavailStart = moment(unavail.startTime);
          unavailEnd = moment(unavail.endTime);
        }

        return slotStart < unavailEnd && slotEnd > unavailStart;
      });

      // Check if slot conflicts with booked appointments
      const isBooked = existingAppointments.some((appointment) => {
        const appointmentStart = moment(appointment.time);
        const appointmentEnd = moment(appointment.endTime);

        return slotStart < appointmentEnd && slotEnd > appointmentStart;
      });

      return {
        ...slot,
        available: !isUnavailable && !isBooked,
      };
    });

    res.status(200).json({
      date: requestedDate.format("YYYY-MM-DD"),
      dayOfWeek,
      availableSlots: filteredSlots,
      workDayStart: workDayStart.toISOString(),
      workDayEnd: workDayEnd.toISOString(),
      totalSlots: filteredSlots.length,
      availableCount: filteredSlots.filter((slot) => slot.available).length,
    });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Invalid Appointment" });
    }

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not available" });
    }

    return res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAppointmentsforthatday = async (req, res) => {
  try {
    const { date } = req.query; // Expect: /thatDay?date=2025-02-18
    const {id}=req.user;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const d = new Date(date); // Convert input → Date object

    const start = new Date(Date.UTC(
      d.getUTCFullYear(),
      d.getUTCMonth(),
      d.getUTCDate(),
      0, 0, 0
    ));
    const end = new Date(Date.UTC(
      d.getUTCFullYear(),
      d.getUTCMonth(),
      d.getUTCDate(),
      23, 59, 59, 999
    ));

    const appointments = await Appointment.find({
      date: { $gte: start, $lte: end },
      $or: [{ doctorId: id }, { patientId: id }],
    })
      .populate("patientId")
      .populate("doctorId");

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
      message: "Appointments fetched successfully",
    });

  } catch (error) {
    console.error("Error fetching appointments for date:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  bookAppointment,
  cancelAppointment,
  getAppointmentById,
  getAvailableSlots,
  getAppointmentsforthatday
};
