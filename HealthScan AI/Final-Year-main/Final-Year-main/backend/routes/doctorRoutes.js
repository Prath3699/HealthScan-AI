const express = require("express");
const {
  addDoctor,
  addDoctorSlot,
  getDoctorById,
  getDoctors,
  updateDoctor,
  deleteDoctor,
  updateDoctorSlot,
  createUnavailability,
  getDoctorUnavailabilities,
} = require("../controllers/doctorController");
const doctorRoutes = express.Router();

// add Doctor
doctorRoutes.post("/add", addDoctor);

doctorRoutes.post("/unavailablity", createUnavailability);

doctorRoutes.get("/unavailability/:doctorId", getDoctorUnavailabilities);

// add slot
doctorRoutes.post("/slots", addDoctorSlot);

// update slot
doctorRoutes.put("/slots", updateDoctorSlot);

// get Doctor by id
doctorRoutes.get("/:doctorId", getDoctorById);

// get Doctors
doctorRoutes.get("/", getDoctors);

// update Doctor
doctorRoutes.put("/update/:id", updateDoctor);

// delete Doctor
doctorRoutes.delete("/delete/:id", deleteDoctor);

module.exports = doctorRoutes;
