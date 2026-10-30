// models/Unavailability.js
const mongoose = require("mongoose");

const unavailabilitySchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "LUNCH_BREAK",
        "OPERATION",
        "EMERGENCY_LEAVE",
        "MEETING",
        "VACATION",
        "PERSONAL_BREAK",
        "OTHER",
      ],
      required: true,
    },
    title: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    recurring: { type: Boolean, default: false },
    recurringDays: [{ type: String }], // ["Monday", "Tuesday", ...]
    recurringEndDate: Date, // for recurring events end
    reason: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Unavailability", unavailabilitySchema);
