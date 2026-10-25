const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    date: Date, // optional if you already store full DateTime in time
    time: { type: Date }, // changed from String → Date
    endTime: { type: Date }, // changed from String → Date
    status: { type: String, enum: ["Scheduled", "Completed", "Cancelled"] },
    reason: String,

    report: { type: mongoose.Schema.Types.ObjectId, ref: "Report" },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
