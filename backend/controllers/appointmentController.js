const Appointment = require("../model/appointmentSchema");
const Doctor = require("../model/doctorSchema");
const Patient = require("../model/patientSchema");
const Unavailability = require("../model/unavailablitySchema");
const dayjs = require("dayjs");
const ApiError = require("../utils/ApiError");

// Reset the reminder idempotency flag when an appointment is moved or revived
// so the new slot also gets a reminder. (Cancellation keeps it as-is.)
const rescheduleAwareSave = async (appointment) => {
  if (appointment.isModified("time") && appointment.reminded) {
    appointment.reminded = false;
  }
  await appointment.save();
};

const APPOINTMENT_DURATION_MINUTES = 30;

// Parse an "HH:mm" string into { hour, minute } without a heavy date library.
const parseHHmm = (str) => {
  const [h, m] = String(str).split(":").map(Number);
  return { hour: h, minute: m };
};

const bookAppointment = async (req, res) => {
  const { doctorId, patientId, day, time, reason } = req.body;

  const startTime = time?.from;
  const endTime = time?.to;
  const appointmentDate = day?.from;

  if (!startTime || !endTime || !appointmentDate) {
    throw new ApiError(400, "Invalid time or day data");
  }

  const appointmentDateTime = dayjs(startTime);
  const appointmentEndTime = dayjs(endTime);
  const appointmentDateOnly = dayjs(appointmentDate).startOf("day");

  // Validate doctor & patient existence
  const doctor = await Doctor.findById(doctorId);
  const patient = await Patient.findById(patientId);
  if (!doctor || !patient) throw new ApiError(404, "Doctor or Patient not found");

  // Check if doctor is available that day
  const dayOfWeek = appointmentDateTime.format("dddd"); // "Monday"
  const availableSlot = doctor.availableSlots.find((slot) => slot.day === dayOfWeek);
  if (!availableSlot) throw new ApiError(400, "Doctor not available on this day");

  // Convert doctor's slot times ("HH:mm" strings) to concrete moments for comparison
  const dayBase = dayjs(appointmentDate).startOf("day");
  const from = parseHHmm(availableSlot.from);
  const to = parseHHmm(availableSlot.to);
  const slotFrom = dayBase.hour(from.hour).minute(from.minute).second(0);
  const slotTo = dayBase.hour(to.hour).minute(to.minute).second(0);

  // Check if requested time is within doctor's working hours
  if (
    appointmentDateTime.isBefore(slotFrom) ||
    appointmentEndTime.isAfter(slotTo)
  ) {
    throw new ApiError(400, "Requested time is outside doctor's available hours");
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
  if (existingAppointment) throw new ApiError(409, "Time slot already booked");

  // Create new appointment
  const newAppointment = await Appointment.create({
    doctorId,
    patientId,
    date: appointmentDateOnly.toDate(), // Store just the date part
    time: appointmentDateTime.toDate(),
    endTime: appointmentEndTime.toDate(),
    status: "Scheduled",
    reason,
  });

  // Update doctor & patient cross-references
  doctor.appointments.push(newAppointment._id);
  doctor.patients.addToSet(patientId);
  patient.appointments.push(newAppointment._id);
  await doctor.save();
  await patient.save();

  return res.status(201).json({
    message: "Appointment booked successfully",
    appointment: newAppointment,
  });
};

const cancelAppointment = async (req, res) => {
  const id = req.params.id;
  const appointment = await Appointment.findById(id);
  if (!appointment) throw new ApiError(404, "Appointment not found");

  // Only the involved doctor or patient may cancel.
  const actor = String(req.user.id);
  const involved =
    actor === String(appointment.doctorId) ||
    actor === String(appointment.patientId);
  if (!involved) throw new ApiError(403, "Not authorized to cancel this appointment");

  // Mark cancelled instead of hard-deleting so history is preserved.
  appointment.status = "Cancelled";
  await appointment.save();

  const doctor = await Doctor.findById(appointment.doctorId);
  const patient = await Patient.findById(appointment.patientId);
  if (doctor) {
    doctor.appointments.pull(id);
    await doctor.save();
  }
  if (patient) {
    patient.appointments.pull(id);
    await patient.save();
  }

  return res.status(200).json({ message: "Appointment cancelled successfully" });
};

/**
 * PATCH /api/appointment/reschedule/:id
 * Move an existing Scheduled appointment to a new slot. Re-runs the same
 * availability/conflict checks as booking, keeps doctor/patient cross-refs
 * in sync, and resets the reminder flag via rescheduleAwareSave so the new
 * slot also gets a reminder email.
 */
const rescheduleAppointment = async (req, res) => {
  const id = req.params.id;
  const { day, time } = req.body;

  const startTime = time?.from;
  const endTime = time?.to;
  const appointmentDate = day?.from;
  if (!startTime || !endTime || !appointmentDate) {
    throw new ApiError(400, "Invalid time or day data");
  }

  const appointment = await Appointment.findById(id);
  if (!appointment) throw new ApiError(404, "Appointment not found");
  if (appointment.status !== "Scheduled") {
    throw new ApiError(400, `Cannot reschedule a ${appointment.status.toLowerCase()} appointment`);
  }

  // Only the involved doctor or patient may reschedule.
  const actor = String(req.user.id);
  const involved =
    actor === String(appointment.doctorId) ||
    actor === String(appointment.patientId);
  if (!involved) throw new ApiError(403, "Not authorized to reschedule this appointment");

  const appointmentDateTime = dayjs(startTime);
  const appointmentEndTime = dayjs(endTime);
  if (!appointmentEndTime.isAfter(appointmentDateTime)) {
    throw new ApiError(400, "End time must be after start time");
  }

  const doctor = await Doctor.findById(appointment.doctorId);
  if (!doctor) throw new ApiError(404, "Doctor not found");

  // Check the doctor is working on that weekday and the slot is within hours.
  const dayOfWeek = appointmentDateTime.format("dddd");
  const availableSlot = doctor.availableSlots.find((slot) => slot.day === dayOfWeek);
  if (!availableSlot) throw new ApiError(400, "Doctor not available on this day");

  const dayBase = dayjs(appointmentDate).startOf("day");
  const from = parseHHmm(availableSlot.from);
  const to = parseHHmm(availableSlot.to);
  const slotFrom = dayBase.hour(from.hour).minute(from.minute).second(0);
  const slotTo = dayBase.hour(to.hour).minute(to.minute).second(0);
  if (
    appointmentDateTime.isBefore(slotFrom) ||
    appointmentEndTime.isAfter(slotTo)
  ) {
    throw new ApiError(400, "Requested time is outside doctor's available hours");
  }

  // Conflict check against other (non-cancelled) appointments of this doctor.
  const conflicting = await Appointment.findOne({
    _id: { $ne: id },
    doctorId: doctor._id,
    status: { $in: ["Scheduled"] },
    time: { $lt: appointmentEndTime.toDate() },
    endTime: { $gt: appointmentDateTime.toDate() },
  });
  if (conflicting) throw new ApiError(409, "Time slot already booked");

  // Blocked by a doctor unavailability window (lunch break, leave, etc.)?
  const blocked = await Unavailability.findOne({
    doctorId: doctor._id,
    isActive: true,
    startTime: { $lt: appointmentEndTime.toDate() },
    endTime: { $gt: appointmentDateTime.toDate() },
  });
  if (blocked) throw new ApiError(409, "Doctor is unavailable during this time");

  // Apply the new slot (time/endTime/date), resetting the reminder flag.
  appointment.time = appointmentDateTime.toDate();
  appointment.endTime = appointmentEndTime.toDate();
  appointment.date = dayjs(appointmentDate).startOf("day").toDate();
  await rescheduleAwareSave(appointment);

  return res.status(200).json({
    message: "Appointment rescheduled successfully",
    appointment,
  });
};

const getAvailableSlots = async (req, res) => {
  const { doctorId, date } = req.query;
  if (!doctorId || !date) {
    throw new ApiError(400, "Doctor ID and date are required");
  }

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) throw new ApiError(404, "Doctor not found");

  const requestedDate = dayjs(date);
  const dayOfWeek = requestedDate.format("dddd");

  const availableSlot = doctor.availableSlots.find((slot) => slot.day === dayOfWeek);
  if (!availableSlot) {
    return res.status(200).json({
      date: requestedDate.format("YYYY-MM-DD"),
      availableSlots: [],
    });
  }

  // Parse working hours (stored as "HH:mm" strings)
  const slotStart = parseHHmm(availableSlot.from);
  const slotEnd = parseHHmm(availableSlot.to);

  const workDayStart = requestedDate
    .hour(slotStart.hour)
    .minute(slotStart.minute)
    .second(0);
  const workDayEnd = requestedDate
    .hour(slotEnd.hour)
    .minute(slotEnd.minute)
    .second(0);

  const startOfDay = requestedDate.startOf("day").toDate();
  const endOfDay = requestedDate.endOf("day").toDate();

  const unavailabilities = await Unavailability.find({
    doctorId,
    isActive: true,
    $or: [
      { startTime: { $gte: startOfDay, $lt: endOfDay } },
      { startTime: { $lte: startOfDay }, endTime: { $gt: startOfDay } },
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

  const existingAppointments = await Appointment.find({
    doctorId,
    status: "Scheduled",
    time: { $gte: startOfDay, $lt: endOfDay },
  }).select("time endTime");

  // Generate all possible slots
  const allSlots = [];
  let cursor = workDayStart;
  while (cursor.isBefore(workDayEnd)) {
    const slotEndTime = cursor.add(APPOINTMENT_DURATION_MINUTES, "minute");
    if (!slotEndTime.isAfter(workDayEnd)) {
      allSlots.push({
        start: cursor.toISOString(),
        end: slotEndTime.toISOString(),
        available: true,
      });
    }
    cursor = cursor.add(APPOINTMENT_DURATION_MINUTES, "minute");
  }

  // Apply unavailability & booking filters
  const filteredSlots = allSlots.map((slot) => {
    const slotStartD = dayjs(slot.start);
    const slotEndD = dayjs(slot.end);

    const isUnavailable = unavailabilities.some((unavail) => {
      let unavailStart, unavailEnd;
      if (unavail.recurring) {
        const tS = new Date(unavail.startTime);
        const tE = new Date(unavail.endTime);
        unavailStart = requestedDate
          .hour(tS.getUTCHours())
          .minute(tS.getUTCMinutes())
          .second(0);
        unavailEnd = requestedDate
          .hour(tE.getUTCHours())
          .minute(tE.getUTCMinutes())
          .second(0);
      } else {
        unavailStart = dayjs(unavail.startTime);
        unavailEnd = dayjs(unavail.endTime);
      }
      return slotStartD.isBefore(unavailEnd) && slotEndD.isAfter(unavailStart);
    });

    const isBooked = existingAppointments.some((appointment) => {
      const aStart = dayjs(appointment.time);
      const aEnd = dayjs(appointment.endTime);
      return slotStartD.isBefore(aEnd) && slotEndD.isAfter(aStart);
    });

    return { ...slot, available: !isUnavailable && !isBooked };
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
};

const getAppointmentById = async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) throw new ApiError(404, "Appointment not available");

  // Only the involved doctor or patient may read it.
  const actor = String(req.user.id);
  const involved =
    actor === String(appointment.doctorId) ||
    actor === String(appointment.patientId);
  if (!involved) throw new ApiError(403, "Not authorized to view this appointment");

  return res.status(200).json({ success: true, appointment });
};

const getAppointmentsforthatday = async (req, res) => {
  const { date } = req.query; // Expect: /day?date=2025-02-18
  const id = req.user && req.user.id;

  if (!date) throw new ApiError(400, "Date is required");

  const d = new Date(date);
  if (Number.isNaN(d.getTime())) throw new ApiError(400, "Invalid date");

  const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0));
  const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999));

  // Pagination (safe defaults & caps)
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);

  const filter = {
    date: { $gte: start, $lte: end },
    $or: [{ doctorId: id }, { patientId: id }],
  };

  const [total, appointments] = await Promise.all([
    Appointment.countDocuments(filter),
    Appointment.find(filter)
      .sort({ time: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("patientId")
      .populate("doctorId"),
  ]);

  return res.status(200).json({
    success: true,
    count: appointments.length,
    total, // full match count for pagination UI
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    appointments,
    message: "Appointments fetched successfully",
  });
};

/**
 * GET /api/appointment/upcoming?page=&limit=
 * Paginated list of the caller's future Scheduled appointments.
 */
const getUpcomingForUser = async (req, res) => {
  const id = req.user && req.user.id;

  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);

  const filter = {
    $or: [{ doctorId: id }, { patientId: id }],
    status: "Scheduled",
    time: { $gte: new Date() },
  };

  const [total, appointments] = await Promise.all([
    Appointment.countDocuments(filter),
    Appointment.find(filter)
      .sort({ time: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("patientId")
      .populate("doctorId"),
  ]);

  return res.status(200).json({
    success: true,
    count: appointments.length,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    appointments,
  });
};

module.exports = {
  bookAppointment,
  cancelAppointment,
  rescheduleAppointment,
  getAppointmentById,
  getAvailableSlots,
  getAppointmentsforthatday,
  getUpcomingForUser,
};
