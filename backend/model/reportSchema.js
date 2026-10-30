const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },

    diseases: { type: String, required: true },
    description: { type: String, required: true },
    precautions: { type: String},

    medicines: [
      {
        name: String,
        dosage: String,
        duration: String,
      },
    ],

    notes: String,
    nextVisit: Date,
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;
