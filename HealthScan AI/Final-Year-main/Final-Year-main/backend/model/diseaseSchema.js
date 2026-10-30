const mongoose = require("mongoose");

const diseaseSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    precautions: String,
    medication: String,
    workflow: String,
    notes: String,
    symptoms: [String],
    spreadLevel: { type: String, enum: ["Low", "Moderate", "High"] },
    affectedRegions: [
      {
        city: String,
        state: String,
        country: String,
        coordinates: {
          lat: Number,
          long: Number,
        },
        caseCount: Number,
        lastUpdated: Date,
      },
    ],
  },
  { timestamps: true }
);

const Disease = mongoose.model("Disease", diseaseSchema);
module.exports = Disease;
