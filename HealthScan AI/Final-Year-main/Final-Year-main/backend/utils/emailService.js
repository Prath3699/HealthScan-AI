const Appointment = require("../model/appointmentSchema");
const Doctor = require("../model/doctorSchema");
const Patient = require("../model/patientSchema");
const logger = require("./logger");

// Nodemailer is an OPTIONAL dependency: without SMTP credentials the app
// still runs and reminders are logged instead of emailed. Required lazily so
// the missing package never crashes the server.
let transporter = null;
let smtpChecked = false;

const getTransporter = () => {
  if (smtpChecked) return transporter;
  smtpChecked = true;
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    logger.warn("SMTP not configured - appointment reminders will be logged only");
    return null;
  }
  try {
    // eslint-disable-next-line global-require
    const nodemailer = require("nodemailer");
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE) === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  } catch (err) {
    logger.error("Failed to initialise SMTP transport", { error: err.message });
    transporter = null;
  }
  return transporter;
};

const sendMail = async ({ to, subject, text }) => {
  const t = getTransporter();
  if (!t) {
    logger.info("Reminder (SMTP not configured, not emailed)", { to, subject });
    return false;
  }
  await t.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
  });
  return true;
};

/**
 * Sends reminder emails for all "Scheduled" appointments starting within the
 * next `windowHours`. Idempotent per appointment via the `reminded` flag, so
 * running this every hour never double-notifies.
 */
const sendUpcomingReminders = async ({ windowHours = 24 } = {}) => {
  const now = new Date();
  const until = new Date(now.getTime() + windowHours * 60 * 60 * 1000);

  const upcoming = await Appointment.find({
    status: "Scheduled",
    reminded: false,
    time: { $gte: now, $lte: until },
  }).limit(200);

  let sent = 0;
  for (const appt of upcoming) {
    try {
      const doctor = await Doctor.findById(appt.doctorId).select("name email");
      const patient = await Patient.findById(appt.patientId).select("name email");
      if (!doctor?.email || !patient?.email) continue;

      const when = new Date(appt.time).toLocaleString("en-IN", {
        timeZone: process.env.TZ || "Asia/Kolkata",
      });
      const subject = "HealthScan AI - Appointment Reminder";
      const textFor = (who) =>
        `Hello ${who},\n\nThis is a reminder for your appointment on ${when}` +
        `${appt.reason ? ` (reason: ${appt.reason})` : ""}.\n\n- HealthScan AI`;

      const okPatient = await sendMail({
        to: patient.email,
        subject,
        text: textFor(patient.name),
      });
      await sendMail({
        to: doctor.email,
        subject,
        text: textFor(doctor.name),
      });

      if (okPatient) {
        appt.reminded = true;
        await appt.save();
        sent += 1;
      }
    } catch (err) {
      logger.error("Reminder failed for appointment", {
        appointmentId: String(appt._id),
        error: err.message,
      });
    }
  }

  if (upcoming.length > 0) {
    logger.info("Appointment reminder run finished", {
      checked: upcoming.length,
      emailed: sent,
    });
  }
  return { checked: upcoming.length, emailed: sent };
};

module.exports = { sendUpcomingReminders, sendMail };
