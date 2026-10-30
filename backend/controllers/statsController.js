const Appointment = require("../model/appointmentSchema");
const Doctor = require("../model/doctorSchema");
const Patient = require("../model/patientSchema");
const ApiError = require("../utils/ApiError");

/**
 * GET /api/stats/summary
 * Returns real appointment/report counts for the logged-in user's dashboard
 * stat cards, replacing the hardcoded placeholder numbers in the frontend.
 *
 * Doctor response: { success, role: "Doctor", stats: { scheduled, pending, cancelled } }
 *   - scheduled: Scheduled appointments at or after now (upcoming)
 *   - pending:   all remaining Scheduled appointments (today/past not yet marked done)
 *   - cancelled: Cancelled appointments (lifetime)
 *
 * Patient response: { success, role: "Patient", stats: { upcoming, past, reports } }
 *   - upcoming: Scheduled appointments at or after now
 *   - past:     lifetime appointment history (Completed + Cancelled) plus any
 *               Scheduled appointment whose time has already passed
 *   - reports:  number of medical records on the patient document
 */
const getDashboardSummary = async (req, res) => {
  const id = req.user && req.user.id;
  const role = req.user && req.user.role;
  const now = new Date();

  if (role === "Doctor") {
    const doctor = await Doctor.findById(id).select("appointments");
    if (!doctor) throw new ApiError(404, "Doctor profile not found");

    const [scheduledTotal, scheduledUpcoming, cancelled] = await Promise.all([
      Appointment.countDocuments({ doctorId: id, status: "Scheduled" }),
      Appointment.countDocuments({
        doctorId: id,
        status: "Scheduled",
        time: { $gte: now },
      }),
      Appointment.countDocuments({ doctorId: id, status: "Cancelled" }),
    ]);

    return res.status(200).json({
      success: true,
      role: "Doctor",
      stats: {
        scheduled: scheduledUpcoming,
        pending: scheduledTotal - scheduledUpcoming,
        cancelled,
      },
    });
  }

  if (role === "Patient") {
    const patient = await Patient.findById(id).select("reports");
    if (!patient) throw new ApiError(404, "Patient profile not found");

    const [upcoming, completed, cancelled, overdue] = await Promise.all([
      Appointment.countDocuments({
        patientId: id,
        status: "Scheduled",
        time: { $gte: now },
      }),
      Appointment.countDocuments({ patientId: id, status: "Completed" }),
      Appointment.countDocuments({ patientId: id, status: "Cancelled" }),
      Appointment.countDocuments({
        patientId: id,
        status: "Scheduled",
        time: { $lt: now },
      }),
    ]);

    return res.status(200).json({
      success: true,
      role: "Patient",
      stats: {
        upcoming,
        past: completed + cancelled + overdue,
        reports: patient.reports.length,
      },
    });
  }

  throw new ApiError(403, "Unknown role for dashboard summary");
};

module.exports = { getDashboardSummary };
