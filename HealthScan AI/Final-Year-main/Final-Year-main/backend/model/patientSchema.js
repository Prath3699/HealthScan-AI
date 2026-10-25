const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    phone: String,
    gender: String,
    password: String,
    bloodGroup: String,
    age: Number,
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
      coordinates: {
        lat: Number,
        long: Number,
      },
    },
    medicalHistory: [
      {
        diseaseId: { type: mongoose.Schema.Types.ObjectId, ref: "Disease" }, // ref to Disease
        diagnosedOn: Date,
        notes: String,
      },
    ],
    appointments: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    ],
    reports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Report" }],
    aiPredictions: [],
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
