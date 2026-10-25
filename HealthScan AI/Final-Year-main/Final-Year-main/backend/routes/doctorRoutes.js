const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const asyncHandler = require("../utils/asyncHandler");
const { protect, requireRole } = require("../middleware/roleAuth");
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

// Public: self-registration of doctors
doctorRoutes.post(
  "/add",
  validate([
    body("name").trim().notEmpty().withMessage("name is required"),
    body("email").isEmail().withMessage("A valid email is required"),
    body("phone")
      .matches(/^[0-9+\-\s]{7,15}$/)
      .withMessage("A valid phone number is required"),
    body("age").isInt({ min: 18, max: 100 }).withMessage("age must be 18-100"),
    body("specialization")
      .isArray({ min: 1 })
      .withMessage("specialization must be a non-empty array"),
    body("experience")
      .isInt({ min: 0, max: 100 })
      .withMessage("experience must be 0-100"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("password must be at least 8 characters"),
    body("location")
      .isObject()
      .withMessage("location object is required"),
  ]),
  asyncHandler(addDoctor)
);

// Public: doctor directory / profile viewing (used by patients searching)
doctorRoutes.get("/", asyncHandler(getDoctors));
doctorRoutes.get("/:doctorId", asyncHandler(getDoctorById));

// Doctor-only: manage own schedule & profile
doctorRoutes.post(
  "/unavailablity",
  protect,
  requireRole("Doctor"),
  validate([
    body("doctorId").isMongoId().withMessage("Valid doctorId is required"),
    body("type").notEmpty().withMessage("type is required"),
    body("startTime").isISO8601().withMessage("startTime must be an ISO date"),
    body("endTime").isISO8601().withMessage("endTime must be an ISO date"),
  ]),
  asyncHandler(createUnavailability)
);

doctorRoutes.get(
  "/unavailability/:doctorId",
  protect,
  asyncHandler(getDoctorUnavailabilities)
);

doctorRoutes.post(
  "/slots",
  protect,
  requireRole("Doctor"),
  validate([
    body("doctorId").isMongoId().withMessage("Valid doctorId is required"),
    body("day")
      .isIn([
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ])
      .withMessage("day must be a weekday name"),
    body("from").matches(/^\d{2}:\d{2}$/).withMessage("from must be HH:mm"),
    body("to").matches(/^\d{2}:\d{2}$/).withMessage("to must be HH:mm"),
  ]),
  asyncHandler(addDoctorSlot)
);

doctorRoutes.put(
  "/slots",
  protect,
  requireRole("Doctor"),
  validate([
    body("doctorId").isMongoId().withMessage("Valid doctorId is required"),
    body("day").notEmpty().withMessage("day is required"),
    body("from").matches(/^\d{2}:\d{2}$/).withMessage("from must be HH:mm"),
    body("to").matches(/^\d{2}:\d{2}$/).withMessage("to must be HH:mm"),
  ]),
  asyncHandler(updateDoctorSlot)
);

// Admin-level operations: only the doctor themself may update/delete their record
doctorRoutes.put(
  "/update/:id",
  protect,
  requireRole("Doctor"),
  (req, res, next) => {
    if (req.params.id !== req.user.id) {
      return next({ statusCode: 403, message: "Can only update your own profile" });
    }
    next();
  },
  asyncHandler(updateDoctor)
);

doctorRoutes.delete(
  "/delete/:id",
  protect,
  requireRole("Doctor"),
  (req, res, next) => {
    if (req.params.id !== req.user.id) {
      return next({ statusCode: 403, message: "Can only delete your own account" });
    }
    next();
  },
  asyncHandler(deleteDoctor)
);

module.exports = doctorRoutes;
